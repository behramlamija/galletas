// Local development server with rebuild-on-change and live reload.
//   node build/dev.mjs          watch src/, rebuild, reload the browser
//   node build/dev.mjs --dist   just serve the existing dist/ (production preview)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT, SRC, DIST } from './lib/load.js';

const PREVIEW = process.argv.includes('--dist');
const PORT = Number(process.env.PORT) || 5173;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};
const RELOAD_SNIPPET = '<script src="/__reload.js"></script>';
const RELOAD_JS = `new EventSource('/__events').onmessage = (e) => { if (e.data === 'reload') location.reload(); };`;

const clients = new Set();

function runBuild() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'build', 'build.mjs'), '--dev'], { stdio: 'inherit' });
    child.on('exit', (code) => resolve(code === 0));
  });
}

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (!PREVIEW && pathname === '/__reload.js') return send(res, 200, RELOAD_JS, MIME['.js']);
  if (!PREVIEW && pathname === '/__events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let file = path.join(DIST, decodeURIComponent(pathname));
  if (!file.startsWith(DIST)) return send(res, 403, 'Forbidden', MIME['.txt']);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file)) {
    file = path.join(DIST, '404.html');
    status = 404;
    if (!fs.existsSync(file)) return send(res, 404, 'Not found', MIME['.txt']);
  }
  const ext = path.extname(file);
  let body = fs.readFileSync(file);
  if (ext === '.html' && !PREVIEW) body = body.toString().replace('</body>', `${RELOAD_SNIPPET}</body>`);
  send(res, status, body, MIME[ext] || 'application/octet-stream');
});

if (!PREVIEW) {
  await runBuild();
  let timer;
  let building = false;
  let queued = false;
  const rebuild = async () => {
    if (building) return void (queued = true);
    building = true;
    const ok = await runBuild();
    building = false;
    if (ok) for (const c of clients) c.write('data: reload\n\n');
    if (queued) {
      queued = false;
      rebuild();
    }
  };
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  });
}

server.listen(PORT, () => {
  console.log(`\n  ${PREVIEW ? 'Preview' : 'Dev server'} running at http://localhost:${PORT}/\n`);
});
