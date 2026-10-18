// Client-side filtering for product / recipe grids: category chips, text search,
// sorting and an extra attribute select. State can be mirrored in the URL hash.
import { $, $$ } from '../utils/dom.js';
import { app, t } from '../utils/app.js';

const HASH_KEYS = ['kategorija', 'category'];

function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const cat = HASH_KEYS.map((k) => params.get(k)).find(Boolean);
  return { cat: cat || 'all', q: params.get('q') || '' };
}

function writeHash(cat, q) {
  const key = app().lang === 'bs' ? 'kategorija' : 'category';
  const params = new URLSearchParams();
  if (cat && cat !== 'all') params.set(key, cat);
  if (q) params.set('q', q);
  const hash = params.toString();
  history.replaceState(null, '', hash ? `#${hash}` : location.pathname + location.search);
}

function normalise(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'dj');
}

export function initFilters() {
  $$('[data-filter-list]').forEach((list) => {
    const scope = list.dataset.filterList;
    const chips = $$(`[data-filter-chips="${scope}"] [data-filter]`);
    const search = $(`[data-filter-search="${scope}"]`);
    const sort = $(`[data-filter-sort="${scope}"]`);
    const extra = $(`[data-filter-extra="${scope}"]`);
    const empty = $(`[data-filter-empty="${scope}"]`);
    const count = $(`[data-filter-count="${scope}"]`);
    const reset = $(`[data-filter-reset="${scope}"]`);
    const useHash = list.hasAttribute('data-filter-hash');
    const items = [...list.children];

    let state = useHash ? readHash() : { cat: 'all', q: '' };
    if (!chips.some((c) => c.dataset.filter === state.cat)) state.cat = 'all';
    if (search && state.q) search.value = state.q;

    const apply = () => {
      const q = normalise(search?.value.trim() || '');
      const extraValue = extra?.value || '';
      let shown = 0;
      for (const item of items) {
        const okCat = state.cat === 'all' || item.dataset.category === state.cat;
        const okQ = !q || normalise(item.dataset.search || '').includes(q);
        const okExtra = !extraValue || item.dataset[extra.dataset.filterAttr] === extraValue;
        const visible = okCat && okQ && okExtra;
        item.classList.toggle('is-filtered-out', !visible);
        if (visible) shown++;
      }
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === state.cat)));
      if (empty) empty.hidden = shown > 0;
      if (count) count.textContent = t('results', { n: shown });
      if (useHash) writeHash(state.cat, search?.value.trim() || '');
    };

    const applySort = () => {
      if (!sort) return;
      const mode = sort.value;
      const sorted = [...items].sort((a, b) => {
        if (mode === 'price-asc') return a.dataset.price - b.dataset.price;
        if (mode === 'price-desc') return b.dataset.price - a.dataset.price;
        return a.dataset.rank - b.dataset.rank;
      });
      list.append(...sorted);
    };

    chips.forEach((chip) =>
      chip.addEventListener('click', () => {
        state.cat = chip.dataset.filter;
        apply();
      }),
    );
    let timer;
    search?.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(apply, 120);
    });
    sort?.addEventListener('change', applySort);
    extra?.addEventListener('change', apply);
    reset?.addEventListener('click', () => {
      state = { cat: 'all', q: '' };
      if (search) search.value = '';
      if (extra) extra.value = '';
      apply();
    });
    if (useHash) {
      window.addEventListener('hashchange', () => {
        state = readHash();
        apply();
      });
    }
    apply();
  });
}
