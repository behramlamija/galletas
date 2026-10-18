// Shared pieces of the order and custom-cake forms: contact fields, send buttons,
// the message preview dialog and the success screen.
import { html, raw } from '../../../build/lib/html.js';
import { icon } from './icons.js';

export function field(ctx, { name, label, type = 'text', required = false, autocomplete = '', placeholder = '', hint = '', attrs = '' }) {
  const id = `f-${name}`;
  return html`<div class="field" data-field="${name}">
  <label for="${id}">${label}${required ? html` <span class="req" aria-hidden="true">*</span>` : html` <span class="muted">${ctx.t('form.optional')}</span>`}</label>
  ${type === 'textarea'
    ? html`<textarea id="${id}" name="${name}" rows="3" ${required ? html`required` : ''} placeholder="${placeholder}" aria-describedby="${id}-err${hint ? ` ${id}-hint` : ''}"></textarea>`
    : html`<input id="${id}" name="${name}" type="${type}" ${required ? html`required` : ''} ${autocomplete ? html`autocomplete="${autocomplete}"` : ''} placeholder="${placeholder}" aria-describedby="${id}-err${hint ? ` ${id}-hint` : ''}" ${attrs ? raw(attrs) : ''}>`}
  ${hint ? html`<p class="hint" id="${id}-hint">${hint}</p>` : ''}
  <p class="field-error" id="${id}-err" data-error-for="${name}" hidden></p>
</div>`;
}

export function contactFields(ctx, { num = 1 } = {}) {
  const { t } = ctx;
  return html`<fieldset class="form-section">
  <legend><span class="form-section__num">${num}</span>${t('form.contactTitle')}</legend>
  <div class="form-grid">
    ${field(ctx, { name: 'name', label: t('form.name'), required: true, autocomplete: 'name' })}
    ${field(ctx, { name: 'phone', label: t('form.phone'), type: 'tel', required: true, autocomplete: 'tel', placeholder: '+387 6x xxx xxx' })}
    ${field(ctx, { name: 'email', label: t('form.email'), type: 'email', autocomplete: 'email' })}
  </div>
</fieldset>`;
}

export function dateFields(ctx, { num = 2, fulfilment = true } = {}) {
  const { t, site } = ctx;
  return html`<fieldset class="form-section">
  <legend><span class="form-section__num">${num}</span>${t('form.whenTitle')}</legend>
  <div class="form-grid">
    <div class="field" data-field="date">
      <label for="f-date">${t('form.date')} <span class="req" aria-hidden="true">*</span></label>
      <input id="f-date" name="date" type="date" required data-date-input aria-describedby="f-date-hint f-date-err">
      <p class="hint" id="f-date-hint" data-date-hint>${t('form.dateHint')}</p>
      <p class="field-error" id="f-date-err" data-error-for="date" hidden></p>
    </div>
    <div class="field" data-field="time">
      <label for="f-time">${t('form.time')} <span class="req" aria-hidden="true">*</span></label>
      <select id="f-time" name="time" required aria-describedby="f-time-err">
        <option value="">${t('form.chooseTime')}</option>
        ${site.ordering.timeSlots.map((s) => html`<option value="${s}">${s}</option>`)}
      </select>
      <p class="field-error" id="f-time-err" data-error-for="time" hidden></p>
    </div>
  </div>
  ${fulfilment
    ? html`<div class="field" data-field="fulfilment">
        <span class="label" id="fulfilment-label">${t('form.fulfilment')} <span class="req" aria-hidden="true">*</span></span>
        <div class="options__list options__list--two" role="radiogroup" aria-labelledby="fulfilment-label">
          <label class="option">
            <input type="radio" name="fulfilment" value="pickup" checked>
            <span class="option__box">${icon('bag')}<span class="option__label">${t('form.pickup')}</span><span class="option__price">${t('form.free')}</span></span>
          </label>
          <label class="option">
            <input type="radio" name="fulfilment" value="delivery">
            <span class="option__box">${icon('truck')}<span class="option__label">${t('form.delivery')}</span><span class="option__price">${ctx.money(site.ordering.deliveryFeeMostar)}</span></span>
          </label>
        </div>
      </div>
      <div data-address-wrap hidden>
        ${field(ctx, { name: 'address', label: t('form.address'), autocomplete: 'street-address', hint: t('form.addressHint'), required: true })}
      </div>`
    : ''}
</fieldset>`;
}

