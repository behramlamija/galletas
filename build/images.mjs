// Responsive image pipeline: every JPG/PNG/WebP in src/assets/images becomes
// AVIF + WebP + JPEG variants at several widths. Results are cached in .cache/img
// so unchanged photos are not re-encoded on every build.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SRC, CACHE } from './lib/load.js';

const WIDTHS = [400, 800, 1200, 1600];
const FORMATS = ['avif', 'webp', 'jpg'];
const IMG_DIR = path.join(SRC, 'assets', 'images');
const OUT_DIR = path.join(CACHE, 'img');
const MANIFEST = path.join(CACHE, 'img-manifest.json');

async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    return null;
  }
}

export async function processImages({ log = console.log } = {}) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  const files = fs.existsSync(IMG_DIR) ? fs.readdirSync(IMG_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
  const sharp = files.length ? await loadSharp() : null;
  if (files.length && !sharp) log('⚠ sharp is not installed - images will use placeholders.');

  const manifest = {};
  let encoded = 0;
  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, '');
    const src = path.join(IMG_DIR, file);
    const stat = fs.statSync(src);
    const stamp = `${stat.size}-${Math.round(stat.mtimeMs)}`;
    const cached = previous[name];
    if (cached && cached.stamp === stamp && cached.files.every((f) => fs.existsSync(path.join(OUT_DIR, f)))) {
      manifest[name] = cached;
      continue;
    }
    if (!sharp) continue;

    const meta = await sharp(src).rotate().metadata();
    const srcWidth = meta.autoOrient?.width ?? meta.width;
    const srcHeight = meta.autoOrient?.height ?? meta.height;
    const widths = WIDTHS.filter((w) => w < srcWidth);
    widths.push(Math.min(srcWidth, 1600));

    const entry = { stamp, width: srcWidth, height: srcHeight, sources: {}, files: [] };
    for (const format of FORMATS) {
      entry.sources[format] = [];
      for (const w of widths) {
        const out = `${name}-${w}.${format}`;
        let pipeline = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
        if (format === 'avif') pipeline = pipeline.avif({ quality: 55, effort: 4 });
        if (format === 'webp') pipeline = pipeline.webp({ quality: 74 });
        if (format === 'jpg') pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        await pipeline.toFile(path.join(OUT_DIR, out));
        entry.sources[format].push([w, out]);
        entry.files.push(out);
      }
    }
    manifest[name] = entry;
    encoded++;
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  log(`✓ images: ${Object.keys(manifest).length} sources (${encoded} encoded)`);
  return { manifest, dir: OUT_DIR };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await processImages();
}
