// Compares every language file against the default language and checks that
// all localized content fields ({ bs, en }) are filled in for each language.
import { loadData, keyPaths, missingContent } from './lib/load.js';

const data = loadData();
const { site, dicts } = data;
const langs = site.languages.map((l) => l.code);
const reference = new Set(keyPaths(dicts[site.defaultLang]));
let problems = 0;

for (const lang of langs) {
  const keys = new Set(keyPaths(dicts[lang]));
  const missing = [...reference].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !reference.has(k));
  for (const k of missing) console.log(`✗ ${lang}.json is missing "${k}"`);
  for (const k of extra) console.log(`⚠ ${lang}.json has extra key "${k}" (not in ${site.defaultLang}.json)`);
  problems += missing.length;
}

for (const p of missingContent(data, langs)) {
  console.log(`✗ ${p}`);
  problems++;
}

if (problems) {
  console.log(`\n${problems} translation problem(s) found.`);
  process.exit(1);
}
console.log(`✓ translations complete for: ${langs.join(', ')}`);
