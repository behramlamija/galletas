// Form validation with accessible inline errors.
import { $ } from '../utils/dom.js';
import { t } from '../utils/app.js';
import { validateDate } from './dates.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function phoneOk(value) {
  const digits = value.replace(/[\s\-()./]/g, '');
  return /^\+?\d{6,15}$/.test(digits);
}

export function setError(form, name, message) {
  const field = $(`[data-field="${name}"]`, form);
  const err = $(`[data-error-for="${name}"]`, form);
  const control = form.elements[name];
  if (field) field.classList.toggle('has-error', !!message);
  if (err) {
    err.textContent = message || '';
    err.hidden = !message;
  }
  const controls = control instanceof RadioNodeList ? [...control] : control ? [control] : [];
  controls.forEach((c) => (message ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid')));
}

// rules: { name: (value, form) => errorMessage | "" }
export function validate(form, rules) {
  const errors = [];
  for (const [name, rule] of Object.entries(rules)) {
    const el = form.elements[name];
    const value = el?.type === 'checkbox' ? el.checked : String(el?.value ?? '').trim();
    const message = rule(value, form);
    setError(form, name, message);
    if (message) errors.push({ name, message });
  }
  const summary = $('[data-form-errors]', form);
  if (summary) {
    summary.hidden = !errors.length;
    summary.textContent = errors.length ? t('errors.summary', { n: errors.length }) : '';
  }
  if (errors.length) {
    const first = form.elements[errors[0].name];
    const target = first instanceof RadioNodeList ? first[0] : first;
    (target || summary)?.focus({ preventScroll: false });
    target?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  }
  return errors;
}

// Clears a field's error as soon as the visitor edits it.
export function liveClear(form) {
  form.addEventListener('input', (e) => e.target.name && setError(form, e.target.name, ''));
  form.addEventListener('change', (e) => e.target.name && setError(form, e.target.name, ''));
}

export function contactRules(getLeadDays) {
  return {
    name: (v) => (v.length >= 2 ? '' : t('errors.name')),
    phone: (v) => (!v ? t('errors.required') : phoneOk(v) ? '' : t('errors.phone')),
    email: (v) => (!v || EMAIL.test(v) ? '' : t('errors.email')),
    date: (v) => validateDate(v, getLeadDays()),
    time: (v) => (v ? '' : t('errors.time')),
    address: (v, form) => (form.elements.fulfilment?.value === 'delivery' && !v ? t('errors.address') : ''),
    consent: (v) => (v ? '' : t('errors.consent')),
  };
}

// Reads a form into a plain object; `multi` names are returned as arrays (checkbox groups).
export function readForm(form, multi = []) {
  const fd = new FormData(form);
  const out = {};
  for (const k of new Set(fd.keys())) out[k] = multi.includes(k) ? fd.getAll(k).map(String) : String(fd.get(k)).trim();
  for (const k of multi) out[k] ||= [];
  return out;
}
