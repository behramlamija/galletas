// Builds the per-language rendering context handed to every template.
import { html } from './html.js';

const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function createContext({ lang, site, dicts, data, assets, images, prod, dev, warn, placeholders }) {
  const dict = dicts[lang];
  const meta = site.languages.find((l) => l.code === lang);
  const base = (site.basePath || '').replace(/\/$/, '');
  const number = new Intl.NumberFormat(meta.locale, { maximumFractionDigits: 2 });

  const t = (key, vars) => {
    let s = get(dict, key);
    if (s == null) {
      warn(`i18n ${lang}: missing key "${key}"`);
      s = get(dicts[site.defaultLang], key) ?? key;
    }
    if (vars) s = String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
    return s;
  };

  const L = (field) => {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (field[lang] == null) warn(`content ${lang}: missing translation for ${JSON.stringify(field).slice(0, 60)}`);
    return field[lang] ?? field[site.defaultLang] ?? '';
  };

  const url = (route = 'home', slug = '', lg = lang) => {
    const seg = dicts[lg].routes[route];
    if (seg == null) warn(`routes ${lg}: missing route "${route}"`);
    let p = `${base}/${lg}/`;
    if (seg) p += `${seg}/`;
    if (slug) p += `${slug}/`;
    return p;
  };

  const asset = (p) => `${base}/assets/${p}`;
  const absolute = (p) => site.url.replace(/\/$/, '') + p;
  const money = (n) => `${number.format(n)} ${meta.currency}`;

  const imageEntry = (name) => images[name];

  const picture = (name, { alt = '', sizes = '100vw', eager = false, cls = '', label } = {}) => {
    const e = images[name];
    const loading = eager ? 'eager' : 'lazy';
    if (!e) {
      placeholders.set(name, label || alt || name);
      return html`<picture class="${cls}"><img src="${asset(`img/ph-${name}.svg`)}" alt="${alt}" width="800" height="800" loading="${loading}" decoding="async"></picture>`;
    }
    const srcset = (fmt) => e.sources[fmt].map(([w, f]) => `${asset(`img/${f}`)} ${w}w`).join(', ');
    const fallback = e.sources.jpg.at(-1)[1];
    return html`<picture class="${cls}"><source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}"><img src="${asset(`img/${fallback}`)}" srcset="${srcset('jpg')}" sizes="${sizes}" alt="${alt}" width="${e.width}" height="${e.height}" loading="${loading}" decoding="async"${eager ? html` fetchpriority="high"` : ''}></picture>`;
  };

  // Largest JPEG (for Open Graph / JSON-LD) and smallest WebP (for client thumbnails).
  const imageUrl = (name) => {
    const e = images[name];
    return e ? asset(`img/${e.sources.jpg.at(-1)[1]}`) : asset(`img/ph-${name}.svg`);
  };
  const thumbUrl = (name) => {
    const e = images[name];
    if (!e) placeholders.set(name, placeholders.get(name) || name);
    return e ? asset(`img/${e.sources.webp[0][1]}`) : asset(`img/ph-${name}.svg`);
  };

  const category = (id) => data.categories.find((c) => c.id === id);
  const leadTime = (p) => p.leadTimeDays ?? site.ordering.leadTimeDays[p.category] ?? 3;
  const priceFrom = (p) => (p.pricing.unit === 'quote' ? p.pricing.from : Math.min(...p.pricing.options.map((o) => o.price)));

  return {
    lang,
    meta,
    site,
    data,
    dicts,
    assets,
    prod,
    dev,
    base,
    t,
    L,
    url,
    asset,
    absolute,
    money,
    picture,
    imageUrl,
    thumbUrl,
    imageEntry,
    category,
    leadTime,
    priceFrom,
    current: { route: 'home', slug: '' },
  };
}
