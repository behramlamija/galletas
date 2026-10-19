import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { productCard, breadcrumbs, badges, sectionHead } from '../partials/cards.js';
import { breadcrumbLd, productLd } from '../partials/seo.js';
import { catalog } from '../partials/catalog.js';

function gallery(ctx, p) {
  const { L, t } = ctx;
  const name = L(p.name);
  return html`<div class="gallery" data-gallery>
  <button type="button" class="gallery__main" data-gallery-open aria-label="${t('product.zoom')}">
    ${p.images.map(
      (img, i) => html`<div class="gallery__slide${i === 0 ? ' is-active' : ''}" data-gallery-slide="${i}"${i ? html` hidden` : ''}>
        ${ctx.picture(img, { alt: p.images.length > 1 ? `${name} - ${i + 1}/${p.images.length}` : name, sizes: '(min-width: 900px) 50vw, 100vw', eager: i === 0, label: name })}
      </div>`,
    )}
    <span class="bite bite--big" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    ${badges(ctx, p)}
  </button>
  ${p.images.length > 1
    ? html`<div class="gallery__thumbs" role="group" aria-label="${t('product.photos')}">
        ${p.images.map(
          (img, i) => html`<button type="button" class="gallery__thumb" data-gallery-thumb="${i}" aria-pressed="${i === 0}" aria-label="${t('product.photo', { n: i + 1 })}">
            ${ctx.picture(img, { alt: '', sizes: '96px', label: name })}
          </button>`,
        )}
      </div>`
    : ''}
  <dialog class="lightbox" data-lightbox aria-label="${name}">
    <button type="button" class="icon-btn lightbox__close" data-lightbox-close aria-label="${t('a11y.close')}">${icon('close')}</button>
    <div class="lightbox__stage" data-lightbox-stage></div>
  </dialog>
</div>`;
}

