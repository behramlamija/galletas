// Hero intro: the portrait "explodes" with sweets and the little product cards
// fly out of it (CSS, see .hero.is-booming). Tapping the portrait does it again.
import { $ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/app.js';
import { burstFrom } from './burst.js';

export function initHeroBoom() {
  const hero = $('[data-hero]');
  const portrait = $('.hero__portrait', hero || document);
  if (!hero || !portrait || prefersReducedMotion()) return;

  hero.classList.add('will-boom'); // cards stay hidden until they are "thrown out"
  const boom = (big = true) => {
    hero.classList.remove('is-booming');
    void hero.offsetWidth; // restart the CSS animations
    hero.classList.add('is-booming');
    burstFrom(portrait, big ? { count: 90, power: 15 } : { count: 45, power: 11 });
  };

  // Wait for the portrait so the explosion comes "out of" a visible photo.
  const img = $('img', portrait);
  const start = () => setTimeout(() => boom(true), 300);
  if (!img || img.complete) start();
  else img.addEventListener('load', start, { once: true });

  portrait.addEventListener('click', () => boom(false));
}
