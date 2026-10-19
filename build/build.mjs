// Main build: JSON data + template functions → static site in dist/.
//   node build/build.mjs          development build (readable output)
//   node build/build.mjs --prod   minified, hashed assets, strict checks
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import { ROOT, SRC, DIST, loadData, missingContent } from './lib/load.js';
import { createContext } from './lib/context.js';
import { processImages } from './images.mjs';
import { placeholderSvg } from './lib/placeholder.js';

const FONTS = [
  { family: 'Fraunces', pkg: '@fontsource-variable/fraunces', file: 'fraunces-{subset}-soft-normal.woff2', weight: '100 900', preload: true },
  { family: 'DM Sans', pkg: '@fontsource-variable/dm-sans', file: 'dm-sans-{subset}-wght-normal.woff2', weight: '100 1000', preload: true },
  { family: 'Caveat', pkg: '@fontsource/caveat', file: 'caveat-{subset}-400-normal.woff2', weight: '400' },
];
const UNICODE = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
};

const write = (rel, content) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const hash = (content) => crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);

export async function build({ prod = false, dev = false } = {}) {
  const started = Date.now();
  const warnings = new Set();
  const warn = (msg) => warnings.add(msg);
  const data = loadData();
  const { site, dicts } = data;
  const base = (site.basePath || '').replace(/\/$/, '');

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // ── Fonts ────────────────────────────────────────────────────────────────
  let fontCss = '';
  const preloads = [];
  for (const font of FONTS) {
    for (const subset of ['latin', 'latin-ext']) {
      const name = font.file.replace('{subset}', subset);
      const from = path.join(ROOT, 'node_modules', font.pkg, 'files', name);
      if (!fs.existsSync(from)) {
        warn(`font missing: ${font.pkg}/${name} (run npm install)`);
        continue;
      }
      write(`assets/fonts/${name}`, fs.readFileSync(from));
      fontCss += `@font-face{font-family:"${font.family}";font-style:normal;font-display:swap;font-weight:${font.weight};src:url("fonts/${name}") format("woff2");unicode-range:${UNICODE[subset]}}\n`;
      if (font.preload && subset === 'latin') preloads.push(`${base}/assets/fonts/${name}`);
    }
  }

  // ── CSS & JS ─────────────────────────────────────────────────────────────
  const emit = (name, ext, content) => {
    const file = prod ? `${name}.${hash(content)}.${ext}` : `${name}.${ext}`;
    write(`assets/${file}`, content);
    return `${base}/assets/${file}`;
  };
  const cssResult = await esbuild.build({
    entryPoints: [path.join(SRC, 'css', 'main.css')],
    bundle: true,
    write: false,
    minify: prod,
    target: ['chrome100', 'safari15', 'firefox100', 'edge100'],
    logLevel: 'silent',
  });
  const css = fontCss + cssResult.outputFiles[0].text;

  const bundle = async (entry, format) =>
    (
      await esbuild.build({
        entryPoints: [path.join(SRC, 'js', entry)],
        bundle: true,
        write: false,
        format,
        minify: prod,
        target: ['es2020', 'safari15'],
        legalComments: 'none',
        logLevel: 'silent',
      })
    ).outputFiles[0].text;

  const assets = {
    css: emit('main', 'css', css),
    js: emit('main', 'js', await bundle('main.js', 'esm')),
    theme: emit('theme', 'js', await bundle('theme.js', 'iife')),
    fonts: preloads,
  };
  // The language redirect is referenced from the root page only; keep a stable name.
  write('assets/lang-redirect.js', await bundle('lang-redirect.js', 'iife'));

  // ── Images ───────────────────────────────────────────────────────────────
  const { manifest, dir: imgDir } = await processImages({ log: () => {} });
  for (const entry of Object.values(manifest)) {
    for (const f of entry.files) write(`assets/img/${f}`, fs.readFileSync(path.join(imgDir, f)));
  }
  const placeholders = new Map();

  // ── Favicon & manifest ──────────────────────────────────────────────────
  const faviconDir = path.join(SRC, 'assets', 'favicon');
  for (const f of fs.readdirSync(faviconDir)) write(`assets/favicon/${f}`, fs.readFileSync(path.join(faviconDir, f)));
  try {
    const sharp = (await import('sharp')).default;
    const svg = fs.readFileSync(path.join(faviconDir, 'favicon.svg'));
    for (const size of [180, 192, 512]) {
      write(`assets/favicon/icon-${size}.png`, await sharp(svg, { density: 300 }).resize(size, size).png().toBuffer());
    }
  } catch {
    warn('favicon PNGs skipped (sharp not available)');
  }

  // ── Pages ────────────────────────────────────────────────────────────────
  const templates = await import(pathToFileURL(path.join(SRC, 'templates', 'pages', 'index.js')).href);
  const routes = [
    { route: 'home', page: templates.home },
    { route: 'menu', page: templates.menu },
    ...data.products.map((p) => ({ route: 'product', slug: p.id, page: (c) => templates.product(c, p) })),
    { route: 'recipes', page: templates.recipes },
    ...data.recipes.map((r) => ({ route: 'recipe', slug: r.id, page: (c) => templates.recipe(c, r) })),
    { route: 'order', page: templates.order },
    { route: 'custom', page: templates.custom },
    { route: 'about', page: templates.about },
    { route: 'contact', page: templates.contact },
    { route: 'collab', page: templates.collab },
    { route: 'privacy', page: templates.privacy },
  ];

  const contexts = {};
  let pageCount = 0;
  for (const { code } of site.languages) {
    const ctx = createContext({ lang: code, site, dicts, data, assets, images: manifest, prod, dev, warn, placeholders });
    contexts[code] = ctx;
    for (const r of routes) {
      ctx.current = { route: r.route, slug: r.slug || '' };
      const out = String(r.page(ctx));
      const rel = ctx.url(r.route, r.slug).slice(base.length);
      write(path.join(rel, 'index.html'), out);
      pageCount++;
    }
  }

  // 404 (bilingual, rendered with the default language chrome)
  const defaultCtx = contexts[site.defaultLang];
  defaultCtx.current = { route: '404', slug: '' };
  write('404.html', String(templates.notFound(defaultCtx, contexts)));

  // Root: language redirect
  write('index.html', String(templates.root(defaultCtx, contexts)));

  // Placeholder images for anything without a real photo
  for (const [name, label] of placeholders) write(`assets/img/ph-${name}.svg`, placeholderSvg(name, label));

  // ── SEO & hosting files ──────────────────────────────────────────────────
  const siteUrl = site.url.replace(/\/$/, '');
  const sitemapEntries = routes
    .map((r) => {
      const alternates = site.languages
        .map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${siteUrl}${contexts[l.code].url(r.route, r.slug)}"/>`)
        .join('');
      const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${contexts[site.defaultLang].url(r.route, r.slug)}"/>`;
      return site.languages
        .map((l) => `<url><loc>${siteUrl}${contexts[l.code].url(r.route, r.slug)}</loc>${alternates}${xDefault}</url>`)
        .join('\n');
    })
    .join('\n');
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`,
  );
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}${base}/sitemap.xml\n`);

  const formOrigin = site.ordering.formEndpoint ? new URL(site.ordering.formEndpoint).origin : '';
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${formOrigin ? ' ' + formOrigin : ''}`,
    'frame-src https://www.google.com https://maps.google.com',
    "base-uri 'self'",
    `form-action 'self'${formOrigin ? ' ' + formOrigin : ''}`,
    "frame-ancestors 'none'",
  ].join('; ');
  write(
    '_headers',
    `/*\n  Content-Security-Policy: ${csp}\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()\n` +
      // Long caching only where file names change with their content (production build).
      (prod
        ? ['/assets/img/*', '/assets/fonts/*', '/assets/main.*', '/assets/theme.*']
            .map((p) => `\n${p}\n  Cache-Control: public, max-age=31536000, immutable\n`)
            .join('')
        : ''),
  );
  // No _redirects file: the root index.html picks the language (saved choice or browser
  // language) itself, which works the same on Cloudflare, Netlify and plain hosting.

  const short = site.name;
  write(
    'site.webmanifest',
    JSON.stringify(
      {
        name: site.name,
        short_name: short,
        start_url: `${base}/${site.defaultLang}/`,
        display: 'standalone',
        background_color: '#FBF6EF',
        theme_color: '#3E2519',
        icons: [
          { src: `${base}/assets/favicon/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}/assets/favicon/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${base}/assets/favicon/favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      null,
      2,
    ),
  );

  const staticDir = path.join(SRC, 'static');
  if (fs.existsSync(staticDir)) fs.cpSync(staticDir, DIST, { recursive: true });

  // ── Checks ──────────────────────────────────────────────────────────────
  for (const p of missingContent(data, site.languages.map((l) => l.code))) warn(`content: ${p}`);
  const errors = [];
  if (prod) {
    for (const w of warnings) if (w.startsWith('i18n') || w.startsWith('content') || w.startsWith('routes')) errors.push(w);
    // Sample reviews must never reach a production build.
    const scan = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) return scan(p);
        if (d.name.endsWith('.html') && fs.readFileSync(p, 'utf8').includes('data-sample-review')) {
          errors.push(`sample review published in ${path.relative(DIST, p)}`);
        }
      });
    scan(DIST);
  }

  const placeholderCount =
    data.products.filter((p) => p.placeholder).length +
    data.recipes.filter((r) => r.placeholder).length +
    ['contact', 'press', 'hours', 'ordering'].filter((k) => site[k]?.placeholder).length +
    (site.urlPlaceholder ? 1 : 0);

  for (const w of warnings) if (!errors.includes(w)) console.warn(`⚠ ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    throw new Error(`Build failed with ${errors.length} error(s).`);
  }
  console.log(
    `✓ built ${pageCount + 2} pages in ${Date.now() - started} ms → dist/${prod ? ' (production)' : ''}` +
      (placeholderCount ? `\n  ℹ ${placeholderCount} data entries are still placeholders - see CONTENT-TODO.md` : ''),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  build({ prod: args.includes('--prod'), dev: args.includes('--dev') }).catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
