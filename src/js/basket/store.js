// Basket state kept in localStorage. Items: { key, id, opt, flavour, inscription, qty }.
// Every change dispatches a "basket:change" event on window.
import { load, save } from '../utils/storage.js';

const KEY = 'es-basket';
const MAX_QTY = 20;

const keyOf = (i) => [i.id, i.opt || '', i.flavour || '', (i.inscription || '').trim()].join('|');

let items = sanitise(load(KEY, []));

function sanitise(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((i) => i && typeof i.id === 'string')
    .map((i) => ({
      id: i.id,
      opt: i.opt || '',
      flavour: i.flavour || '',
      inscription: String(i.inscription || '').slice(0, 40),
      qty: Math.min(MAX_QTY, Math.max(1, Number(i.qty) || 1)),
    }))
    .map((i) => ({ ...i, key: keyOf(i) }));
}

function commit() {
  save(KEY, items.map(({ key, ...rest }) => rest));
  window.dispatchEvent(new CustomEvent('basket:change', { detail: { items: getItems() } }));
}

export const getItems = () => items.map((i) => ({ ...i }));
export const count = () => items.reduce((n, i) => n + i.qty, 0);

export function add(item) {
  const next = sanitise([item])[0];
  const existing = items.find((i) => i.key === next.key);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + next.qty);
  else items.push(next);
  commit();
}

export function setQty(key, qty) {
  const item = items.find((i) => i.key === key);
  if (!item) return;
  item.qty = Math.min(MAX_QTY, Math.max(1, qty));
  commit();
}

// Returns what's needed to undo the removal.
export function removeItem(key) {
  const index = items.findIndex((i) => i.key === key);
  if (index < 0) return null;
  const [removed] = items.splice(index, 1);
  commit();
  return { item: removed, index };
}

export function restore({ item, index }) {
  items.splice(Math.min(index, items.length), 0, item);
  commit();
}

export function clear() {
  items = [];
  commit();
}

// Keep several open tabs in sync.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    items = sanitise(load(KEY, []));
    window.dispatchEvent(new CustomEvent('basket:change', { detail: { items: getItems() } }));
  }
});
