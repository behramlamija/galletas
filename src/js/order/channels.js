// Hands the finished message to the channel the customer picked.
// On mobile it uses location.href so it also works inside in-app browsers.
import { app, t } from '../utils/app.js';
import { copyText } from '../utils/clipboard.js';
import { toast } from '../ui/toast.js';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

// On phones the link hands over to the app and the page stays put; on desktop a new
// tab keeps the success screen visible. Falls back to same-tab if a popup is blocked.
function go(url) {
  if (!isMobile() && /^https?:/.test(url)) {
    // ("noopener" would make window.open return null, so detach the opener manually.)
    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
      return;
    }
  }
  location.href = url;
}

export function channelNote(channel) {
  const { contact } = app();
  if (channel === 'instagram') return t('notes.instagram');
  if (channel === 'viber') return t('notes.viber', { phone: contact.phone });
  if (channel === 'email') return t('notes.email');
  return '';
}

// Resolves to true when the message was handed over.
export async function send(channel, text, { subject, payload } = {}) {
  const { contact, ordering } = app();
  const enc = encodeURIComponent(text);
  switch (channel) {
    case 'whatsapp':
      go(`https://wa.me/${contact.whatsapp}?text=${enc}`);
      return true;
    case 'viber': {
      await copyText(text);
      if (isMobile()) location.href = `viber://forward?text=${enc}`;
      else location.href = `viber://chat?number=%2B${contact.viber}`;
      toast(t('copied'));
      return true;
    }
    case 'instagram': {
      const ok = await copyText(text);
      toast(ok ? t('igToast') : t('copyFailed'), { duration: 6000 });
      go(`https://ig.me/m/${contact.instagram}`);
      return true;
    }
    case 'email':
      location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${enc}`;
      return true;
    case 'direct': {
      try {
        const res = await fetch(ordering.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ subject, message: text, ...payload }),
        });
        if (!res.ok) throw new Error(String(res.status));
        toast(t('sentDirect'), { cookie: true });
        return true;
      } catch {
        toast(t('sendError'), { duration: 6000 });
        return false;
      }
    }
    default:
      return false;
  }
}
