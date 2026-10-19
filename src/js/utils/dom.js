export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Minimal element builder. Children that are strings become text nodes (never HTML).
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

// Clones an inline SVG icon that the server already rendered somewhere on the page.
const ICONS = {
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  cookie:
    '<path d="M20.9 12.4A9 9 0 1 1 11.6 3a3 3 0 0 0 3.6 3.6 3 3 0 0 0 3.6 3.6 3 3 0 0 0 2.1 2.2Z"/><circle cx="8.5" cy="9.5" r=".9" fill="currentColor"/><circle cx="14.5" cy="14.5" r=".9" fill="currentColor"/><circle cx="9.5" cy="15.5" r=".9" fill="currentColor"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};
export function icon(name) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  // Static, trusted markup defined above - not user input.
  svg.innerHTML = ICONS[name];
  return svg;
}
