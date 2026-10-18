// Entry point: shared UI on every page, plus page-specific modules.
import { initHeader, initMobileNav, initTheme, initLanguage, initCookieNote } from './ui/nav.js';
import { initReveal } from './ui/reveal.js';
import { initFilters } from './ui/filter.js';
import { initCarousels, initMap, initPrint } from './ui/misc.js';
import { initBasketUI } from './basket/ui.js';
import { initCrumbs } from './fx/crumbs.js';
import { initHeroBoom } from './fx/hero-boom.js';
import { initProduct } from './product/product.js';
import { initOrder } from './order/order.js';
import { initCustom } from './order/custom.js';
import { initRecipe } from './recipe/recipe.js';

const PAGES = {
  home: [initHeroBoom, initCrumbs],
  product: [initProduct],
  order: [initOrder],
  custom: [initCustom],
  recipe: [initRecipe],
  contact: [initMap],
};

function run(fn) {
  try {
    fn();
  } catch (err) {
    console.error(err);
  }
}

[initHeader, initMobileNav, initTheme, initLanguage, initCookieNote, initReveal, initFilters, initCarousels, initPrint, initBasketUI].forEach(run);
(PAGES[document.body.dataset.page] || []).forEach(run);
