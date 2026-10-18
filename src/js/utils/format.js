import { app } from './app.js';

let numberFormat;
export function money(n) {
  const { locale, currency } = app();
  numberFormat ||= new Intl.NumberFormat(locale || 'bs-BA', { maximumFractionDigits: 2 });
  return `${numberFormat.format(n)} ${currency || 'KM'}`;
}

// Bosnian money format for the order message, regardless of site language.
export const moneyBs = (n) => `${new Intl.NumberFormat('bs-BA', { maximumFractionDigits: 2 }).format(n)} KM`;

export function formatDate(date, opts = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) {
  try {
    return new Intl.DateTimeFormat(app().locale || 'bs-BA', opts).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

const BS_DAYS = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'];
export function formatDateBs(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${BS_DAYS[date.getDay()]}, ${dd}.${mm}.${date.getFullYear()}.`;
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
