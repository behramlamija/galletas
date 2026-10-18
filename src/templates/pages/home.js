import { html } from '../../../build/lib/html.js';
import { layout } from '../layout.js';
import { icon } from '../partials/icons.js';
import { productCard, sectionHead, wave } from '../partials/cards.js';
import { businessLd, personLd } from '../partials/seo.js';

export function visibleReviews(ctx) {
  // Sample reviews are only ever shown in development builds.
  return ctx.data.reviews.filter((r) => !(ctx.prod && r.placeholder));
}

export function filterChips(ctx, { scope, withAll = true }) {
  const { t, L, data } = ctx;
  return html`<div class="chips" role="group" aria-label="${t('menu.filterLabel')}" data-filter-chips="${scope}">
    ${withAll ? html`<button type="button" class="chip" data-filter="all" aria-pressed="true">${t('menu.all')}</button>` : ''}
    ${data.categories.map(
      (c) => html`<button type="button" class="chip" data-filter="${c.id}" aria-pressed="false">${icon(c.icon)}${L(c.name)}</button>`,
    )}
  </div>`;
}

function hero(ctx) {
  const { t, site, L } = ctx;
  const thumbs = site.heroThumbs.map((img) => ctx.data.products.find((p) => p.images.includes(img)));
  return html`<section class="hero" data-hero>
  <div class="hero__bg" aria-hidden="true">
    <span class="blob blob--pink"></span><span class="blob blob--pistachio"></span><span class="blob blob--butter"></span>
    <span class="sprinkles"></span>
  </div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow hero__eyebrow">${icon('chef')} ${site.owner.name} · ${t('hero.role')}</p>
      <h1 class="hero__title">${t('hero.titleA')} <em>${t('hero.titleEm')}</em> ${t('hero.titleB')}</h1>
      <p class="hero__lead">${t('hero.lead')}</p>
      <div class="hero__ctas">
        <a class="btn btn--cta btn--large" href="${ctx.url('menu')}">${icon('cake')}${t('hero.ctaOrder')}</a>
        <a class="btn btn--ghost btn--large" href="#iz-kuhinje">${t('hero.ctaMenu')}</a>
      </div>
      <ul class="trust">
        <li><a href="https://www.instagram.com/${site.contact.instagram}/" rel="noopener" target="_blank">${icon('instagram')}<strong>${site.stats.followers}</strong> ${t('hero.followers')}</a></li>
        <li>${icon('heart')}<strong>${site.stats.posts}</strong> ${t('hero.posts')}</li>
        <li>${icon('pin')}${t('hero.area')}</li>
      </ul>
    </div>
    <div class="hero__visual">
      <div class="hero__portrait">
        ${ctx.picture(site.owner.portrait, { alt: t('hero.portraitAlt', { name: site.owner.name }), sizes: '(min-width: 900px) 40vw, 80vw', eager: true })}
      </div>
      ${thumbs.map(
        (p, i) => html`<a class="float-card float-card--${i + 1}" href="${ctx.url('product', p.id)}">
          ${ctx.picture(site.heroThumbs[i], { alt: '', sizes: '120px', label: L(p.name) })}
          <span>${L(p.name)}</span>
        </a>`,
      )}
      <p class="signature" aria-hidden="true">— ${site.owner.name}, ${t('hero.roleLower')}</p>
    </div>
  </div>
</section>`;
}

