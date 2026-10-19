// About, contact, collaborations, privacy, 404 and the root language redirect.
import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon, logoMark } from '../partials/icons.js';
import { sectionHead, breadcrumbs } from '../partials/cards.js';
import { contactLinks } from '../partials/footer.js';
import { breadcrumbLd, faqLd, personLd, businessLd } from '../partials/seo.js';
import { pageHero } from './menu.js';
import { reviewsSection, finalCta } from './home.js';

const crumbsFor = (ctx, route, name) => [
  { name: ctx.t('nav.home'), url: ctx.url('home') },
  { name, url: ctx.url(route) },
];

export function about(ctx) {
  const { t, site } = ctx;
  const crumbs = crumbsFor(ctx, 'about', t('nav.about'));
  const timeline = t('about.timeline');
  const values = ['fresh', 'handmade', 'personal'];
  const body = html`${pageHero(ctx, { eyebrow: t('about.eyebrow'), title: t('about.title'), lead: t('about.lead'), crumbs })}
<section class="section section--tight about">
  <div class="container about__grid">
    <div class="about__media reveal">
      ${ctx.picture(site.owner.portrait, { alt: t('about.portraitAlt', { name: site.owner.name }), sizes: '(min-width: 900px) 40vw, 90vw', eager: true })}
      <p class="signature">${site.owner.name}</p>
    </div>
    <div class="about__copy prose">
      <p class="lead-text">${t('about.p1')}</p>
      <p>${t('about.p2')}</p>
      <p>${t('about.p3')}</p>
      <blockquote class="pull-quote pull-quote--big">${icon('quote')}<p>${t('about.quote')}</p><cite>- ${site.owner.name}, ${site.press.name}</cite></blockquote>
      <p>${t('about.p4')}</p>
    </div>
  </div>
</section>
<section class="section values" aria-labelledby="values-title">
  <div class="container">
    ${sectionHead(t('about.valuesEyebrow'), t('about.valuesTitle'), '', { id: 'values-title' })}
    <ul class="values__grid">
      ${values.map(
        (v, i) => html`<li class="value reveal">
          <span class="value__icon">${icon(['leaf', 'whisk', 'heart'][i])}</span>
          <h3>${t(`about.values.${v}.title`)}</h3>
          <p>${t(`about.values.${v}.text`)}</p>
        </li>`,
      )}
    </ul>
  </div>
</section>
<section class="section timeline-section" aria-labelledby="timeline-title">
  <div class="container container--narrow">
    ${sectionHead(t('about.timelineEyebrow'), t('about.timelineTitle'), '', { id: 'timeline-title' })}
    <ol class="timeline">
      ${Object.values(timeline).map(
        (item) => html`<li class="timeline__item reveal"><span class="timeline__year">${item.year}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></li>`,
      )}
    </ol>
  </div>
</section>
${reviewsSection(ctx)}
<section class="section">
  <div class="container">
    <aside class="promo reveal">
      <span class="promo__icon" aria-hidden="true">${icon('sparkle')}</span>
      <div><h2 class="promo__title">${t('collab.promoTitle')}</h2><p>${t('collab.promoText')}</p></div>
      <a class="btn btn--primary" href="${ctx.url('collab')}">${t('collab.promoCta')} ${icon('arrow')}</a>
    </aside>
  </div>
</section>
${finalCta(ctx)}`;
  return layout(ctx, {
    title: t('about.title'),
    description: t('seo.aboutDescription'),
    body,
    pageClass: 'page-about',
    ogType: 'profile',
    jsonld: [personLd(ctx), breadcrumbLd(ctx, crumbs)],
  });
}

