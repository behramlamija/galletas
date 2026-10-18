import { $, $$, h } from '../utils/dom.js';

// Review carousel arrows.
export function initCarousels() {
  $$('[data-carousel]').forEach((track) => {
    const root = track.closest('section') || document;
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    $('[data-carousel-prev]', root)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('[data-carousel-next]', root)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

// The Google map is only loaded after an explicit click (no third-party requests on page load).
export function initMap() {
  const btn = $('[data-map-load]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const map = btn.closest('[data-map]');
    const frame = h('iframe', {
      src: btn.dataset.src,
      title: 'Google Maps',
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
      allowfullscreen: true,
    });
    map.replaceChildren(frame);
  });
}

export function initPrint() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-print]')) window.print();
  });
}
