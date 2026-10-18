// A little cookie arcs from the clicked button to the basket icon.
import { $$, h, icon } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/app.js';

function visibleTarget() {
  return $$('[data-basket-btn], .order-bar.is-visible .order-bar__basket').find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.top >= 0 && r.top < window.innerHeight;
  });
}

export function flyToBasket(source) {
  const target = visibleTarget();
  if (!source || !target || prefersReducedMotion() || !Element.prototype.animate) return Promise.resolve();
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const x0 = from.left + from.width / 2;
  const y0 = from.top + from.height / 2;
  const dx = to.left + to.width / 2 - x0;
  const dy = to.top + to.height / 2 - y0;
  const lift = Math.min(160, Math.abs(dx) * 0.3 + 60);

  const el = h('div', { class: 'fly-cookie', 'aria-hidden': 'true' }, icon('cookie'));
  el.style.left = `${x0}px`;
  el.style.top = `${y0}px`;
  document.body.append(el);
  const anim = el.animate(
    [
      { transform: 'translate(0, 0) scale(0.6) rotate(0)', opacity: 0.9 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - lift}px) scale(1.25) rotate(200deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.35) rotate(400deg)`, opacity: 0.4 },
    ],
    { duration: 720, easing: 'cubic-bezier(.45,.05,.45,1)' },
  );
  return anim.finished.then(() => el.remove()).catch(() => el.remove());
}