function aboutShort(ctx) {
  const { t, site } = ctx;
  return html`<section class="section about-short" aria-labelledby="about-short-title">
  <div class="container about-short__grid">
    <div class="about-short__media reveal">
      ${ctx.picture(site.owner.portrait, { alt: t('about.portraitAlt', { name: site.owner.name }), sizes: '(min-width: 900px) 30vw, 70vw', cls: 'about-short__img' })}
      <span class="about-short__stamp" aria-hidden="true">
        <svg class="about-short__ring" viewBox="0 0 120 120">
          <defs><path id="stamp-ring" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs>
          <text><textPath href="#stamp-ring" textLength="282" lengthAdjust="spacing">${t('about.stamp')}</textPath></text>
        </svg>
        ${icon('cookie')}
      </span>
    </div>
    <div class="about-short__copy reveal">
      <p class="eyebrow">${t('about.eyebrow')}</p>
      <h2 class="section-title" id="about-short-title">${t('about.shortTitle')}</h2>
      <p>${t('about.short1')}</p>
      <p>${t('about.short2')}</p>
      <blockquote class="pull-quote">${icon('quote')}<p>${t('about.quote')}</p></blockquote>
      <a class="link-arrow" href="${ctx.url('about')}">${t('about.more')} ${icon('arrow')}</a>
    </div>
  </div>
</section>`;
}

function featured(ctx) {
  const { t, data } = ctx;
  const items = data.products.filter((p) => p.featured).sort((a, b) => a.rank - b.rank);
  return html`<section class="section featured" id="iz-kuhinje" aria-labelledby="featured-title">
  <div class="container">
    ${sectionHead(t('featured.eyebrow'), t('featured.title'), t('featured.lead'), { id: 'featured-title' })}
    ${filterChips(ctx, { scope: 'featured' })}
    <div class="grid grid--products" data-filter-list="featured">
      ${items.map((p) => productCard(ctx, p))}
    </div>
    <p class="empty-state" data-filter-empty="featured" hidden>${icon('cookie')} ${t('menu.empty')}</p>
    <div class="center-cta">
      <a class="btn btn--primary btn--large" href="${ctx.url('menu')}">${t('featured.all')} ${icon('arrow')}</a>
    </div>
  </div>
</section>`;
}

function howTo(ctx) {
  const { t, site } = ctx;
  const steps = [
    ['cake', 'choose'],
    ['whisk', 'customize'],
    ['whatsapp', 'send'],
    ['heart', 'confirm'],
  ];
  const lt = site.ordering.leadTimeDays;
  return html`<section class="section how" aria-labelledby="how-title">
  ${wave('wave--top wave--butter')}
  <div class="how__inner">
    <div class="container">
      ${sectionHead(t('how.eyebrow'), t('how.title'), t('how.lead'), { id: 'how-title' })}
      <ol class="steps">
        ${steps.map(
          ([ic, key], i) => html`<li class="step reveal">
            <span class="step__icon">${icon(ic)}</span>
            <span class="step__num">${i + 1}</span>
            <h3>${t(`how.${key}Title`)}</h3>
            <p>${t(`how.${key}Text`)}</p>
          </li>`,
        )}
      </ol>
      <div class="rules reveal">
        <h3 class="rules__title">${icon('calendar')} ${t('how.rulesTitle')}</h3>
        <ul>
          <li><strong>${t('how.days', { n: lt.torte })}</strong> ${t('how.ruleCakes')}</li>
          <li><strong>${t('how.days', { n: lt.kolaci })}</strong> ${t('how.rulePastries')}</li>
          <li><strong>${t('how.daysPlus', { n: lt.slavljenicke })}</strong> ${t('how.ruleCelebration')}</li>
        </ul>
      </div>
    </div>
  </div>
  ${wave('wave--bottom wave--butter')}
</section>`;
}

