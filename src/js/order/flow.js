// Shared "preview → send → success" flow for the order and custom-cake forms.
import { $ } from '../utils/dom.js';
import { t } from '../utils/app.js';
import { copyText } from '../utils/clipboard.js';
import { toast } from '../ui/toast.js';
import { burst, burstFrom } from '../fx/burst.js';
import { reference } from './message.js';
import { send, channelNote } from './channels.js';

export function initSendFlow({ form, isValid, buildMessage, subject, payload = () => ({}) }) {
  const modal = $('[data-send-modal]');
  const preview = $('[data-send-preview]', modal);
  const note = $('[data-modal-note]', modal);
  const confirmBtn = $('[data-modal-confirm]', modal);
  const confirmLabel = $('[data-modal-confirm-label]', modal);
  const layout = $('[data-order-layout]');
  const success = $('[data-success]');
  let channel = 'whatsapp';
  let ref = '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    channel = e.submitter?.dataset.send || 'whatsapp';
    if (form.elements.website?.value) return; // honeypot: silently ignore bots
    if (!isValid()) return;
    ref = reference();
    preview.value = buildMessage(ref);
    confirmLabel.textContent = t(`confirm.${channel}`);
    const n = channelNote(channel);
    note.textContent = n;
    note.hidden = !n;
    if (modal.showModal) modal.showModal();
    else confirmBtn.click();
  });

  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    const text = preview.value.trim();
    const ok = await send(channel, text, { subject: `${subject} ${ref}`, payload: { reference: ref, ...payload() } });
    confirmBtn.disabled = false;
    if (!ok) return;
    modal.close?.();
    showSuccess(text);
  });

  $('[data-modal-copy]', modal).addEventListener('click', async () => {
    toast((await copyText(preview.value)) ? t('copied') : t('copyFailed'));
  });
  $('[data-modal-close]', modal).addEventListener('click', () => modal.close());

  function showSuccess(text) {
    layout.hidden = true;
    success.hidden = false;
    $('[data-success-ref]', success).textContent = ref;
    $('[data-success-summary]', success).textContent = text;
    window.scrollTo({ top: 0 });
    success.focus({ preventScroll: true });
    // Celebrate: one big explosion from the check mark, then two from the sides.
    setTimeout(() => {
      burstFrom($('.success__icon', success), { count: 110, power: 17 });
      setTimeout(() => {
        burst(0, innerHeight * 0.6, { count: 45, power: 18, angle: -Math.PI / 3, spread: 0.9 });
        burst(innerWidth, innerHeight * 0.6, { count: 45, power: 18, angle: (-2 * Math.PI) / 3, spread: 0.9 });
      }, 260);
    }, 250);
  }

  $('[data-success-back]', success)?.addEventListener('click', () => {
    success.hidden = true;
    layout.hidden = false;
    form.scrollIntoView({ block: 'start' });
  });
}