function waFallback(ctx, p) {
  const text = `Zdravo! Zanima me narudžba: ${p.name.bs}${ctx.lang !== 'bs' ? ' [EN]' : ''}`;
  return `https://wa.me/${ctx.site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

function orderForm(ctx, p) {
  const { t, L } = ctx;
  if (p.pricing.unit === 'quote') {
    return html`<div class="buy-box buy-box--quote">
      <p class="buy-box__price"><span class="price price--big">${t('product.fromQuote', { price: ctx.money(p.pricing.from) })}</span></p>
      <p class="muted">${t('product.quoteText')}</p>
      <div class="buy-box__actions">
        <a class="btn btn--cta btn--large btn--block" href="${ctx.url('custom')}?design=${p.id}">${icon('sparkle')}${t('product.quoteCta')}</a>
        <a class="btn btn--ghost btn--block" href="${waFallback(ctx, p)}" rel="noopener" data-wa-direct>${icon('whatsapp')}${t('product.askWhatsapp')}</a>
      </div>
    </div>`;
  }
  const opts = p.pricing.options;
  return html`<form class="buy-box" data-product-form data-id="${p.id}" novalidate>
    <p class="buy-box__price" aria-live="polite">
      <span class="price price--big" data-price-display>${ctx.money(opts[0].price)}</span>
      <span class="muted">${t('product.estimate')}</span>
    </p>
    <fieldset class="options">
      <legend>${t('product.size')}</legend>
      <div class="options__list">
        ${opts.map(
          (o, i) => html`<label class="option">
            <input type="radio" name="opt" value="${o.id}" data-price="${o.price}" ${i === 0 ? html`checked` : ''}>
            <span class="option__box"><span class="option__label">${L(o.label)}</span><span class="option__price">${ctx.money(o.price)}</span></span>
          </label>`,
        )}
      </div>
    </fieldset>
    ${p.flavours
      ? html`<fieldset class="options">
          <legend>${t('product.flavour')}</legend>
          <div class="options__list options__list--pills">
            ${p.flavours.map(
              (f, i) => html`<label class="option option--pill">
                <input type="radio" name="flavour" value="${f.id}" ${i === 0 ? html`checked` : ''}>
                <span class="option__box">${L(f.label)}</span>
              </label>`,
            )}
          </div>
        </fieldset>`
      : ''}
    ${p.inscription
      ? html`<div class="field">
          <label for="inscription-${p.id}">${t('product.inscription')} <span class="muted">${t('form.optional')}</span></label>
          <input id="inscription-${p.id}" name="inscription" type="text" maxlength="40" placeholder="${t('product.inscriptionPlaceholder')}" autocomplete="off">
          <p class="hint">${t('product.inscriptionHint')}</p>
        </div>`
      : ''}
    <div class="buy-box__row">
      <div class="stepper" data-stepper>
        <button type="button" class="stepper__btn" data-step="-1" aria-label="${t('product.less')}">${icon('minus')}</button>
        <label class="visually-hidden" for="qty-${p.id}">${t('product.qty')}</label>
        <input id="qty-${p.id}" class="stepper__input" name="qty" type="number" inputmode="numeric" min="1" max="20" value="1">
        <button type="button" class="stepper__btn" data-step="1" aria-label="${t('product.more')}">${icon('plus')}</button>
      </div>
      <button type="submit" class="btn btn--cta btn--large buy-box__add" data-name="${L(p.name)}">${icon('basket')}${t('product.add')}</button>
    </div>
    <a class="btn btn--ghost btn--block" href="${waFallback(ctx, p)}" rel="noopener" data-wa-direct>${icon('whatsapp')}${t('product.orderWhatsapp')}</a>
  </form>`;
}

export function product(ctx, p) {
  const { t, L, data } = ctx;
  const cat = ctx.category(p.category);
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('nav.menu'), url: ctx.url('menu') },
    { name: L(p.name), url: ctx.url('product', p.id) },
  ];
  const recipe = p.recipe && data.recipes.find((r) => r.id === p.recipe);
  const related = [
    ...data.products.filter((x) => x.id !== p.id && x.category === p.category),
    ...data.products.filter((x) => x.id !== p.id && x.category !== p.category && x.featured),
  ].slice(0, 3);
  const lead = ctx.leadTime(p);

  const body = html`<section class="section section--tight product-page">
  <div class="container">
    ${breadcrumbs(ctx, crumbs)}
    <div class="product-layout">
      ${gallery(ctx, p)}
      <div class="product-info">
        <p class="eyebrow">${icon(cat.icon)} ${L(cat.name)}</p>
        <h1 class="page-title page-title--product">${L(p.name)}</h1>
        <p class="product-info__short">${L(p.short)}</p>
        ${orderForm(ctx, p)}
        <ul class="facts">
          <li>${icon('calendar')}<span>${t('product.leadTime', { n: lead })}</span></li>
          <li>${icon('truck')}<span>${t('product.delivery', { fee: ctx.money(ctx.site.ordering.deliveryFeeMostar) })}</span></li>
          <li>${icon('heart')}<span>${t('product.handmade')}</span></li>
        </ul>
      </div>
    </div>

    <div class="product-details">
      <div class="product-details__text">
        <h2 class="h3">${t('product.about')}</h2>
        <p>${L(p.description)}</p>
        ${recipe
          ? html`<a class="recipe-link" href="${ctx.url('recipe', recipe.id)}">${icon('rolling')}<span><strong>${t('product.seeRecipe')}</strong><br>${t('product.seeRecipeText')}</span>${icon('arrow')}</a>`
          : ''}
      </div>
      <div class="product-details__allergens">
        <h2 class="h3">${t('product.allergens')}</h2>
        <ul class="allergens">${p.allergens.map((a) => html`<li>${t(`allergens.${a}`)}</li>`)}</ul>
        <p class="hint">${t('legal.allergenNote')}</p>
      </div>
    </div>
  </div>
</section>
<section class="section related" aria-labelledby="related-title">
  <div class="container">
    ${sectionHead('', t('product.related'), '', { id: 'related-title' })}
    <div class="grid grid--products grid--three">
      ${related.map((r) => productCard(ctx, r))}
    </div>
  </div>
</section>`;

  return layout(ctx, {
    title: L(p.name),
    description: `${L(p.short)} ${t('seo.productSuffix')}`,
    body,
    pageClass: 'page-product',
    ogType: 'product',
    ogImage: ctx.imageUrl(p.images[0]),
    jsonld: [productLd(ctx, p), breadcrumbLd(ctx, crumbs)],
    client: { catalog: catalog(ctx, [p]) },
  });
}
