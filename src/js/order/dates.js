// Lead-time rules for the pickup / delivery date.
import { app, t } from '../utils/app.js';
import { addDays, startOfToday, parseISODate, toISODate, formatDate } from '../utils/format.js';

export function earliestDate(leadDays) {
  const closed = app().ordering?.closedDays || [];
  let d = addDays(startOfToday(), leadDays);
  for (let i = 0; i < 7 && closed.includes(d.getDay()); i++) d = addDays(d, 1);
  return d;
}

// Sets min/max on the date input and the helper text. Returns the earliest date.
export function applyDateLimits(input, hint, leadDays) {
  const earliest = earliestDate(leadDays);
  input.min = toISODate(earliest);
  input.max = toISODate(addDays(startOfToday(), app().ordering?.maxDaysAhead || 180));
  if (hint) hint.textContent = t('earliest', { date: formatDate(earliest) });
  return earliest;
}

// Returns an error message, or "" when the date is acceptable.
export function validateDate(value, leadDays) {
  const date = parseISODate(value);
  if (!date) return t('errors.date');
  const earliest = earliestDate(leadDays);
  if (date < earliest) return t('errors.dateTooSoon', { date: formatDate(earliest) });
  if ((app().ordering?.closedDays || []).includes(date.getDay())) return t('errors.dateClosed');
  const max = app().ordering?.maxDaysAhead || 180;
  if (date > addDays(startOfToday(), max)) return t('errors.dateTooFar', { n: max });
  return '';
}
