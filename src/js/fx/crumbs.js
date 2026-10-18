// A very light crumb trail that follows the pointer inside the hero (desktop only).
import { $, h } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/app.js';

const COLORS = ['#E2C79F', '#B57A45', '#F3E6CF'];

export function initCrumbs() {
  const hero = $('[data-hero]');
  if (!hero || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!Element.prototype.animate) return;
  let last = 0;
  let alive = 0;
  hero.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 45 || alive > 18) return;
    last = now;
    alive++;
    const crumb = h('span', { class: 'crumb', 'aria-hidden': 'true' });
    const size = 3 + Math.random() * 4;
    crumb.style.left = `${e.clientX}px`;
    crumb.style.top = `${e.clientY}px`;
    crumb.style.width = `${size}px`;
    crumb.style.height = `${size}px`;
    crumb.style.background = COLORS[(Math.random() * COLORS.length) | 0];
    document.body.append(crumb);
    const drift = (Math.random() - 0.5) * 30;
    crumb
      .animate(
        [
          { transform: 'translate(0,0) rotate(0)', opacity: 0.9 },
          { transform: `translate(${drift}px, ${40 + Math.random() * 30}px) rotate(160deg)`, opacity: 0 },
        ],
        { duration: 900, easing: 'cubic-bezier(.3,.6,.4,1)' },
      )
      .finished.finally(() => {
        crumb.remove();
        alive--;
      });
  });
}
