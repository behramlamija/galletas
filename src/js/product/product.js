// Product page: option pickers, live price, quantity stepper, add to basket,
// a one-item WhatsApp order link, and the photo gallery / lightbox.
import { $, $$ } from '../utils/dom.js';
import { app, findProduct } from '../utils/app.js';
import { money } from '../utils/format.js';
import { add } from '../basket/store.js';
import { addedFeedback } from '../basket/ui.js';

export function initStepper(root, onChange) {
  const input = $('input', root);
  const clamp = (v) => Math.min(Number(input.max) || 20, Math.max(Number(input.min) || 1, v));
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    input.value = clamp((Number(input.value) || 1) + Number(btn.dataset.step));
    onChange?.(Number(input.value));
  });
  input.addEventListener('change', () => {
    input.value = clamp(Math.round(Number(input.value)) || 1);
    onChange?.(Number(input.value));
  });
}

function initBuyForm() {
  const form = $('[data-product-form]');
  if (!form) return;
  const product = findProduct(form.dataset.id);
  const priceEl = $('[data-price-display]', form);
  const wa = $('[data-wa-direct]', form);

  const read = () => {
    const fd = new FormData(form);
    return {
      id: product.id,
      opt: fd.get('opt') || '',
      flavour: fd.get('flavour') || '',
      inscription: String(fd.get('inscription') || '').trim(),
      qty: Number(fd.get('qty')) || 1,
    };
  };

  const update = () => {
    const sel = read();
    const option = product.options.find((o) => o.id === sel.opt);
    if (option && priceEl) {
      priceEl.textContent = money(option.price * sel.qty);
      priceEl.classList.remove('is-updating');
      void priceEl.offsetWidth;
      priceEl.classList.add('is-updating');
    }
    if (wa) {
      const flavour = product.flavours.find((f) => f.id === sel.flavour);
      const parts = [`${sel.qty}× ${product.nameBs}`, option?.labelBs, flavour && `okus: ${flavour.labelBs}`, sel.inscription && `natpis: "${sel.inscription}"`];
      const text = `Zdravo! Želim naručiti: ${parts.filter(Boolean).join(' - ')}${app().lang !== 'bs' ? ' [EN]' : ''}`;
      wa.href = `https://wa.me/${app().contact.whatsapp}?text=${encodeURIComponent(text)}`;
    }
  };

  form.addEventListener('change', update);
  form.addEventListener('input', (e) => e.target.name === 'inscription' && update());
  const stepper = $('[data-stepper]', form);
  if (stepper) initStepper(stepper, update);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    add(read());
    const btn = $('.buy-box__add', form);
    addedFeedback(btn.dataset.name, btn);
  });
  update();
}

function initGallery() {
  const gallery = $('[data-gallery]');
  if (!gallery) return;
  const slides = $$('[data-gallery-slide]', gallery);
  const thumbs = $$('[data-gallery-thumb]', gallery);
  const main = $('[data-gallery-open]', gallery);
  const lightbox = $('[data-lightbox]', gallery);
  let index = 0;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.hidden = n !== index;
      s.classList.toggle('is-active', n === index);
    });
    thumbs.forEach((tb, n) => tb.setAttribute('aria-pressed', String(n === index)));
  };
  thumbs.forEach((tb) => tb.addEventListener('click', () => show(Number(tb.dataset.galleryThumb))));

  // Swipe between photos on touch screens.
  let startX = null;
  let swiped = false;
  main.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    swiped = false;
  });
  main.addEventListener('pointerup', (e) => {
    if (startX == null || slides.length < 2) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) {
      swiped = true;
      show(index + (dx < 0 ? 1 : -1));
    }
    startX = null;
  });

  main.addEventListener('click', () => {
    if (swiped || !lightbox?.showModal) return;
    const img = $('img', slides[index]);
    const big = new Image();
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    $('[data-lightbox-stage]', lightbox).replaceChildren(big);
    lightbox.showModal();
  });
  if (lightbox) {
    $('[data-lightbox-close]', lightbox).addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (e) => e.target === lightbox && lightbox.close());
  }
}

export function initProduct() {
  initBuyForm();
  initGallery();
}
