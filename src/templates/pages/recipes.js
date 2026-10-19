import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { recipeCard, breadcrumbs, difficulty, minutes, addButton, priceLabel } from '../partials/cards.js';
import { breadcrumbLd, recipeLd } from '../partials/seo.js';
import { pageHero } from './menu.js';
import { catalog } from '../partials/catalog.js';

// Same rounding rules as the client-side scaler (src/js/recipe/scaler.js).
export function formatQty(qty, unit) {
  if (unit === 'pinch') return '';
  if (unit === 'g' || unit === 'ml') return String(qty >= 20 ? Math.round(qty / 5) * 5 : Math.round(qty));
  const halves = Math.round(qty * 2) / 2;
  return String(Math.max(halves, 0.5)).replace('.5', '½').replace(/^0½/, '½');
}

export function recipes(ctx) {
  const { t, L, data } = ctx;
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('nav.recipes'), url: ctx.url('recipes') },
  ];
  const cats = data.categories.filter((c) => data.recipes.some((r) => r.category === c.id));
  const body = html`${pageHero(ctx, { eyebrow: t('recipes.eyebrow'), title: t('recipes.title'), lead: t('recipes.lead'), crumbs })}
<section class="section section--tight">
  <div class="container">
    <div class="toolbar">
      <label class="search">
        <span class="visually-hidden">${t('recipes.search')}</span>
        ${icon('search')}
        <input type="search" placeholder="${t('recipes.searchPlaceholder')}" data-filter-search="recipes" autocomplete="off">
      </label>
      <label class="select">
        <span class="visually-hidden">${t('recipes.difficulty')}</span>
        <select data-filter-extra="recipes" data-filter-attr="difficulty">
          <option value="">${t('recipes.anyDifficulty')}</option>
          ${[1, 2, 3].map((d) => html`<option value="${d}">${t(`recipe.difficulty${d}`)}</option>`)}
        </select>
      </label>
    </div>
    <div class="chips" role="group" aria-label="${t('menu.filterLabel')}" data-filter-chips="recipes">
      <button type="button" class="chip" data-filter="all" aria-pressed="true">${t('menu.all')}</button>
      ${cats.map((c) => html`<button type="button" class="chip" data-filter="${c.id}" aria-pressed="false">${icon(c.icon)}${L(c.name)}</button>`)}
    </div>
    <div class="grid grid--recipes" data-filter-list="recipes">
      ${data.recipes.map((r) => recipeCard(ctx, r))}
    </div>
    <div class="empty-state empty-state--big" data-filter-empty="recipes" hidden>
      <span class="crumb-cookie" aria-hidden="true">${icon('cookie')}<i></i><i></i><i></i></span>
      <p>${t('recipes.empty')}</p>
      <button type="button" class="btn btn--ghost" data-filter-reset="recipes">${t('menu.reset')}</button>
    </div>
  </div>
</section>`;
  return layout(ctx, {
    title: t('recipes.title'),
    description: t('seo.recipesDescription'),
    body,
    pageClass: 'page-recipes',
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}

export function recipe(ctx, r) {
  const { t, L, data } = ctx;
  const product = data.products.find((p) => p.id === r.product);
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('nav.recipes'), url: ctx.url('recipes') },
    { name: L(r.title), url: ctx.url('recipe', r.id) },
  ];
  const total = r.prepMinutes + r.bakeMinutes + r.restMinutes;

  const body = html`<article class="recipe" data-recipe="${r.id}" data-servings="${r.servings}">
  <header class="section section--tight recipe-hero">
    <div class="container">
      ${breadcrumbs(ctx, crumbs)}
      <div class="recipe-hero__grid">
        <div class="recipe-hero__copy">
          <p class="eyebrow">${icon('rolling')} ${t('recipe.eyebrow')}</p>
          <h1 class="page-title">${L(r.title)}</h1>
          <p class="page-lead">${L(r.intro)}</p>
          <p class="recipe-hero__by">- ${ctx.site.owner.name}</p>
          <ul class="recipe-stats">
            <li><span>${t('recipe.prep')}</span><strong>${minutes(ctx, r.prepMinutes)}</strong></li>
            <li><span>${t('recipe.bake')}</span><strong>${r.bakeMinutes ? minutes(ctx, r.bakeMinutes) : t('recipe.noBake')}</strong></li>
            <li><span>${t('recipe.total')}</span><strong>${minutes(ctx, total)}</strong></li>
            <li><span>${t('recipe.difficulty')}</span><strong>${difficulty(ctx, r.difficulty)}</strong></li>
          </ul>
          <div class="recipe-hero__actions">
            <button type="button" class="btn btn--ghost" data-print>${icon('print')}${t('recipe.print')}</button>
            <button type="button" class="btn btn--ghost" data-cook-mode aria-pressed="false">${icon('flame')}<span>${t('recipe.cookMode')}</span></button>
          </div>
        </div>
        <div class="recipe-hero__media">
          ${ctx.picture(product.images[0], { alt: L(product.name), sizes: '(min-width: 900px) 45vw, 100vw', eager: true, label: L(r.title) })}
        </div>
      </div>
    </div>
  </header>

  <section class="section section--tight recipe-body">
    <div class="container recipe-layout">
      <aside class="ingredients card" aria-labelledby="ingredients-title">
        <div class="ingredients__head">
          <h2 class="h3" id="ingredients-title">${t('recipe.ingredients')}</h2>
          <div class="stepper stepper--small" data-scaler>
            <button type="button" class="stepper__btn" data-scale="-1" aria-label="${t('recipe.fewer')}">${icon('minus')}</button>
            <output class="stepper__value" data-scaler-value aria-live="polite">${r.servings}</output>
            <button type="button" class="stepper__btn" data-scale="1" aria-label="${t('recipe.moreServings')}">${icon('plus')}</button>
          </div>
        </div>
        <p class="hint">${t('recipe.servingsFor')} <span data-scaler-label>${r.servings}</span> ${L(r.servingsUnit)} · <button type="button" class="link-btn" data-scaler-reset>${t('recipe.reset')}</button></p>
        ${r.groups.map(
          (g, gi) => html`<div class="ingredients__group">
            <h3 class="ingredients__title">${L(g.title)}</h3>
            <ul class="ingredients__list">
              ${g.items.map(
                (it, ii) => html`<li>
                  <label class="ingredient">
                    <input type="checkbox" data-ingredient="${gi}-${ii}">
                    <span class="ingredient__check" aria-hidden="true">${icon('check')}</span>
                    <span class="ingredient__text">
                      <span class="ingredient__qty" data-qty="${it.qty}" data-unit="${it.unit}" data-unit-label="${t(`units.${it.unit}`)}">${formatQty(it.qty, it.unit)} ${t(`units.${it.unit}`)}</span>
                      ${L(it.name)}
                    </span>
                    <svg class="ingredient__strike" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M1 6 C 20 3, 40 8, 60 5 S 90 4, 99 6"/></svg>
                  </label>
                </li>`,
              )}
            </ul>
          </div>`,
        )}
      </aside>

      <div class="method">
        <h2 class="h3">${t('recipe.method')}</h2>
        <ol class="method__steps">
          ${r.steps.map((s) => html`<li><p>${L(s)}</p></li>`)}
        </ol>
        ${r.tips.map(
          (tip) => html`<aside class="tip">
            <span class="tip__icon" aria-hidden="true">${icon('chef')}</span>
            <div><p class="tip__title">${t('recipe.tip')}</p><p>${L(tip)}</p></div>
          </aside>`,
        )}

        <aside class="order-it reveal">
          <div class="order-it__media">${ctx.picture(product.images[0], { alt: '', sizes: '160px', label: L(product.name) })}</div>
          <div class="order-it__copy">
            <h2 class="h3">${t('recipe.orderTitle')}</h2>
            <p>${t('recipe.orderText', { name: L(product.name) })}</p>
            <div class="order-it__actions">
              <span class="price">${priceLabel(ctx, product)}</span>
              ${addButton(ctx, product)}
              <a class="link-arrow" href="${ctx.url('product', product.id)}">${t('recipe.orderLink')} ${icon('arrow')}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</article>`;

  return layout(ctx, {
    title: `${L(r.title)} - ${t('recipe.eyebrow')}`,
    description: L(r.intro).slice(0, 155),
    body,
    pageClass: 'page-recipe',
    ogType: 'article',
    ogImage: ctx.imageUrl(product.images[0]),
    jsonld: [recipeLd(ctx, r, product), breadcrumbLd(ctx, crumbs)],
    client: { catalog: catalog(ctx, [product]) },
  });
}
