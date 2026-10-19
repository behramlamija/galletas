import { html } from '../../../build/lib/html.js';
import { icon, logoMark } from './icons.js';

const NAV = ['home', 'menu', 'recipes', 'about', 'contact'];

// Which nav item is "current" for a given route (product pages belong to the menu, etc.)
const SECTION = { product: 'menu', recipe: 'recipes', custom: 'menu', order: 'menu', collab: 'about', privacy: 'contact' };

export function brand(ctx) {
  return html`<a class="brand" href="${ctx.url('home')}" aria-label="${ctx.site.name} - ${ctx.t('nav.home')}">
    ${logoMark()}
    <span class="brand__name">Eksplozija <span>Slatkog</span></span>
  </a>`;
}

export function langSwitch(ctx, cls = '') {
  const { site, current } = ctx;
  const route = current.route === '404' ? 'home' : current.route;
  return html`<div class="lang-switch ${cls}" role="group" aria-label="${ctx.t('nav.language')}">
    ${site.languages.map(
      (l) => html`<a href="${ctx.url(route, current.slug, l.code)}" hreflang="${l.hreflang}" lang="${l.code}" data-lang-link="${l.code}"
        ${l.code === ctx.lang ? html`aria-current="true"` : ''} title="${l.name}">${l.label}</a>`,
    )}
  </div>`;
}

export function header(ctx) {
  const { t, current } = ctx;
  const active = SECTION[current.route] || current.route;
  return html`<header class="site-header" data-header>
  <div class="container site-header__inner">
    ${brand(ctx)}
    <nav class="main-nav" id="main-nav" aria-label="${t('nav.label')}" data-nav>
      <ul class="main-nav__list">
        ${NAV.map(
          (key) => html`<li><a href="${ctx.url(key)}" ${active === key ? html`aria-current="page"` : ''}>${t(`nav.${key}`)}</a></li>`,
        )}
      </ul>
      <div class="main-nav__extra">
        <a class="btn btn--cta btn--block" href="${ctx.url('menu')}">${icon('cake')}${t('cta.order')}</a>
        <a class="btn btn--ghost btn--block" href="${ctx.url('custom')}">${t('nav.custom')}</a>
        <a class="main-nav__ig" href="https://www.instagram.com/${ctx.site.contact.instagram}/" rel="noopener" target="_blank">${icon('instagram')} @${ctx.site.contact.instagram}</a>
      </div>
    </nav>
    <div class="site-header__actions">
      ${langSwitch(ctx)}
      <button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="${t('nav.theme')}" title="${t('nav.theme')}">
        ${icon('moon', 'theme-toggle__moon')}${icon('sun', 'theme-toggle__sun')}
      </button>
      <a class="icon-btn basket-btn" href="${ctx.url('order')}" data-basket-btn aria-label="${t('nav.basket')}">
        ${icon('basket')}
        <span class="basket-btn__count" data-basket-count hidden>0</span>
      </a>
      <button type="button" class="icon-btn nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="main-nav" aria-label="${t('nav.open')}" data-label-open="${t('nav.open')}" data-label-close="${t('nav.close')}">
        ${icon('menu', 'nav-toggle__open')}${icon('close', 'nav-toggle__close')}
      </button>
    </div>
  </div>
</header>`;
}

// Thumb-reachable order bar shown on mobile after scrolling past the hero.
export function orderBar(ctx) {
  const { t } = ctx;
  return html`<div class="order-bar" data-order-bar aria-hidden="true">
  <a class="btn btn--cta order-bar__main" href="${ctx.url('menu')}" tabindex="-1">${icon('cake')}${t('cta.order')}</a>
  <a class="order-bar__basket" href="${ctx.url('order')}" tabindex="-1" aria-label="${t('nav.basket')}">
    ${icon('basket')}<span class="basket-btn__count" data-basket-count hidden>0</span>
  </a>
</div>`;
}