export function contact(ctx) {
  const { t, L, site, data } = ctx;
  const crumbs = crumbsFor(ctx, 'contact', t('nav.contact'));
  const c = site.contact;
  const mapQuery = encodeURIComponent(`${site.city}, Bosnia and Herzegovina`);
  const body = html`${pageHero(ctx, { eyebrow: t('contact.eyebrow'), title: t('contact.title'), lead: t('contact.lead'), crumbs })}
<section class="section section--tight contact">
  <div class="container contact__grid">
    <div class="contact__cards">
      <a class="contact-card contact-card--instagram reveal" href="https://www.instagram.com/${c.instagram}/" rel="noopener" target="_blank">
        ${icon('instagram')}<span><strong>Instagram</strong>@${c.instagram}<small>${t('contact.instagramNote')}</small></span>
      </a>
      <a class="contact-card contact-card--whatsapp reveal" href="https://wa.me/${c.whatsapp}" rel="noopener">
        ${icon('whatsapp')}<span><strong>WhatsApp</strong>${c.phoneDisplay}<small>${t('contact.whatsappNote')}</small></span>
      </a>
      <a class="contact-card contact-card--viber reveal" href="viber://chat?number=%2B${c.viber}">
        ${icon('viber')}<span><strong>Viber</strong>${c.phoneDisplay}</span>
      </a>
      <a class="contact-card reveal" href="tel:+${c.whatsapp}">
        ${icon('phone')}<span><strong>${t('contact.phone')}</strong>${c.phoneDisplay}</span>
      </a>
      <a class="contact-card reveal" href="mailto:${c.email}">
        ${icon('mail')}<span><strong>${t('contact.email')}</strong>${c.email}</span>
      </a>
      <a class="contact-card reveal" href="${c.facebook}" rel="noopener" target="_blank">
        ${icon('facebook')}<span><strong>Facebook</strong>eksplozija_slatkog</span>
      </a>
    </div>
    <div class="contact__side">
      <div class="card hours-card">
        <h2 class="h3">${icon('clock')} ${t('contact.hoursTitle')}</h2>
        <p>${t('contact.hours', { open: site.hours.open, close: site.hours.close })}</p>
        <p class="muted">${t('contact.hoursNote')}</p>
        <h2 class="h3">${icon('pin')} ${t('contact.areaTitle')}</h2>
        <p>${t('contact.area')}</p>
      </div>
      <div class="map" data-map>
        <div class="map__placeholder">
          <span class="map__pin" aria-hidden="true">${icon('pin')}</span>
          <p><strong>${site.city}</strong>, ${t('contact.country')}</p>
          <button type="button" class="btn btn--small btn--primary" data-map-load data-src="https://maps.google.com/maps?q=${mapQuery}&amp;z=13&amp;output=embed">${t('contact.loadMap')}</button>
          <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" rel="noopener" target="_blank">${t('contact.openMaps')} ${icon('arrow')}</a>
          <p class="hint">${t('contact.mapNote')}</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    ${sectionHead(t('contact.faqEyebrow'), t('contact.faqTitle'), '', { id: 'faq-title' })}
    <div class="faq__list">
      ${data.faq.map(
        (f) => html`<details class="faq__item reveal">
          <summary>${L(f.q)}<span class="faq__icon" aria-hidden="true">${icon('plus')}</span></summary>
          <div class="faq__answer"><p>${L(f.a)}</p></div>
        </details>`,
      )}
    </div>
  </div>
</section>`;
  return layout(ctx, {
    title: t('contact.title'),
    description: t('seo.contactDescription'),
    body,
    pageClass: 'page-contact',
    jsonld: [businessLd(ctx), faqLd(ctx), breadcrumbLd(ctx, crumbs)],
  });
}

