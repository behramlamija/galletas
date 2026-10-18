// Basket badge counters and the quick "+ Add" buttons on product cards.
import { $$ } from '../utils/dom.js';
import { app, t } from '../utils/app.js';
import { add, count } from './store.js';
import { toast } from '../ui/toast.js';
import { flyToBasket } from '../fx/fly.js';
import { burstFrom } from '../fx/burst.js';

export function updateBadges(bounce = false) {
  const n = count();
  $$('[data-basket-count]').forEach((el) => {
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
    if (bounce) {
      el.classList.remove('is-bouncing');
      void el.offsetWidth; // restart the animation
      el.classList.add('is-bouncing');
    }
  });
}

export function addedFeedback(name, source) {
  burstFrom(source, { count: 22, power: 7, gravity: 0.28 });
  flyToBasket(source).then(() => updateBadges(true));
  toast(t('added', { name }), { action: { label: t('view'), href: app().urls.order }, cookie: true });
}

export function initBasketUI() {
  updateBadges();
  window.addEventListener('basket:change', () => updateBadges());

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    e.preventDefault();
    add({ id: btn.dataset.id, opt: btn.dataset.opt, flavour: btn.dataset.flavour || '', qty: 1 });
    btn.classList.add('is-added');
    setTimeout(() => btn.classList.remove('is-added'), 1200);
    addedFeedback(btn.dataset.name, btn);
  });
}
