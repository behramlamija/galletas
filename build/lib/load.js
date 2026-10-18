import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SRC = path.join(ROOT, 'src');
export const DIST = path.join(ROOT, 'dist');
export const CACHE = path.join(ROOT, '.cache');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf8'));
}

export function loadData() {
  const site = readJson('data/site.json');
  const dicts = Object.fromEntries(site.languages.map((l) => [l.code, readJson(`i18n/${l.code}.json`)]));
  return {
    site,
    dicts,
    categories: readJson('data/categories.json'),
    products: readJson('data/products.json'),
    recipes: readJson('data/recipes.json'),
    reviews: readJson('data/reviews.json'),
    faq: readJson('data/faq.json'),
  };
}

// Collects every key path of a nested object, e.g. "nav.home".
export function keyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keyPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

// Walks the content data and reports localized fields ({ bs, en }) missing a language.
export function missingContent(data, langs) {
  const problems = [];
  const visit = (node, where) => {
    if (Array.isArray(node)) return node.forEach((n, i) => visit(n, `${where}[${i}]`));
    if (!node || typeof node !== 'object') return;
    const keys = Object.keys(node);
    if (keys.length && keys.some((k) => langs.includes(k)) && keys.every((k) => langs.includes(k))) {
      for (const l of langs) if (!node[l]) problems.push(`${where}: missing "${l}"`);
      return;
    }
    for (const [k, v] of Object.entries(node)) visit(v, `${where}.${k}`);
  };
  for (const name of ['categories', 'products', 'recipes', 'reviews', 'faq']) visit(data[name], name);
  return problems;
}
