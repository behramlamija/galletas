import { html } from '../../../build/lib/html.js';
import { icon } from './icons.js';

export function priceLabel(ctx, p) {
  const from = ctx.priceFrom(p);
  if (p.pricing.unit === 'quote') return ctx.t('product.fromQuote', { price: ctx.money(from) });
  return p.pricing.options.length > 1 ? ctx.t('product.from', { price: ctx.money(from) }) : ctx.money(from);
}

export function badges(ctx, p) {
  if (!p.badges?.length) return '';
  return html`<span class="badges">${p.badges.map((b) => html`<span class="badge badge--${b}">${ctx.t(`badges.${b}`)}</span>`)}</span>`;
}

// Quick "add" button: adds the first size/flavour; celebration cakes go to the custom-cake form.
export function addButton(ctx, p, { label = true } = {}) {
  const { t, L } = ctx;
  if (p.pricing.unit === 'quote') {
    return html`<a class="btn-add btn-add--quote" href="${ctx.url('custom')}?design=${p.id}" aria-label="${t('product.inquireAbout', { name: L(p.name) })}">
      ${icon('sparkle')}${label ? html`<span>${t('product.inquire')}</span>` : ''}
    </a>`;
  }
  return html`<button type="button" class="btn-add" data-add data-id="${p.id}" data-opt="${p.pricing.options[0].id}"
    ${p.flavours ? html`data-flavour="${p.flavours[0].id}"` : ''} data-name="${L(p.name)}" aria-label="${t('product.addNamed', { name: L(p.name) })}">
    ${icon('plus')}${label ? html`<span>${t('product.addShort')}</span>` : ''}
  </button>`;
}

export function productCard(ctx, p, { short = false, sizes = '(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw', tall = false } = {}) {
  const { L } = ctx;
  const cat = ctx.category(p.category);
  return html`<article class="product-card${tall ? ' product-card--tall' : ''}" data-product-card data-category="${p.category}"
    data-name="${L(p.name).toLowerCase()}" data-search="${(L(p.name) + ' ' + L(p.short)).toLowerCase()}" data-price="${ctx.priceFrom(p)}" data-rank="${p.rank}">
  <a class="product-card__media" href="${ctx.url('product', p.id)}" tabindex="-1" aria-hidden="true">
    ${ctx.picture(p.images[0], { alt: '', sizes, label: L(p.name) })}
    <span class="bite" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    ${badges(ctx, p)}
  </a>
  <div class="product-card__body">
    <p class="product-card__cat">${L(cat.name)}</p>
    <h3 class="product-card__title"><a href="${ctx.url('product', p.id)}">${L(p.name)}</a></h3>
    ${short ? html`<p class="product-card__short">${L(p.short)}</p>` : ''}
    <div class="product-card__foot">
      <span class="price">${priceLabel(ctx, p)}</span>
      ${addButton(ctx, p)}
    </div>
  </div>
</article>`;
}

export function difficulty(ctx, level) {
  return html`<span class="difficulty" title="${ctx.t(`recipe.difficulty${level}`)}">
    ${[1, 2, 3].map((i) => html`<span class="difficulty__dot${i <= level ? ' is-on' : ''}">${icon('whisk')}</span>`)}
    <span class="visually-hidden">${ctx.t(`recipe.difficulty${level}`)}</span>
  </span>`;
}

export function minutes(ctx, total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return ctx.t('time.min', { m });
  return m ? ctx.t('time.hmin', { h, m }) : ctx.t('time.h', { h });
}

export function recipeCard(ctx, r) {
  const { L, t } = ctx;
  const product = ctx.data.products.find((p) => p.id === r.product);
  const total = r.prepMinutes + r.bakeMinutes + r.restMinutes;
  return html`<article class="recipe-card" data-recipe-card data-category="${r.category}" data-difficulty="${r.difficulty}"
    data-search="${(L(r.title) + ' ' + L(r.intro)).toLowerCase()}">
  <a class="recipe-card__media" href="${ctx.url('recipe', r.id)}" tabindex="-1" aria-hidden="true">
    ${ctx.picture(product.images[0], { alt: '', sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw', label: L(r.title) })}
  </a>
  <div class="recipe-card__body">
    <h3 class="recipe-card__title"><a href="${ctx.url('recipe', r.id)}">${L(r.title)}</a></h3>
    <ul class="recipe-meta">
      <li>${icon('clock')}${minutes(ctx, total)}</li>
      <li>${icon('users')}${r.servings} ${L(r.servingsUnit)}</li>
      <li>${difficulty(ctx, r.difficulty)}</li>
    </ul>
    <span class="recipe-card__more">${t('recipe.open')} ${icon('arrow')}</span>
  </div>
</article>`;
}

export function sectionHead(eyebrow, title, lead = '', { id = '', align = 'center' } = {}) {
  return html`<div class="section-head section-head--${align}">
    ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
    <h2 class="section-title"${id ? html` id="${id}"` : ''}>${title}</h2>
    ${lead ? html`<p class="section-lead">${lead}</p>` : ''}
  </div>`;
}

export function breadcrumbs(ctx, items) {
  return html`<nav class="breadcrumbs" aria-label="${ctx.t('a11y.breadcrumbs')}">
    <ol>
      ${items.map((it, i) =>
        i === items.length - 1
          ? html`<li><span aria-current="page">${it.name}</span></li>`
          : html`<li><a href="${it.url}">${it.name}</a></li>`,
      )}
    </ol>
  </nav>`;
}

export function wave(cls = '') {
  return html`<svg class="wave ${cls}" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40V18c60-10 120-10 180 0s120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0V40Z"/></svg>`;
}
