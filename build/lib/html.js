// Tiny HTML templating: a tagged template that escapes every interpolated value
// unless it was produced by `html` itself or wrapped with `raw()`.

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

export function raw(value) {
  return new SafeHtml(String(value ?? ''));
}

function render(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

// Serialises data for a <script type="application/json"> or JSON-LD block.
// Escaping "<" prevents a "</script>" inside the data from closing the tag.
export function jsonScript(data, attrs = '') {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return raw(`<script ${attrs}>${json}</script>`);
}
