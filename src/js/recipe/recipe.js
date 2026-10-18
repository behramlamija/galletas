// Recipe page: servings scaler, ingredient checklist (remembered per recipe) and cook mode.
import { $, $$ } from '../utils/dom.js';
import { t } from '../utils/app.js';
import { load, save } from '../utils/storage.js';
import { toast } from '../ui/toast.js';

// Same rounding as the build (src/templates/pages/recipes.js → formatQty).
export function formatQty(qty, unit) {
  if (unit === 'pinch') return '';
  if (unit === 'g' || unit === 'ml') return String(qty >= 20 ? Math.round(qty / 5) * 5 : Math.round(qty));
  const halves = Math.round(qty * 2) / 2;
  return String(Math.max(halves, 0.5)).replace('.5', '½').replace(/^0½/, '½');
}

function initScaler(root) {
  const base = Number(root.dataset.servings);
  const step = Math.max(1, Math.round(base / 12));
  const value = $('[data-scaler-value]', root);
  const label = $('[data-scaler-label]', root);
  const qtys = $$('[data-qty]', root);
  let current = base;

  const render = () => {
    value.textContent = current;
    label.textContent = current;
    const factor = current / base;
    for (const el of qtys) {
      const text = `${formatQty(Number(el.dataset.qty) * factor, el.dataset.unit)} ${el.dataset.unitLabel}`.trim();
      if (el.textContent !== text) {
        el.textContent = text;
        el.classList.remove('is-updating');
        void el.offsetWidth;
        el.classList.add('is-updating');
      }
    }
  };
  $$('[data-scale]', root).forEach((btn) =>
    btn.addEventListener('click', () => {
      current = Math.min(base * 4, Math.max(step, current + Number(btn.dataset.scale) * step));
      render();
    }),
  );
  $('[data-scaler-reset]', root)?.addEventListener('click', () => {
    current = base;
    render();
  });
}

function initChecklist(root) {
  const key = `es-recipe-${root.dataset.recipe}`;
  const checked = new Set(load(key, []));
  $$('[data-ingredient]', root).forEach((box) => {
    box.checked = checked.has(box.dataset.ingredient);
    box.addEventListener('change', () => {
      if (box.checked) checked.add(box.dataset.ingredient);
      else checked.delete(box.dataset.ingredient);
      save(key, [...checked]);
    });
  });
}

function initCookMode(root) {
  const btn = $('[data-cook-mode]', root);
  if (!btn) return;
  let lock = null;
  let on = false;
  const requestLock = async () => {
    try {
      lock = await navigator.wakeLock?.request('screen');
    } catch {
      lock = null;
    }
  };
  btn.addEventListener('click', async () => {
    on = !on;
    btn.setAttribute('aria-pressed', String(on));
    document.body.classList.toggle('cook-mode', on);
    if (on) await requestLock();
    else {
      await lock?.release?.();
      lock = null;
    }
    toast(on ? t('cookOn') : t('cookOff'));
  });
  // Wake locks are released when the tab is hidden; take it again on return.
  document.addEventListener('visibilitychange', () => {
    if (on && document.visibilityState === 'visible') requestLock();
  });
}

export function initRecipe() {
  const root = $('[data-recipe]');
  if (!root) return;
  initScaler(root);
  initChecklist(root);
  initCookMode(root);
}