export function reviewsSection(ctx) {
  const { t, L, site } = ctx;
  const reviews = visibleReviews(ctx);
  if (!reviews.length) return '';
  return html`<section class="section reviews" aria-labelledby="reviews-title">
  <div class="container">
    <div class="reviews__head">
      ${sectionHead(t('reviews.eyebrow'), t('reviews.title'), '', { id: 'reviews-title', align: 'start' })}
      <div class="carousel-nav">
        <button type="button" class="icon-btn" data-carousel-prev aria-label="${t('reviews.prev')}">${icon('arrow-left')}</button>
        <button type="button" class="icon-btn" data-carousel-next aria-label="${t('reviews.next')}">${icon('arrow')}</button>
      </div>
    </div>
    <ul class="carousel" data-carousel tabindex="0" aria-label="${t('reviews.title')}">
      ${reviews.map(
        (r) => html`<li class="review-card"${r.placeholder ? html` data-sample-review` : ''}>
          ${r.placeholder ? html`<span class="review-card__sample">${t('reviews.sample')}</span>` : ''}
          <span class="stars" aria-label="${t('reviews.stars', { n: r.rating })}">${Array.from({ length: r.rating }, () => icon('star'))}</span>
          <blockquote><p>${L(r.text)}</p></blockquote>
          <p class="review-card__who"><strong>${r.name}</strong> · ${L(r.occasion)}</p>
        </li>`,
      )}
    </ul>
    <a class="link-arrow" href="https://www.instagram.com/${site.contact.instagram}/" rel="noopener" target="_blank">${t('reviews.more')} ${icon('arrow')}</a>
  </div>
</section>`;
}

function press(ctx) {
  const { t, site } = ctx;
  return html`<section class="press" aria-label="${t('press.label')}">
  <div class="container press__inner reveal">
    <p class="press__label">${t('press.label')}</p>
    <a class="press__item" href="${site.press.url}" rel="noopener" target="_blank">
      <span class="press__name">${site.press.name}</span>
      <span class="press__headline">„${t('press.headline')}“</span>
      <span class="press__read">${t('press.read')} ${icon('arrow')}</span>
    </a>
  </div>
</section>`;
}

function instagram(ctx) {
  const { t, site } = ctx;
  const handle = site.contact.instagram;
  return html`<section class="section insta" aria-labelledby="insta-title">
  <div class="container">
    ${sectionHead(`@${handle}`, t('insta.title'), t('insta.lead', { n: site.stats.followers }), { id: 'insta-title' })}
    <ul class="insta__grid">
      ${site.instagramImages.map(
        (img) => html`<li><a href="https://www.instagram.com/${handle}/" rel="noopener" target="_blank" aria-label="${t('insta.open')}">
          ${ctx.picture(img, { alt: '', sizes: '(min-width: 900px) 16vw, 33vw' })}
          <span class="insta__hover" aria-hidden="true">${icon('instagram')}</span>
        </a></li>`,
      )}
    </ul>
    <div class="center-cta">
      <a class="btn btn--primary" href="https://www.instagram.com/${handle}/" rel="noopener" target="_blank">${icon('instagram')}${t('insta.follow')}</a>
    </div>
  </div>
</section>`;
}

export function finalCta(ctx) {
  const { t } = ctx;
  return html`<section class="section final-cta">
  <div class="container">
    <div class="final-cta__card reveal">
      <span class="final-cta__deco" aria-hidden="true">${icon('cookie')}${icon('cake')}${icon('heart')}</span>
      <h2 class="section-title">${t('finalCta.title')}</h2>
      <p>${t('finalCta.text')}</p>
      <div class="final-cta__actions">
        <a class="btn btn--cta btn--large" href="${ctx.url('menu')}">${icon('cake')}${t('finalCta.order')}</a>
        <a class="btn btn--light btn--large" href="${ctx.url('custom')}">${icon('sparkle')}${t('finalCta.custom')}</a>
      </div>
    </div>
  </div>
</section>`;
}

export function home(ctx) {
  const { t } = ctx;
  const body = html`${hero(ctx)}${aboutShort(ctx)}${featured(ctx)}${howTo(ctx)}${reviewsSection(ctx)}${press(ctx)}${instagram(ctx)}${finalCta(ctx)}`;
  return layout(ctx, {
    title: t('seo.homeTitle'),
    description: t('seo.homeDescription'),
    body,
    pageClass: 'page-home',
    jsonld: [businessLd(ctx), { '@type': 'WebSite', name: ctx.site.name, url: ctx.absolute(ctx.url('home')), inLanguage: ctx.lang }, personLd(ctx)],
  });
}
