// Schema.org JSON-LD builders.

export function businessLd(ctx) {
  const { site } = ctx;
  return {
    '@type': 'Bakery',
    '@id': `${site.url}/#business`,
    name: site.name,
    url: ctx.absolute(ctx.url('home')),
    image: ctx.absolute(ctx.imageUrl('pistacija-malina-torta-1')),
    logo: ctx.absolute(ctx.asset('favicon/icon-512.png')),
    telephone: site.contact.phoneDisplay,
    email: site.contact.email,
    priceRange: '$$',
    servesCuisine: ctx.t('seo.cuisine'),
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: site.country },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: { '@type': 'City', name: site.city },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: site.hours.open,
      closes: site.hours.close,
    },
    founder: personLd(ctx),
    sameAs: [`https://www.instagram.com/${site.contact.instagram}/`, site.contact.facebook],
  };
}

export function personLd(ctx) {
  const { site } = ctx;
  return {
    '@type': 'Person',
    name: site.owner.name,
    jobTitle: ctx.t('about.jobTitle'),
    image: ctx.absolute(ctx.imageUrl(site.owner.portrait)),
    sameAs: [`https://www.instagram.com/${site.contact.instagram}/`],
    worksFor: { '@id': `${site.url}/#business` },
  };
}

export function breadcrumbLd(ctx, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: ctx.absolute(it.url) })),
  };
}

export function productLd(ctx, p) {
  const { L } = ctx;
  const offers =
    p.pricing.unit === 'quote'
      ? { '@type': 'Offer', priceCurrency: 'BAM', price: p.pricing.from, availability: 'https://schema.org/PreOrder', description: ctx.t('product.priceOnRequest') }
      : {
          '@type': 'AggregateOffer',
          priceCurrency: 'BAM',
          lowPrice: Math.min(...p.pricing.options.map((o) => o.price)),
          highPrice: Math.max(...p.pricing.options.map((o) => o.price)),
          offerCount: p.pricing.options.length,
          availability: 'https://schema.org/PreOrder',
        };
  return {
    '@type': 'Product',
    name: L(p.name),
    description: L(p.description),
    image: p.images.map((i) => ctx.absolute(ctx.imageUrl(i))),
    brand: { '@type': 'Brand', name: ctx.site.name },
    category: L(ctx.category(p.category).name),
    offers: { ...offers, url: ctx.absolute(ctx.url('product', p.id)), seller: { '@id': `${ctx.site.url}/#business` } },
  };
}

const iso = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h || m ? `PT${h ? h + 'H' : ''}${m ? m + 'M' : ''}` : 'PT0M';
};

export function recipeLd(ctx, r, product) {
  const { L } = ctx;
  return {
    '@type': 'Recipe',
    name: L(r.title),
    description: L(r.intro),
    image: product.images.map((i) => ctx.absolute(ctx.imageUrl(i))),
    author: { '@type': 'Person', name: ctx.site.owner.name },
    prepTime: iso(r.prepMinutes),
    cookTime: iso(r.bakeMinutes),
    totalTime: iso(r.prepMinutes + r.bakeMinutes + r.restMinutes),
    recipeYield: `${r.servings} ${L(r.servingsUnit)}`,
    recipeCategory: L(ctx.category(r.category).name),
    recipeCuisine: ctx.t('seo.cuisine'),
    recipeIngredient: r.groups.flatMap((g) => g.items.map((i) => `${i.qty} ${ctx.t(`units.${i.unit}`)} ${L(i.name)}`)),
    recipeInstructions: r.steps.map((s) => ({ '@type': 'HowToStep', text: L(s) })),
  };
}

export function faqLd(ctx) {
  return {
    '@type': 'FAQPage',
    mainEntity: ctx.data.faq.map((f) => ({
      '@type': 'Question',
      name: ctx.L(f.q),
      acceptedAnswer: { '@type': 'Answer', text: ctx.L(f.a) },
    })),
  };
}
