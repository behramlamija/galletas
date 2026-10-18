// Header behaviour: sticky shrink, mobile menu, bottom order bar, theme toggle,
// language preference and the one-time "cookie" note.
import { $, $$ } from '../utils/dom.js';
import { load, save, saveRaw } from '../utils/storage.js';

export function initHeader() {
  const header = $('[data-header]');
  const bar = $('[data-order-bar]');
  const hero = $('[data-hero]');
  if (!header) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (bar) {
      const threshold = hero ? hero.offsetTop + hero.offsetHeight * 0.75 : 360;
      const visible = y > threshold;
      if (visible !== bar.classList.contains('is-visible')) {
        bar.classList.toggle('is-visible', visible);
        bar.setAttribute('aria-hidden', String(!visible));
        $$('a', bar).forEach((a) => (a.tabIndex = visible ? 0 : -1));
      }
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

export function initMobileNav() {
  const header = $('[data-header]');
  const toggle = $('[data-nav-toggle]');
  const nav = $('[data-nav]');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    if (open) $('a', nav)?.focus();
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

export function initTheme() {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (system.matches ? 'dark' : 'light');
  $$('[data-theme-toggle]').forEach((btn) => {
    const sync = () => btn.setAttribute('aria-pressed', String(current() === 'dark'));
    sync();
    btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      saveRaw('es-theme', next);
      sync();
    });
  });
}

export function initLanguage() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-lang-link]');
    if (link) saveRaw('es-lang', link.dataset.langLink);
  });
}

export function initCookieNote() {
  const note = $('[data-cookie-note]');
  if (!note || load('es-cookie-note', false)) return;
  note.hidden = false;
  $('[data-cookie-dismiss]', note).addEventListener('click', () => {
    save('es-cookie-note', true);
    note.hidden = true;
  });
}
