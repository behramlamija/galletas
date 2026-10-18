// Compact product data for the client scripts (basket, order form, product options).
// Bosnian labels are always included because order messages are sent in Bosnian.
export function catalogEntry(ctx, p) {
  const { L } = ctx;
  return {
    id: p.id,
    name: L(p.name),
    nameBs: p.name.bs,
    cat: p.category,
    img: ctx.thumbUrl(p.images[0]),
    url: ctx.url('product', p.id),
    quote: p.pricing.unit === 'quote',
    from: ctx.priceFrom(p),
    lead: ctx.leadTime(p),
    inscription: !!p.inscription,
    options: p.pricing.unit === 'quote' ? [] : p.pricing.options.map((o) => ({ id: o.id, label: L(o.label), labelBs: o.label.bs, price: o.price })),
    flavours: (p.flavours || []).map((f) => ({ id: f.id, label: L(f.label), labelBs: f.label.bs })),
  };
}

export function catalog(ctx, products = ctx.data.products) {
  return products.map((p) => catalogEntry(ctx, p));
}
