import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { pageHero } from './menu.js';
import { catalog } from '../partials/catalog.js';
import { contactFields, dateFields, occasionSelect, consent, sendButtons, sendModal, successScreen, field, noscriptNote } from '../partials/send.js';

export function order(ctx) {
  const { t } = ctx;
  const crumbs = [
    { name: t('nav.home'), url: ctx.url('home') },
    { name: t('order.title'), url: ctx.url('order') },
  ];
  const body = html`${pageHero(ctx, { eyebrow: t('order.eyebrow'), title: t('order.title'), lead: t('order.lead'), crumbs, cls: 'page-hero--compact' })}
<section class="section section--tight order" data-order-page>
  <div class="container">
    ${noscriptNote(ctx)}
    <div class="order-layout" data-order-layout>
      <div class="order-main">
        <section class="card basket" aria-labelledby="basket-title">
          <header class="card__head">
            <h2 class="h3" id="basket-title">${icon('basket')} ${t('order.basketTitle')}</h2>
            <a class="link-arrow" href="${ctx.url('menu')}">${icon('plus')} ${t('order.addMore')}</a>
          </header>
          <ul class="basket-list" data-basket-list aria-live="polite"></ul>
          <div class="basket-empty" data-basket-empty hidden>
            <span class="crumb-cookie" aria-hidden="true">${icon('cookie')}<i></i><i></i><i></i></span>
            <p><strong>${t('order.emptyTitle')}</strong></p>
            <p class="muted">${t('order.emptyText')}</p>
            <div class="basket-empty__actions">
              <a class="btn btn--cta" href="${ctx.url('menu')}">${icon('cake')}${t('order.browse')}</a>
              <a class="btn btn--ghost" href="${ctx.url('custom')}">${t('nav.custom')}</a>
            </div>
          </div>
        </section>

        <form class="card order-form" data-order-form novalidate>
          <div class="form-errors" data-form-errors role="alert" tabindex="-1" hidden></div>
          ${contactFields(ctx)}
          ${dateFields(ctx)}
          <fieldset class="form-section">
            <legend><span class="form-section__num">3</span>${t('form.detailsTitle')}</legend>
            <div class="form-grid">
              ${occasionSelect(ctx)}
              ${field(ctx, { name: 'allergies', label: t('form.allergies'), placeholder: t('form.allergiesPlaceholder') })}
            </div>
            ${field(ctx, { name: 'notes', label: t('form.notes'), type: 'textarea', placeholder: t('form.notesPlaceholder') })}
          </fieldset>
          ${consent(ctx)}
          ${sendButtons(ctx)}
        </form>
      </div>

      <aside class="order-summary" aria-labelledby="summary-title">
        <div class="card summary-card">
          <h2 class="h3" id="summary-title">${t('order.summaryTitle')}</h2>
          <dl class="summary">
            <div><dt>${t('order.items')}</dt><dd data-summary-count>0</dd></div>
            <div><dt>${t('order.subtotal')}</dt><dd data-summary-subtotal>-</dd></div>
            <div><dt>${t('order.deliveryLine')}</dt><dd data-summary-delivery>${t('form.free')}</dd></div>
            <div class="summary__total"><dt>${t('order.total')}</dt><dd data-summary-total>-</dd></div>
          </dl>
          <p class="hint">${icon('info')} ${t('order.finalPrice')}</p>
          <p class="hint" data-summary-lead></p>
        </div>
        <div class="card help-card">
          <p><strong>${t('order.helpTitle')}</strong></p>
          <p class="muted">${t('order.helpText')}</p>
          <a class="link-arrow" href="https://wa.me/${ctx.site.contact.whatsapp}" rel="noopener">${icon('whatsapp')} ${t('order.helpCta')}</a>
        </div>
      </aside>
    </div>
    ${successScreen(ctx)}
  </div>
</section>
${sendModal(ctx)}`;

  return layout(ctx, {
    title: t('order.title'),
    description: t('seo.orderDescription'),
    body,
    pageClass: 'page-order',
    client: { catalog: catalog(ctx) },
  });
}