export function collab(ctx) {
  const { t, site } = ctx;
  const crumbs = crumbsFor(ctx, 'collab', t('nav.collab'));
  const types = ['recipes', 'reels', 'reviews', 'events'];
  const icons = { recipes: 'rolling', reels: 'sparkle', reviews: 'star', events: 'party' };
  const body = html`${pageHero(ctx, { eyebrow: t('collab.eyebrow'), title: t('collab.title'), lead: t('collab.lead'), crumbs })}
<section class="section section--tight collab">
  <div class="container">
    <ul class="stats reveal">
      <li><strong>${site.stats.followers}</strong><span>${t('collab.followers')}</span></li>
      <li><strong>${site.stats.posts}</strong><span>${t('collab.posts')}</span></li>
      <li><strong>${t('collab.audienceValue')}</strong><span>${t('collab.audience')}</span></li>
    </ul>
    <p class="hint center">${t('collab.statsNote')}</p>
    <ul class="values__grid values__grid--four">
      ${types.map(
        (k) => html`<li class="value reveal"><span class="value__icon">${icon(icons[k])}</span><h3>${t(`collab.types.${k}.title`)}</h3><p>${t(`collab.types.${k}.text`)}</p></li>`,
      )}
    </ul>
    <div class="final-cta__card reveal">
      <h2 class="section-title">${t('collab.ctaTitle')}</h2>
      <p>${t('collab.ctaText')}</p>
      <div class="final-cta__actions">
        <a class="btn btn--cta btn--large" href="mailto:${site.contact.email}?subject=${encodeURIComponent(t('collab.mailSubject'))}">${icon('mail')}${t('collab.ctaEmail')}</a>
        <a class="btn btn--light btn--large" href="https://ig.me/m/${site.contact.instagram}" rel="noopener" target="_blank">${icon('instagram')}${t('collab.ctaDm')}</a>
      </div>
    </div>
  </div>
</section>`;
  return layout(ctx, {
    title: t('collab.title'),
    description: t('seo.collabDescription'),
    body,
    pageClass: 'page-collab',
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}

export function privacy(ctx) {
  const { t } = ctx;
  const crumbs = crumbsFor(ctx, 'privacy', t('nav.privacy'));
  const sections = t('privacy.sections');
  const body = html`${pageHero(ctx, { title: t('privacy.title'), lead: t('privacy.lead'), crumbs, cls: 'page-hero--compact' })}
<section class="section section--tight">
  <div class="container container--narrow prose">
    ${Object.values(sections).map((s) => html`<h2 class="h3">${s.title}</h2><p>${s.text}</p>`)}
    <p class="muted">${t('privacy.updated')}</p>
  </div>
</section>`;
  return layout(ctx, {
    title: t('privacy.title'),
    description: t('privacy.lead'),
    body,
    pageClass: 'page-privacy',
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}

export function notFound(ctx, contexts) {
  const body = html`<section class="section not-found">
  <div class="container not-found__inner">
    <div class="eaten-cookie" aria-hidden="true">
      ${logoMark('eaten-cookie__mark')}
      <i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
    ${Object.values(contexts).map(
      (c) => html`<div class="not-found__lang" lang="${c.lang}">
        <h1 class="page-title">${c.t('notFound.title')}</h1>
        <p>${c.t('notFound.text')}</p>
        <p class="not-found__actions">
          <a class="btn btn--cta" href="${c.url('home')}">${c.t('notFound.home')}</a>
          <a class="btn btn--ghost" href="${c.url('menu')}">${c.t('notFound.menu')}</a>
        </p>
      </div>`,
    )}
  </div>
</section>`;
  return layout(ctx, { title: ctx.t('notFound.title'), description: ctx.t('notFound.text'), body, pageClass: 'page-404', noindex: true });
}

export function root(ctx, contexts) {
  const { site } = ctx;
  const target = ctx.url('home');
  return html`<!doctype html>
<html lang="${site.defaultLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${site.name}</title>
<meta name="description" content="${ctx.t('seo.homeDescription')}">
<link rel="canonical" href="${ctx.absolute(target)}">
${Object.values(contexts).map((c) => html`<link rel="alternate" hreflang="${c.meta.hreflang}" href="${ctx.absolute(c.url('home'))}">`)}
<link rel="alternate" hreflang="x-default" href="${ctx.absolute(target)}">
<link rel="icon" href="${ctx.asset('favicon/favicon.svg')}" type="image/svg+xml">
<meta name="robots" content="noindex">
<script src="${ctx.asset('lang-redirect.js')}" data-base="${ctx.base}" data-default="${site.defaultLang}" data-langs="${site.languages.map((l) => l.code).join(',')}"></script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head>
<body>
<p><a href="${target}">${site.name}</a> · ${Object.values(contexts).map((c) => html`<a href="${c.url('home')}" hreflang="${c.meta.hreflang}">${c.meta.name}</a> `)}</p>
</body>
</html>
`;
}
