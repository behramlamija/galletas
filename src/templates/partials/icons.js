// Inline SVG icon set — 24×24, 1.75px rounded strokes, inherits currentColor.
import { raw } from '../../../build/lib/html.js';

const PATHS = {
  cookie:
    '<path d="M20.9 12.4A9 9 0 1 1 11.6 3a3 3 0 0 0 3.6 3.6 3 3 0 0 0 3.6 3.6 3 3 0 0 0 2.1 2.2Z"/><circle cx="8.5" cy="9.5" r=".9" fill="currentColor"/><circle cx="14.5" cy="14.5" r=".9" fill="currentColor"/><circle cx="9.5" cy="15.5" r=".9" fill="currentColor"/><circle cx="12" cy="11.5" r=".6" fill="currentColor"/>',
  whisk: '<path d="m4 20 7-7"/><path d="M11 13c-1.5-3 0-7.5 3.5-9.5 3-.5 6 2.5 5.5 5.5-2 3.5-6.5 5-9 4Z"/><path d="M13 11c.5-2.5 2.5-5 5-6"/><path d="M13 11c2.5-.5 5-2.5 6-5"/>',
  rolling: '<path d="m3 21 3-3"/><path d="m18 6 3-3"/><rect x="5.5" y="8.5" width="13" height="7" rx="3.5" transform="rotate(-45 12 12)"/>',
  cake: '<path d="M4 21V13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M4 16c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0"/><path d="M2 21h20"/><path d="M12 11V7"/><path d="M12 7c-.8 0-1.5-.7-1.5-1.5S12 3 12 3s1.5 1.7 1.5 2.5S12.8 7 12 7Z"/>',
  slice: '<path d="M3 17 20 9v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 17 15 5.5a3 3 0 0 1 5 2.3V9"/><path d="M3 13.5 17 7"/>',
  cup: '<path d="M5 8h14l-1.5 12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1Z"/><path d="M5.5 12.5h13"/><path d="M8 8a4 4 0 0 1 8 0"/><circle cx="12" cy="4" r="1"/>',
  roll: '<circle cx="12" cy="12" r="9"/><path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3 3 0 0 1 10.5 10.5 4.5 4.5 0 0 1 15 6a6 6 0 0 1 6 6"/>',
  party: '<path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.2.8a3 3 0 0 0-2 2.8v.3a1 1 0 0 1-1 1h-.3a3 3 0 0 0-2.8 2l-.7 2"/><path d="M11 13c1.9 1.9 2.8 4.2 2 5s-3.1-.1-5-2-2.8-4.2-2-5 3.1.1 5 2Z"/>',
  bag: '<path d="M6 7h12l1 14H5Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
  basket: '<path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.6-7.4"/><path d="M9 15v1"/><path d="M15 15v1"/><path d="M12 15v1"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
  whatsapp: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 7.9 19.6Z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4.5 4.5 0 0 1-2.3-2.3l.8-1-1-2Z"/>',
  viber: '<path d="M12 2.5c5.5 0 8.5 2.5 8.5 8s-3 8-8.5 8c-.8 0-1.6 0-2.3-.2L6.5 21v-3.3C4 16.3 3.5 13.8 3.5 10.5c0-5.5 3-8 8.5-8Z"/><path d="M9 7.5c0 4 3.5 7.5 7.5 7.5l.5-1.8-2-.9-.9.8a4.2 4.2 0 0 1-2.2-2.2l.8-.9-.9-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  truck: '<path d="M2 6h11v10H2Z"/><path d="M13 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  sparkle: '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5Z"/>',
  chef: '<path d="M6 13.9A4 4 0 0 1 7.5 6a5 5 0 0 1 9 0A4 4 0 0 1 18 13.9V21H6Z"/><path d="M6 17h12"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  flame: '<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-9-1 2-2 3-3.5 3.5C11 7 10.5 5 11 2 7 4 5 8.5 5 13c0 5 3 9 7 9Z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 5-10 16-10 0 11-4 17-9 17Z"/><path d="M4 21c3-6 7-9 12-11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  quote: '<path d="M10 7H6a2 2 0 0 0-2 2v4h4v4H6"/><path d="M20 7h-4a2 2 0 0 0-2 2v4h4v4h-2"/>',
};

export function icon(name, cls = '') {
  const body = PATHS[name];
  if (!body) throw new Error(`Unknown icon "${name}"`);
  return raw(
    `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`,
  );
}

// Brand mark: a cookie with a bite taken out of it.
export function logoMark(cls = '') {
  return raw(
    `<svg class="logo-mark${cls ? ' ' + cls : ''}" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false"><path d="M35.6 21.4a15.6 15.6 0 1 1-17-17 4.6 4.6 0 0 0 5.8 5.6 4.6 4.6 0 0 0 5.6 5.8 4.6 4.6 0 0 0 5.6 5.6Z" fill="var(--logo-fill, #E2C79F)" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="13" cy="15" r="2" fill="currentColor"/><circle cx="22.5" cy="23" r="2.2" fill="currentColor"/><circle cx="13.5" cy="26" r="1.8" fill="currentColor"/><circle cx="19" cy="18.5" r="1.2" fill="currentColor"/><circle cx="27" cy="29" r="1.3" fill="currentColor"/></svg>`,
  );
}
