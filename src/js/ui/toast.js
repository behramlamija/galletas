import { $, h, icon } from '../utils/dom.js';

// Shows a short status message. `action` is { label, href } or { label, onClick }.
export function toast(message, { action, duration = 3800, cookie = false } = {}) {
  const region = $('[data-toasts]');
  if (!region) return;
  const close = () => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 300);
  };
  let actionEl = null;
  if (action) {
    actionEl = action.href
      ? h('a', { class: 'toast__action', href: action.href }, action.label)
      : h('button', { type: 'button', class: 'toast__action', onclick: () => (action.onClick(), close()) }, action.label);
  }
  const el = h('div', { class: 'toast' }, cookie ? icon('cookie') : null, h('span', { class: 'toast__text' }, message), actionEl);
  // Keep at most three toasts on screen.
  while (region.children.length >= 3) region.firstElementChild.remove();
  region.append(el);
  setTimeout(close, duration);
  return close;
}
