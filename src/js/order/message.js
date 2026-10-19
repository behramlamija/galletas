// Builds the order / enquiry text. It is always written in Bosnian - the owner's
// working language - with an [EN] tag when the customer used the English site.
import { app, findProduct } from '../utils/app.js';
import { moneyBs, formatDateBs, parseISODate } from '../utils/format.js';

const LINE = '━━━━━━━━━━━━━━';

export function reference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `ES-${ymd}-${[...bytes].map((b) => alphabet[b % alphabet.length]).join('')}`;
}

function footer() {
  const host = (app().siteUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `${LINE}\nPoslano sa ${host}${app().lang !== 'bs' ? ' [EN]' : ''}`;
}

function contactBlock(f) {
  const msg = app().msg;
  const date = parseISODate(f.date);
  const lines = [`👤 ${f.name}`, `📞 ${f.phone}`];
  if (f.email) lines.push(`✉️ ${f.email}`);
  if (date) lines.push(`📅 ${formatDateBs(date)} u ${f.time}`);
  if (f.fulfilment === 'delivery') lines.push(`🚗 Dostava: ${f.address}`);
  else lines.push('🛍️ Lično preuzimanje');
  if (f.occasion) lines.push(`🎉 Prilika: ${msg.occasions[f.occasion] || f.occasion}`);
  return lines.join('\n');
}

export function lineItems(items) {
  let subtotal = 0;
  let hasQuote = false;
  const lines = items.map((i) => {
    const p = findProduct(i.id);
    if (!p) return `• ${i.qty}× ${i.id}`;
    const opt = p.options.find((o) => o.id === i.opt);
    const flavour = p.flavours.find((f) => f.id === i.flavour);
    const price = opt ? opt.price * i.qty : null;
    if (price == null) hasQuote = true;
    else subtotal += price;
    const parts = [`${i.qty}× ${p.nameBs}`, opt?.labelBs, flavour && `okus: ${flavour.labelBs}`, i.inscription && `natpis: "${i.inscription}"`];
    parts.push(price == null ? 'cijena na upit' : moneyBs(price));
    return `• ${parts.filter(Boolean).join(' - ')}`;
  });
  return { lines, subtotal, hasQuote };
}

export function orderMessage(ref, f, items) {
  const { lines, subtotal } = lineItems(items);
  const fee = f.fulfilment === 'delivery' ? app().ordering.deliveryFeeMostar : 0;
  return [
    `🍰 NOVA NARUDŽBA - ${ref}`,
    LINE,
    contactBlock(f),
    '',
    '🛒 Narudžba:',
    ...lines,
    '',
    `💰 Okvirno: ${moneyBs(subtotal)}${fee ? ` + dostava ${moneyBs(fee)}` : ''}`,
    `⚠️ Alergije: ${f.allergies || '-'}`,
    `📝 Napomena: ${f.notes || '-'}`,
    footer(),
  ].join('\n');
}

export function customMessage(ref, f) {
  const msg = app().msg;
  const design = f.design && findProduct(f.design);
  const list = (values, dict) => [].concat(values || []).map((v) => dict[v] || v).join(', ');
  const lines = [`🎂 UPIT ZA TORTU PO ŽELJI - ${ref}`, LINE, contactBlock(f), ''];
  if (design) lines.push(`✨ Inspiracija: ${design.nameBs} (${app().siteUrl.replace(/\/$/, '')}${design.url})`);
  lines.push(`👥 Broj osoba: ${f.guests}`);
  lines.push(`🏰 Spratova: ${f.tiers}`);
  lines.push(`🍰 Biskvit: ${msg.sponges[f.sponge] || f.sponge}`);
  if (f.fillings?.length) lines.push(`🍓 Fil: ${list(f.fillings, msg.fillings)}`);
  if (f.style) lines.push(`🎀 Stil: ${msg.styles[f.style] || f.style}`);
  if (f.colours?.length) lines.push(`🎨 Boje: ${list(f.colours, msg.colours)}`);
  if (f.inscription) lines.push(`✍️ Natpis: "${f.inscription}"`);
  if (f.budget) lines.push(`💰 Budžet: ${msg.budgets[f.budget] || f.budget}`);
  lines.push(`💡 Ideja: ${f.idea || '-'}`);
  lines.push('📷 Slike inspiracije šaljem u nastavku.');
  lines.push(footer());
  return lines.join('\n');
}
