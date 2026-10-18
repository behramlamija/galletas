import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { productCard, breadcrumbs } from '../partials/cards.js';
import { breadcrumbLd } from '../partials/seo.js';
import { filterChips } from './home.js';

export function pageHero(ctx, { eyebrow, title, lead, crumbs, cls = '' }) {
  return html`<section class="page-hero ${cls}">
  <div class="page-hero__bg" aria-hidden="true"><span class="blob blob--pink"></span><span class="blob blob--butter"></span><span class="sprinkles"></span></div>
  <div class="container">
    ${crumbs ? breadcrumbs(ctx, crumbs) : ''}
    ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1 class="page-title">${title}</h1>
    ${lead ? html`<p class="page-lead">${lead}</p>` : ''}
  </div>
</section>`;
}

export function customPromo(ctx) {
  const { t } = ctx;
  return html`<aside class="promo reveal">
  <span class="promo__icon" aria-hidden="true">${icon('sparkle')}</span>
  <div>
    <h2 class="promo__title">${t('menu.customTitle')}</h2>
    <p>${t('menu.customText')}</p>
  </div>
  <a class="btn btn--primary" href="${ctx.url('custom')}">${t('menu.customCta')} ${icon('arrow')}</a>
</aside>`;
}

export function menu(ctx) {
  const { t, data } = ctx;
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('nav.menu'), url: ctx.url('menu') },
  ];
  const items = [...data.products].sort((a, b) => a.rank - b.rank);
  const body = html`${pageHero(ctx, { eyebrow: t('menu.eyebrow'), title: t('menu.title'), lead: t('menu.lead'), crumbs })}
<section class="section section--tight menu">
  <div class="container">
    <div class="toolbar" data-filter-toolbar="menu">
      <label class="search">
        <span class="visually-hidden">${t('menu.search')}</span>
        ${icon('search')}
        <input type="search" placeholder="${t('menu.searchPlaceholder')}" data-filter-search="menu" autocomplete="off">
      </label>
      <label class="select">
        <span class="visually-hidden">${t('menu.sort')}</span>
        <select data-filter-sort="menu">
          <option value="popular">${t('menu.sortPopular')}</option>
          <option value="price-asc">${t('menu.sortPriceAsc')}</option>
          <option value="price-desc">${t('menu.sortPriceDesc')}</option>
        </select>
      </label>
    </div>
    ${filterChips(ctx, { scope: 'menu' })}
    <p class="results-count" data-filter-count="menu" aria-live="polite"></p>
    <div class="grid grid--products" data-filter-list="menu" data-filter-hash>
      ${items.map((p) => productCard(ctx, p, { short: true }))}
    </div>
    <div class="empty-state empty-state--big" data-filter-empty="menu" hidden>
      <span class="crumb-cookie" aria-hidden="true">${icon('cookie')}<i></i><i></i><i></i></span>
      <p>${t('menu.empty')}</p>
      <button type="button" class="btn btn--ghost" data-filter-reset="menu">${t('menu.reset')}</button>
    </div>
    ${customPromo(ctx)}
  </div>
</section>`;
  return layout(ctx, {
    title: t('seo.menuTitle'),
    description: t('seo.menuDescription'),
    body,
    pageClass: 'page-menu',
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}
