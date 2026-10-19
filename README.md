# Eksplozija Slatkog — website

Static website for **Eksplozija Slatkog**, the cake and pastry business of pastry chef **Veldina Cokić** from Mostar.
Visitors browse the menu, customise a cake, and send a structured order via WhatsApp, Viber, Instagram DM or email —
no database, no backend.

- Plain **HTML, CSS and vanilla JavaScript** (no frameworks)
- **Node.js only for the build**: JSON data + template functions → static `dist/`
- Two languages: **Bosnian (`/bs/`, default)** and **English (`/en/`)**

Author: Lamija Behram

---

## Requirements

- Node.js **20+** (see `.nvmrc`)

## Scripts

```bash
npm install          # once
npm run dev          # http://localhost:5173 — rebuilds on change, live reload
npm run build        # development build into dist/
npm run build:prod   # minified, hashed assets, strict checks → dist/ is ready to deploy
npm run preview      # serve the existing dist/ (no rebuild)
npm run check        # translation completeness (bs/en)
npm run images       # pre-encode images into .cache/ (the build does this too)
```

`build:prod` fails if a translation is missing or if a sample review would be published.
Sample reviews (`"placeholder": true` in `src/data/reviews.json`) are shown in development only.

## Project structure

```
build/            build.mjs (main), dev.mjs (server), images.mjs (sharp), i18n-check.mjs, lib/
src/data/         site.json, products.json, recipes.json, categories.json, reviews.json, faq.json
src/i18n/         bs.json, en.json — UI strings and URL slugs ("routes")
src/templates/    layout.js, partials/, pages/ — template-literal functions that return HTML
src/css/          main.css (+ partials in @layer order)
src/js/           main.js (+ modules: basket, order, product, recipe, ui, fx, utils)
src/assets/       images/ (original photos), favicon/
dist/             build output (git-ignored)
```

## Everyday tasks

### Add or change a cake

1. Add an entry to `src/data/products.json` (copy an existing one). Every text field has `bs` and `en`.
   - `pricing.unit: "size"` → list of `options` with prices in KM
   - `pricing.unit: "quote"` → "price on request" (celebration cakes), with a `from` price
   - optional: `flavours`, `inscription: true`, `leadTimeDays`, `badges` (`bestseller`, `new`, `seasonal`, `nutfree`), `recipe`
2. Put the photo in `src/assets/images/` named `<product-id>-1.jpg` (`-2.jpg`, … for more photos) and list the
   names (without extension) in `images`. Use photos at least **1200 px** wide — the build creates AVIF/WebP/JPEG sizes.
3. `npm run build:prod`.

A product without a photo automatically gets a soft branded placeholder.

### Add a recipe

Add an entry to `src/data/recipes.json` with `product` pointing at the product id, and set `"recipe": "<id>"` on that
product. Quantities are numbers (`qty`) + a unit (`g`, `ml`, `pcs`, `tbsp`, `tsp`, `pkg`, `pinch`) so the servings
scaler can recalculate them. To hide a recipe, delete its entry and set the product's `recipe` to `null`.

### Change contact details, lead times, delivery fee

Everything is in `src/data/site.json`:
`contact` (WhatsApp/Viber number in international format without `+`, email, Instagram handle),
`ordering.leadTimeDays` (per category), `ordering.closedDays` (0 = Sunday), `ordering.timeSlots`,
`ordering.deliveryFeeMostar`, `hours`, `press.url`, and `url` (the final domain — used for canonical URLs and the sitemap).

### Demo mode / search engines

`"hideFromSearch": true` in `site.json` adds `noindex, nofollow` to every page and an `X-Robots-Tag` header,
and leaves the sitemap out of `robots.txt`. Set it to `false` when the site goes public.

### Add a language

1. Copy `src/i18n/en.json` to `src/i18n/xx.json` and translate it (including `routes`).
2. Add the `xx` text to every `{ "bs": …, "en": … }` field in `src/data/*.json`.
3. Add the language to `site.json → languages`.
4. `npm run check` lists anything missing.

## How ordering works (no backend)

The order page builds a readable message (always in Bosnian, for the owner) and hands it to the channel the customer picks:

| Channel | How |
|---|---|
| WhatsApp | `wa.me/<number>?text=…` (pre-filled) |
| Viber | message copied + `viber://forward` on phones |
| Instagram | message copied to clipboard, then `ig.me/m/<handle>` opens the DM (Instagram can't pre-fill) |
| Email | `mailto:` with subject and body |

The customer sees and can edit the message before sending. The basket lives in `localStorage` only.

### Optional: "send directly" via a form service

Set `ordering.formEndpoint` in `site.json` to a Formspree / Web3Forms endpoint URL. An extra **"Send directly"** button
appears and posts the order as JSON. The CSP in `dist/_headers` automatically allows that origin.

## Deploy

`dist/` is a plain static folder. After `npm run build:prod`:

- **Cloudflare (Workers)**: connect the GitHub repo, build command `npm run build:prod`, deploy command
  `npx wrangler deploy`. Settings live in `wrangler.jsonc` (serves `dist/`, `404.html` for unknown URLs).
  Add your domain under *Settings → Domains & Routes → Custom domain*, then set `url` in `site.json`.
- **Netlify / Cloudflare Pages**: build command `npm run build:prod`, publish directory `dist`.
- `_headers` (security headers, caching) is picked up automatically on Cloudflare and Netlify.
  The root `/` chooses the language itself (saved choice → browser language → Bosnian).
- **GitHub Pages**: publish `dist/`. If the site lives under a sub-path (e.g. `/repo-name`), set `basePath` in `site.json`.
- **Any web host (cPanel, FTP)**: upload the contents of `dist/`. Set the headers from `dist/_headers` in the
  server config if possible; `404.html` should be configured as the error page.

## Privacy & performance notes

- No tracking, analytics, third-party scripts or font CDNs. Fonts are self-hosted from `@fontsource` packages.
- The Google map on the contact page loads only after a click.
- Animations respect `prefers-reduced-motion`.