export function occasionSelect(ctx, name = 'occasion') {
  const { t } = ctx;
  const occasions = t('form.occasions');
  return html`<div class="field" data-field="${name}">
  <label for="f-${name}">${t('form.occasion')} <span class="muted">${t('form.optional')}</span></label>
  <select id="f-${name}" name="${name}">
    <option value="">${t('form.chooseOccasion')}</option>
    ${Object.entries(occasions).map(([k, v]) => html`<option value="${k}">${v}</option>`)}
  </select>
</div>`;
}

export function consent(ctx) {
  const { t } = ctx;
  return html`<div class="field field--check" data-field="consent">
  <label class="check">
    <input type="checkbox" name="consent" required aria-describedby="f-consent-err">
    <span class="check__box" aria-hidden="true">${icon('check')}</span>
    <span>${t('form.consent')}</span>
  </label>
  <p class="field-error" id="f-consent-err" data-error-for="consent" hidden></p>
</div>
<div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>`;
}

export function sendButtons(ctx) {
  const { t, site } = ctx;
  return html`<div class="send">
  <h3 class="send__title">${t('send.title')}</h3>
  <p class="hint">${t('send.hint')}</p>
  <div class="send__grid">
    <button type="submit" class="send-btn send-btn--whatsapp" data-send="whatsapp">${icon('whatsapp')}<span>WhatsApp<small>${t('send.recommended')}</small></span></button>
    <button type="submit" class="send-btn send-btn--viber" data-send="viber">${icon('viber')}<span>Viber</span></button>
    <button type="submit" class="send-btn send-btn--instagram" data-send="instagram">${icon('instagram')}<span>Instagram DM</span></button>
    <button type="submit" class="send-btn send-btn--email" data-send="email">${icon('mail')}<span>${t('send.email')}</span></button>
    ${site.ordering.formEndpoint
      ? html`<button type="submit" class="send-btn send-btn--direct" data-send="direct">${icon('sparkle')}<span>${t('send.direct')}</span></button>`
      : ''}
  </div>
</div>`;
}

export function sendModal(ctx) {
  const { t } = ctx;
  return html`<dialog class="modal" data-send-modal aria-labelledby="send-modal-title">
  <form method="dialog" class="modal__inner">
    <header class="modal__head">
      <h2 class="h3" id="send-modal-title">${t('send.previewTitle')}</h2>
      <button type="button" class="icon-btn" data-modal-close aria-label="${t('a11y.close')}">${icon('close')}</button>
    </header>
    <p class="hint" data-modal-hint>${t('send.previewHint')}</p>
    <label class="visually-hidden" for="send-preview">${t('send.previewTitle')}</label>
    <textarea id="send-preview" class="modal__preview" rows="14" data-send-preview></textarea>
    <p class="modal__note" data-modal-note hidden></p>
    <footer class="modal__actions">
      <button type="button" class="btn btn--ghost" data-modal-copy>${icon('copy')}${t('send.copy')}</button>
      <button type="button" class="btn btn--cta" data-modal-confirm>${icon('arrow')}<span data-modal-confirm-label>${t('send.confirm')}</span></button>
    </footer>
  </form>
</dialog>`;
}

export function successScreen(ctx, { basket = true } = {}) {
  const { t } = ctx;
  return html`<section class="success" data-success hidden tabindex="-1" aria-labelledby="success-title">
  <div class="success__card">
    <span class="success__icon" aria-hidden="true">${icon('check')}</span>
    <h2 class="section-title" id="success-title">${t('success.title')}</h2>
    <p>${t('success.text')}</p>
    <p class="success__ref">${t('success.ref')} <strong data-success-ref></strong></p>
    <pre class="success__summary" data-success-summary></pre>
    <div class="success__actions">
      <button type="button" class="btn btn--ghost" data-print>${icon('print')}${t('success.print')}</button>
      ${basket ? html`<button type="button" class="btn btn--ghost" data-clear-basket>${icon('trash')}${t('success.clear')}</button>` : ''}
      <button type="button" class="btn btn--ghost" data-success-back>${icon('arrow-left')}${t('success.edit')}</button>
      <a class="btn btn--primary" href="${ctx.url('home')}">${t('success.home')}</a>
    </div>
  </div>
</section>`;
}

export function noscriptNote(ctx) {
  const c = ctx.site.contact;
  return html`<noscript><p class="notice">${ctx.t('form.noscript')} <a href="https://wa.me/${c.whatsapp}">WhatsApp</a> · <a href="mailto:${c.email}">${c.email}</a></p></noscript>`;
}
