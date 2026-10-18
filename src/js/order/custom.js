// Custom cake request page.
import { $, $$ } from '../utils/dom.js';
import { app } from '../utils/app.js';
import { applyDateLimits } from './dates.js';
import { validate, liveClear, contactRules, readForm } from './validate.js';
import { customMessage } from './message.js';
import { initSendFlow } from './flow.js';

export function initCustom() {
  const page = $('[data-custom-page]');
  if (!page) return;
  const form = $('[data-custom-form]', page);
  const lead = () => app().ordering.customLeadTimeDays;
  const design = $('[data-design-select]', form);
  const inspo = $('[data-inspo]');
  const figures = $$('[data-inspo-item]', inspo);
  const range = $('[data-range]', form);
  const output = $('[data-range-output]', form);
  const addressWrap = $('[data-address-wrap]', form);

  const showDesign = () => {
    const id = design.value;
    const match = figures.find((f) => f.dataset.inspoItem === id);
    figures.forEach((f, i) => (f.hidden = match ? f !== match : i !== 0));
    inspo.classList.toggle('is-empty', !match);
  };

  // Pre-select a design passed as ?design=<id> from a product card.
  const requested = new URLSearchParams(location.search).get('design');
  if (requested && [...design.options].some((o) => o.value === requested)) design.value = requested;
  design.addEventListener('change', showDesign);
  showDesign();

  range.addEventListener('input', () => (output.value = range.value));
  form.addEventListener('change', (e) => {
    if (e.target.name === 'fulfilment') addressWrap.hidden = e.target.value !== 'delivery';
  });
  applyDateLimits($('[data-date-input]', form), $('[data-date-hint]', form), lead());
  liveClear(form);

  const MULTI = ['fillings', 'colours'];
  initSendFlow({
    form,
    subject: 'Upit za tortu po želji',
    isValid: () => validate(form, contactRules(lead)).length === 0,
    buildMessage: (ref) => customMessage(ref, readForm(form, MULTI)),
    payload: () => readForm(form, MULTI),
  });
}
