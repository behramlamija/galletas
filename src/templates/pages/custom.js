import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { pageHero } from './menu.js';
import { catalog } from '../partials/catalog.js';
import { contactFields, dateFields, occasionSelect, consent, sendButtons, sendModal, successScreen, field, noscriptNote } from '../partials/send.js';

const COLOURS = ['white', 'pink', 'blue', 'gold', 'green', 'lavender', 'burgundy', 'black'];

function choiceList(ctx, { name, type = 'radio', items, legend, pills = true, checkedFirst = true }) {
  return html`<fieldset class="options">
  <legend>${legend}</legend>
  <div class="options__list ${pills ? 'options__list--pills' : ''}">
    ${Object.entries(items).map(
      ([value, label], i) => html`<label class="option option--pill">
        <input type="${type}" name="${name}" value="${value}" ${checkedFirst && type === 'radio' && i === 0 ? html`checked` : ''}>
        <span class="option__box">${label}</span>
      </label>`,
    )}
  </div>
</fieldset>`;
}

export function custom(ctx) {
  const { t, L, data } = ctx;
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('nav.menu'), url: ctx.url('menu') },
    { name: t('custom.title'), url: ctx.url('custom') },
  ];
  const designs = data.products.filter((p) => p.category === 'slavljenicke');

  const body = html`${pageHero(ctx, { eyebrow: t('custom.eyebrow'), title: t('custom.title'), lead: t('custom.lead'), crumbs, cls: 'page-hero--compact' })}
<section class="section section--tight custom" data-custom-page>
  <div class="container">
    ${noscriptNote(ctx)}
    <div class="order-layout" data-order-layout>
      <form class="card order-form" data-custom-form novalidate>
        <div class="form-errors" data-form-errors role="alert" tabindex="-1" hidden></div>
        <fieldset class="form-section">
          <legend><span class="form-section__num">1</span>${t('custom.cakeTitle')}</legend>
          <div class="field" data-field="design">
            <label for="f-design">${t('custom.design')} <span class="muted">${t('form.optional')}</span></label>
            <select id="f-design" name="design" data-design-select>
              <option value="">${t('custom.designNone')}</option>
              ${designs.map((p) => html`<option value="${p.id}">${L(p.name)}</option>`)}
            </select>
          </div>
          <div class="form-grid">
            ${occasionSelect(ctx)}
            <div class="field" data-field="guests">
              <label for="f-guests">${t('custom.guests')}: <output data-range-output for="f-guests">20</output></label>
              <input id="f-guests" name="guests" type="range" min="8" max="150" step="1" value="20" data-range>
            </div>
          </div>
          ${choiceList(ctx, { name: 'tiers', legend: t('custom.tiers'), items: { 1: t('custom.tier1'), 2: t('custom.tier2'), 3: t('custom.tier3') } })}
          <div class="form-grid">
            <div class="field" data-field="sponge">
              <label for="f-sponge">${t('custom.sponge')}</label>
              <select id="f-sponge" name="sponge">
                ${Object.entries(t('custom.sponges')).map(([k, v]) => html`<option value="${k}">${v}</option>`)}
              </select>
            </div>
            <div class="field" data-field="budget">
              <label for="f-budget">${t('custom.budget')} <span class="muted">${t('form.optional')}</span></label>
              <select id="f-budget" name="budget">
                <option value="">${t('custom.budgetAny')}</option>
                ${Object.entries(t('custom.budgets')).map(([k, v]) => html`<option value="${k}">${v}</option>`)}
              </select>
            </div>
          </div>
          ${choiceList(ctx, { name: 'fillings', type: 'checkbox', legend: t('custom.fillings'), items: t('custom.fillingList') })}
          ${choiceList(ctx, { name: 'style', legend: t('custom.style'), items: t('custom.styles') })}
          <fieldset class="options">
            <legend>${t('custom.colours')}</legend>
            <div class="swatches">
              ${COLOURS.map(
                (c) => html`<label class="swatch">
                  <input type="checkbox" name="colours" value="${c}">
                  <span class="swatch__dot swatch__dot--${c}" aria-hidden="true">${icon('check')}</span>
                  <span class="swatch__label">${t(`custom.colourNames.${c}`)}</span>
                </label>`,
              )}
            </div>
          </fieldset>
          ${field(ctx, { name: 'inscription', label: t('product.inscription'), placeholder: t('product.inscriptionPlaceholder'), attrs: 'maxlength="40"' })}
          ${field(ctx, { name: 'idea', label: t('custom.idea'), type: 'textarea', placeholder: t('custom.ideaPlaceholder') })}
          <p class="notice notice--soft">${icon('info')} ${t('custom.photoNote')}</p>
        </fieldset>
        ${dateFields(ctx, { num: 2 })}
        ${contactFields(ctx, { num: 3 })}
        ${consent(ctx)}
        ${sendButtons(ctx)}
      </form>

      <aside class="order-summary" aria-labelledby="inspo-title">
        <div class="card inspo-card" data-inspo>
          <h2 class="h3" id="inspo-title">${t('custom.inspoTitle')}</h2>
          <div class="inspo-card__media" data-inspo-media>
            ${designs.map(
              (p, i) => html`<figure data-inspo-item="${p.id}"${i ? html` hidden` : ''}>
                ${ctx.picture(p.images[0], { alt: L(p.name), sizes: '(min-width: 900px) 30vw, 90vw', label: L(p.name) })}
                <figcaption>${L(p.name)} · ${t('product.fromQuote', { price: ctx.money(p.pricing.from) })}</figcaption>
              </figure>`,
            )}
          </div>
          <ul class="facts">
            <li>${icon('calendar')}<span>${t('custom.leadNote', { n: ctx.site.ordering.customLeadTimeDays })}</span></li>
            <li>${icon('users')}<span>${t('custom.guestsNote')}</span></li>
            <li>${icon('heart')}<span>${t('custom.depositNote')}</span></li>
          </ul>
        </div>
      </aside>
    </div>
    ${successScreen(ctx, { basket: false })}
  </div>
</section>
${sendModal(ctx)}`;

  return layout(ctx, {
    title: t('custom.title'),
    description: t('seo.customDescription'),
    body,
    pageClass: 'page-custom',
    client: { catalog: catalog(ctx, designs) },
  });
}
