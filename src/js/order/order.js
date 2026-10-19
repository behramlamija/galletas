// Order page: basket list, summary, date rules, validation and sending.
import { $, h, icon } from '../utils/dom.js';
import { app, t, findProduct } from '../utils/app.js';
import { money } from '../utils/format.js';
import { getItems, setQty, removeItem, restore, clear, count } from '../basket/store.js';
import { toast } from '../ui/toast.js';
import { applyDateLimits } from './dates.js';
import { validate, liveClear, contactRules, readForm } from './validate.js';
import { orderMessage, lineItems } from './message.js';
import { initSendFlow } from './flow.js';

function leadDays() {
  const items = getItems();
  const fallback = Math.min(...Object.values(app().ordering.leadTimeDays));
  return items.reduce((max, i) => Math.max(max, findProduct(i.id)?.lead ?? fallback), items.length ? 0 : fallback);
}

function basketRow(item) {
  const p = findProduct(item.id);
  if (!p) return null;
  const opt = p.options.find((o) => o.id === item.opt);
  const flavour = p.flavours.find((f) => f.id === item.flavour);
  const meta = [opt?.label, flavour && `${t('flavour')}: ${flavour.label}`, item.inscription && `${t('inscription')}: „${item.inscription}“`].filter(Boolean).join(' · ');
  const price = opt ? money(opt.price * item.qty) : t('priceOnRequest');

  let row;
  const removeRow = () => {
    row.classList.add('is-removing');
    setTimeout(() => {
      const undo = removeItem(item.key);
      if (undo) toast(t('removed', { name: p.name }), { action: { label: t('undo'), onClick: () => restore(undo) }, duration: 6000 });
    }, 250);
  };

  const value = h('output', { class: 'stepper__value', 'aria-live': 'polite' }, String(item.qty));
  // At quantity 1 the "−" button removes the item (and shows a bin so that's obvious).
  const minus =
    item.qty > 1
      ? h('button', { type: 'button', class: 'stepper__btn', 'aria-label': `${t('less')}: ${p.name}`, onclick: () => setQty(item.key, item.qty - 1) }, icon('minus'))
      : h('button', { type: 'button', class: 'stepper__btn stepper__btn--remove', 'aria-label': `${t('remove')}: ${p.name}`, onclick: removeRow }, icon('trash'));
  const plus = h(
    'button',
    { type: 'button', class: 'stepper__btn', 'aria-label': `${t('more')}: ${p.name}`, disabled: item.qty >= 20, onclick: () => setQty(item.key, item.qty + 1) },
    icon('plus'),
  );

  row = h(
    'li',
    { class: 'basket-item', dataset: { key: item.key } },
    h('img', { class: 'basket-item__img', src: p.img, alt: '', width: 72, height: 72, loading: 'lazy' }),
    h('div', {}, h('a', { class: 'basket-item__name', href: p.url }, p.name), meta ? h('p', { class: 'basket-item__meta' }, meta) : null),
    h('p', { class: 'basket-item__price' }, price),
    h(
      'div',
      { class: 'basket-item__controls' },
      h('div', { class: 'stepper stepper--small', role: 'group', 'aria-label': t('qty') }, minus, value, plus),
      h('button', { type: 'button', class: 'basket-item__remove', 'aria-label': `${t('remove')}: ${p.name}`, onclick: removeRow }, icon('trash'), t('remove')),
    ),
  );
  return row;
}

export function initOrder() {
  const page = $('[data-order-page]');
  if (!page) return;
  const form = $('[data-order-form]', page);
  const list = $('[data-basket-list]', page);
  const empty = $('[data-basket-empty]', page);
  const dateInput = $('[data-date-input]', form);
  const dateHint = $('[data-date-hint]', form);
  const addressWrap = $('[data-address-wrap]', form);

  const render = () => {
    const items = getItems();
    list.replaceChildren(...items.map(basketRow).filter(Boolean));
    empty.hidden = items.length > 0;
    list.hidden = !items.length;
    applyDateLimits(dateInput, dateHint, leadDays());
    updateSummary();
  };

  const updateSummary = () => {
    const items = getItems();
    const { subtotal, hasQuote } = lineItems(items);
    const delivery = form.elements.fulfilment.value === 'delivery' ? app().ordering.deliveryFeeMostar : 0;
    $('[data-summary-count]', page).textContent = t('items', { n: count() });
    $('[data-summary-subtotal]', page).textContent = items.length ? money(subtotal) + (hasQuote ? ' +' : '') : '-';
    $('[data-summary-delivery]', page).textContent = delivery ? money(delivery) : t('free');
    $('[data-summary-total]', page).textContent = items.length ? money(subtotal + delivery) + (hasQuote ? ' +' : '') : '-';
    $('[data-summary-lead]', page).textContent = dateHint.textContent;
  };

  form.addEventListener('change', (e) => {
    if (e.target.name === 'fulfilment') {
      addressWrap.hidden = e.target.value !== 'delivery';
      updateSummary();
    }
  });
  window.addEventListener('basket:change', render);
  liveClear(form);
  render();

  initSendFlow({
    form,
    subject: 'Nova narudžba',
    isValid: () => {
      if (!getItems().length) {
        toast(t('errors.basketEmpty'));
        list.closest('section').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      return validate(form, contactRules(leadDays)).length === 0;
    },
    buildMessage: (ref) => orderMessage(ref, readForm(form), getItems()),
    payload: () => ({ ...readForm(form), items: getItems() }),
  });

  $('[data-clear-basket]')?.addEventListener('click', () => {
    clear();
    toast(t('basketCleared'));
  });
}
