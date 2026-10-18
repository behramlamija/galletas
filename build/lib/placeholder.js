// Generates a soft, on-brand SVG placeholder for products without a real photo yet.
import { esc } from './html.js';

const PALETTES = [
  ['#F6DCDD', '#F3E6CF'],
  ['#E7EED8', '#F3E6CF'],
  ['#F3E6CF', '#E2C79F'],
  ['#F6DCDD', '#E7EED8'],
];

export function placeholderSvg(name, label) {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = PALETTES[sum % PALETTES.length];
  const text = esc(String(label).slice(0, 40));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="800" height="800" fill="url(#g)"/>
<g fill="none" stroke="#B57A45" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(300 250)">
<circle cx="100" cy="100" r="95"/><circle cx="70" cy="70" r="9" fill="#B57A45"/><circle cx="130" cy="85" r="9" fill="#B57A45"/><circle cx="95" cy="135" r="9" fill="#B57A45"/><circle cx="145" cy="140" r="7" fill="#B57A45"/>
</g>
<text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#3E2519" opacity=".75">${text}</text>
</svg>`;
}
