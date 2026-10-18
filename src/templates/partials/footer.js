import { html } from '../../../build/lib/html.js';
import { icon } from './icons.js';
import { brand, langSwitch } from './header.js';

export function contactLinks(ctx, cls = '') {
  const c = ctx.site.contact;
  const t = ctx.t;
  return html`<ul class="contact-links ${cls}">
    <li><a href="https://www.instagram.com/${c.instagram}/" rel="noopener" target="_blank">${icon('instagram')}<span>Instagram</span></a></li>
    <li><a href="https://wa.me/${c.whatsapp}" rel="noopener" target="_blank">${icon('whatsapp')}<span>WhatsApp</span></a></li>
    <li><a href="viber://chat?number=%2B${c.viber}">${icon('viber')}<span>Viber</span></a></li>
    <li><a href="mailto:${c.email}">${icon('mail')}<span>${t('contact.email')}</span></a></li>
    <li><a href="${c.facebook}" rel="noopener" target="_blank">${icon('facebook')}<span>Facebook</span></a></li>
  </ul>`;
}

export function footer(ctx) {
  const { t } = ctx;
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
  <svg class="wave wave--top" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40V18c60-10 120-10 180 0s120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0V40Z"/></svg>
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      ${brand(ctx)}
      <p>${t('footer.tagline')}</p>
      ${contactLinks(ctx, 'contact-links--icons')}
    </div>
    <nav aria-label="${t('footer.links')}">
      <h2 class="site-footer__title">${t('footer.explore')}</h2>
      <ul class="site-footer__list">
        <li><a href="${ctx.url('menu')}">${t('nav.menu')}</a></li>
        <li><a href="${ctx.url('custom')}">${t('nav.custom')}</a></li>
        <li><a href="${ctx.url('recipes')}">${t('nav.recipes')}</a></li>
        <li><a href="${ctx.url('order')}">${t('nav.basket')}</a></li>
      </ul>
    </nav>
    <nav aria-label="${t('footer.info')}">
      <h2 class="site-footer__title">${t('footer.info')}</h2>
      <ul class="site-footer__list">
        <li><a href="${ctx.url('about')}">${t('nav.about')}</a></li>
        <li><a href="${ctx.url('contact')}">${t('nav.contact')}</a></li>
        <li><a href="${ctx.url('collab')}">${t('nav.collab')}</a></li>
        <li><a href="${ctx.url('privacy')}">${t('nav.privacy')}</a></li>
      </ul>
    </nav>
    <div>
      <h2 class="site-footer__title">${t('footer.where')}</h2>
      <p class="site-footer__where">${icon('pin')} ${t('footer.area')}</p>
      <p class="site-footer__where">${icon('clock')} ${t('footer.hours')}</p>
      ${langSwitch(ctx, 'lang-switch--footer')}
    </div>
  </div>
  <div class="container site-footer__bottom">
    <p>© ${year} ${ctx.site.name}. ${t('footer.rights')}</p>
    <p class="site-footer__cookies">${t('footer.cookies')} 🍪</p>
  </div>
</footer>`;
}
