import { html, raw, jsonScript } from '../../build/lib/html.js';
import { header, orderBar } from './partials/header.js';
import { footer } from './partials/footer.js';
import { icon } from './partials/icons.js';

// Data the client scripts need: language, formatting, routes, contact channels and UI strings.
function clientData(ctx, extra = {}) {
  const { site } = ctx;
  return {
    lang: ctx.lang,
    locale: ctx.meta.locale,
    currency: ctx.meta.currency,
    defaultLang: site.defaultLang,
    langs: site.languages.map((l) => l.code),
    siteUrl: site.url,
    urls: {
      home: ctx.url('home'),
      menu: ctx.url('menu'),
      order: ctx.url('order'),
      custom: ctx.url('custom'),
    },
    contact: {
      whatsapp: site.contact.whatsapp,
      viber: site.contact.viber,
      email: site.contact.email,
      instagram: site.contact.instagram,
      phone: site.contact.phoneDisplay,
    },
    ordering: site.ordering,
    t: ctx.dicts[ctx.lang].js,
    // Order messages are always written in the owner's language (Bosnian).
    msg: (({ form, custom }) => ({
      occasions: form.occasions,
      sponges: custom.sponges,
      fillings: custom.fillingList,
      styles: custom.styles,
      colours: custom.colourNames,
      budgets: custom.budgets,
    }))(ctx.dicts.bs),
    ...extra,
  };
}

export function layout(ctx, { title, description, body, pageClass = '', jsonld = [], ogImage, ogType = 'website', client = {}, noindex = false }) {
  const { site, t, current } = ctx;
  const fullTitle = current.route === 'home' ? `${t('seo.homeTitle')} | ${site.name}` : `${title} | ${site.name}`;
  const canonical = current.route === '404' ? '' : ctx.absolute(ctx.url(current.route, current.slug));
  const alternates =
    current.route === '404'
      ? []
      : site.languages.map((l) => ({ hreflang: l.hreflang, href: ctx.absolute(ctx.url(current.route, current.slug, l.code)) }));
  const og = ctx.absolute(ogImage || ctx.imageUrl(site.owner.portrait));

  return html`<!doctype html>
<html lang="${ctx.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
${noindex || site.hideFromSearch ? html`<meta name="robots" content="noindex, nofollow">` : ''}
${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
${alternates.map((a) => html`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`)}
${alternates.length ? html`<link rel="alternate" hreflang="x-default" href="${ctx.absolute(ctx.url(current.route, current.slug, site.defaultLang))}">` : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="${ctx.meta.locale.replace('-', '_')}">
${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF6EF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1E130D" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${ctx.asset('favicon/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('favicon/icon-180.png')}">
<link rel="manifest" href="${ctx.base}/site.webmanifest">
${ctx.assets.fonts.map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`)}
<link rel="stylesheet" href="${ctx.assets.css}">
<script src="${ctx.assets.theme}"></script>
<script type="module" src="${ctx.assets.js}"></script>
</head>
<body class="${pageClass}" data-page="${current.route}">
<a class="skip-link" href="#main">${t('a11y.skip')}</a>
${header(ctx)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(ctx)}
${current.route === 'order' || current.route === '404' ? '' : orderBar(ctx)}
<div class="toasts" data-toasts role="status" aria-live="polite"></div>
<div class="cookie-note" data-cookie-note hidden>
  <span class="cookie-note__icon" aria-hidden="true">${icon('cookie')}</span>
  <p>${t('cookieNote.text')}</p>
  <button type="button" class="btn btn--small btn--primary" data-cookie-dismiss>${t('cookieNote.ok')}</button>
</div>
${jsonScript(clientData(ctx, client), 'type="application/json" id="app-data"')}
${jsonld.filter(Boolean).map((j) => jsonScript({ '@context': 'https://schema.org', ...j }, 'type="application/ld+json"'))}
</body>
</html>
`;
}

export { raw };
