// Page configuration and UI strings, inlined by the build in <script id="app-data">.
let data;

export function app() {
  if (!data) {
    try {
      data = JSON.parse(document.getElementById('app-data')?.textContent || '{}');
    } catch {
      data = {};
    }
  }
  return data;
}

export function t(key, vars) {
  let s = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), app().t);
  if (s == null) return key;
  if (vars) s = String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return s;
}

export function catalog() {
  return app().catalog || [];
}

export function findProduct(id) {
  return catalog().find((p) => p.id === id);
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
