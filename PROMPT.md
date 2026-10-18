# Project Brief: "Eksplozija Slatkog" — Cake Ordering Website

> Master prompt / specification for building the official website of **Eksplozija Slatkog**, the home cake and pastry business of **Veldina Cokić** from Mostar, Bosnia and Herzegovina.
>
> Project owner and sole collaborator: **Lamija Behram**.

---

## 0. Ground Rules (read first)

1. **Authorship.** The only author, collaborator and contributor on this project is **Lamija Behram**. Do not add any other name, tool name, generator tag, "made with", "built by", "powered by" or similar credit anywhere: not in the HTML, `<meta name="generator">`, comments, README, `package.json`, the footer, commit messages, licence files or anywhere else. The footer credit, if there is one, is the business itself (© Eksplozija Slatkog). `package.json` `author` is `"Lamija Behram"`.
2. **No frameworks.** Use plain **HTML5, CSS3 and vanilla JavaScript (ES modules)**. No React, Vue, Svelte, Astro, Next, Tailwind, Bootstrap or jQuery.
3. **No database, no backend.** The site is fully static. All content (cakes, recipes, translations) lives in versioned JSON files in the repo. Orders are sent through messaging channels (see §8), not stored on a server.
4. **Node.js is only for the build.** Node runs a small custom build script that turns the source (templates + JSON) into a static `dist/` folder ready for any static host (Netlify, Vercel static, GitHub Pages, Cloudflare Pages, cPanel hosting).
5. **Two languages from day one:** **Bosnian (`bs`, default)** and **English (`en`)**. More languages later must be easy to add.
6. **Orders come first.** Every design decision serves one goal: make it as quick and easy as possible to go from "I like that cake" to "my order is sent".
7. **Sweet but professional.** Playful "cookie" touches and animations, but the overall feel must stay polished and credible. The owner has 101K Instagram followers and a strong personal brand, so this must not look like a toy or a template.
8. **Invented content is clearly marked.** Prices, phone numbers, recipes and other details not known yet are invented placeholders. Keep them in the JSON data files, tag them with `"placeholder": true` where relevant, and list them in `CONTENT-TODO.md` so the owner can replace them before launch.

---

## 1. About the Business (known facts)

Taken from the business's public Instagram profile:

| Field | Value |
|---|---|
| Brand name | **Eksplozija Slatkog** ("Explosion of Sweetness") |
| Instagram | [@eksplozija_slatkog](https://www.instagram.com/eksplozija_slatkog/) — ~101K followers, 1,600+ posts |
| Facebook | `eksplozija_slatkog` (facebook.com/eksplozija_slatkog…) |
| Owner / pastry chef | **Veldina Cokić** |
| Background | Law graduate (Dipl. iur.) who turned her passion for baking into a business; also a food blogger and content creator |
| Location | **Mostar**, Bosnia and Herzegovina |
| What she sells | **Torte i kolači**: celebration cakes, layered cream cakes, traditional Bosnian/Balkan pastries, mini desserts |
| Instagram highlights | "Recenzije" (Reviews), "O meni" (About me), "Torte & Kolači" (Cakes & Pastries) |
| Collaborations | "DM for collab": open to brand partnerships |
| Press | Featured on **Pogled.ba**: *"Pravnica koja se bavi prodajom torti i kolača"* ("The lawyer who sells cakes and pastries"). Her quote from the piece: *"Nije to samo posao, to je ljubav koja spaja"* ("It's not just a job, it's love that brings people together") |

### Story angle for the hero / About section
A law graduate who chose a different path: baking. Every cake is handmade in Mostar with real ingredients and a lot of love. The brand grew organically on Instagram to 100K+ followers through honest, appetizing photos and videos. The website builds on that trust and turns it into a smooth ordering experience.

### Privacy note
The Instagram profile includes family photos, including a young child. **Do not use photos of the child or family on the website.** Only use the owner's own portrait and product photos. Leave family names out of the site copy (the owner can add them later if she wants).

---

## 2. Target Audience

- **Local customers in Mostar and the surrounding area** ordering cakes for birthdays, christenings, baby showers, weddings, engagements, Bajram, Christmas, New Year and other celebrations.
- **Mostly mobile users arriving from Instagram** (link in bio, story links). Design **mobile-first**: most visitors will be on a phone, with one thumb, inside the Instagram in-app browser.
- **Diaspora** (Germany, Austria, Switzerland, Sweden, USA) who order cakes for family back home. This is why English matters.
- **Brands and partners** looking for collaborations.
- **Home bakers / fans** who follow her for recipes.

---

## 3. Goals and Success Criteria

1. Turn Instagram DMs into **structured orders** (product, size, flavour, date, pickup/delivery, contact) so there's less back-and-forth.
2. Show the **pastry chef as the face of the brand**, right at the top.
3. Show off her **work** in a beautiful, fast gallery and catalogue.
4. Provide **recipes** for the showcased items (fan engagement + SEO).
5. Stay **lightweight**: Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO on mobile.
6. Be **easy to maintain**: adding a new cake means adding one JSON entry plus a photo, then running `npm run build`.

---

## 4. Sitemap

Generated statically for each language (`/bs/...` and `/en/...`; the root `/` redirects to `/bs/` or to the browser language if it is English):

```
/                          → language redirect (bs default)
/{lang}/                   → Home (one-page flow: hero, about, featured, how to order, reviews, press, CTA)
/{lang}/ponuda|menu/       → Full catalogue with category filters
/{lang}/proizvod/{slug}/   → Product detail page (photos, description, sizes, flavours, add to order, link to recipe)
/{lang}/recepti|recipes/   → Recipe index
/{lang}/recept/{slug}/     → Recipe detail page
/{lang}/narudzba|order/    → Order basket + order form + send options
/{lang}/torta-po-zelji|custom-cake/ → Custom cake request
/{lang}/o-meni|about/      → Extended "About Veldina" page
/{lang}/kontakt|contact/   → Contact, map, working hours, FAQ
/{lang}/saradnja|collaborations/ → Brand collaboration info (short page)
/404.html                  → Bilingual, cookie-themed 404 ("Someone ate this page 🍪")
```

URL slugs are localized per language (configured in the i18n JSON). Every page has a language switcher that links to **the same page** in the other language.

---

## 5. Page-by-Page Specification

### 5.1 Header (all pages)
- Logo: a text wordmark **"Eksplozija Slatkog"** in the display font, with a small hand-drawn cookie/whisk SVG icon. Make it an inline SVG so it's easy to replace with a real logo later.
- Navigation: Home · Ponuda/Menu · Recepti/Recipes · O meni/About · Kontakt/Contact.
- Right side: **language switch (BS | EN)** and a **basket button** with an item count badge. The badge does a little "cookie bounce" when an item is added.
- Sticky, slim on scroll, with a translucent cream background (`backdrop-filter`).
- Mobile: hamburger menu → full-screen sheet that slides down, plus a **persistent bottom "Naruči / Order" bar** (thumb-reachable) once the user scrolls past the hero.

### 5.2 Hero: the pastry chef on top
- Two-column on desktop (stacked on mobile):
  - **Left / top:** headline, sub-headline, two CTAs.
    - BS: **"Torte i kolači s ljubavlju iz Mostara"**, sub: "Ručno rađeno, od pravih sastojaka — za vaše najslađe trenutke." CTAs: **"Naruči tortu"** (primary) / **"Pogledaj ponudu"** (secondary).
    - EN: **"Cakes & pastries made with love in Mostar"**, sub: "Handmade from real ingredients — for your sweetest moments." CTAs: **"Order a cake"** / **"See the menu"**.
  - **Right / bottom:** the portrait of **Veldina** (photo at sunset in the mountains above Mostar), cut into a soft "blob"/cookie shape with a subtle wavy edge. Around it float 3–4 small product thumbnails (pistachio-raspberry cake, "breskvice", pink birthday cake) in rounded cards that drift gently (parallax on desktop, static on mobile).
- Trust strip under the CTAs: **"101K+ pratilaca na Instagramu"** · **"1.600+ objava"** · **"Mostar i okolina"** · small Instagram icon link.
- Background: warm cream with a very subtle grain texture and a few soft, blurred pastel shapes.
- A small signature line: *"— Veldina Cokić, poslastičarka"* rendered in the script font.

### 5.3 About (short, on Home) + full About page
- Short version on Home: 3–4 sentences + portrait + "Više o meni / More about me" link.
- Full page: her story (law degree → baking), philosophy (fresh ingredients, no shortcuts, every order is personal), a pull-quote from the Pogled.ba feature, a short timeline (invented placeholder years: started baking at home → first Instagram posts → 10K → 50K → 100K followers → website launch), and a "Saradnja / Collaborations" CTA for brands.

**Draft copy (BS):**
> Ja sam Veldina — diplomirana pravnica koja je svoju najveću ljubav pronašla u kuhinji. Ono što je počelo kao hobi i nekoliko fotografija na Instagramu preraslo je u Eksploziju slatkog: male radionice slatkih trenutaka u srcu Mostara. Svaka torta nastaje ručno, od svježih sastojaka i s istom pažnjom kao da je pravim za svoju porodicu. Jer kako uvijek kažem — nije to samo posao, to je ljubav koja spaja.

**Draft copy (EN):**
> I'm Veldina — a law graduate who found her true passion in the kitchen. What started as a hobby and a few photos on Instagram grew into Eksplozija Slatkog: a small workshop of sweet moments in the heart of Mostar. Every cake is handmade from fresh ingredients, with the same care I'd put into baking for my own family. Because, as I always say, it's not just a job — it's love that brings people together.

### 5.4 Featured work / gallery (Home)
- Heading: **"Iz moje kuhinje" / "From my kitchen"**.
- A masonry-style grid (CSS `columns` or CSS grid with `grid-auto-rows` + spans) of 8–12 featured items, each a card with photo, name, "from X KM" price and an **"+ Dodaj" / "+ Add"** quick button.
- Hover (desktop): the photo zooms slightly and a "bite mark" mask animates into the card corner (see §10). Tap (mobile): opens the product page.
- Filter chips above the grid: **Sve / All · Torte / Cakes · Kolači / Pastries · Mini deserti / Mini desserts · Slavljeničke / Celebration**.
- An "Otvori cijelu ponudu / View full menu" button below.
- An optional lightbox for viewing photos full screen (keyboard + swipe support).

### 5.5 How ordering works (Home)
Four illustrated steps with small animated SVG icons:
1. **Odaberi / Choose**: pick a cake or pastry from the menu (or request a custom cake).
2. **Prilagodi / Customize**: size, flavour, inscription, date.
3. **Pošalji / Send**: send your order via WhatsApp, Viber, Instagram or email with one tap.
4. **Potvrda / Confirmation**: Veldina confirms availability and price, usually within 24 hours.

Below the steps, show the key rules clearly: **order at least 3 days in advance for cakes, 2 days for pastries; 7+ days for tiered or wedding cakes** (placeholder values, configurable in `site.json`).

### 5.6 Reviews (Home)
- Heading: **"Vaše riječi" / "Kind words"**, a horizontal scroll-snap carousel of review cards (name, occasion, short text, 5 stars).
- **IMPORTANT:** use clearly labelled sample text during development (e.g. `"text": "[SAMPLE] ..."` and `"placeholder": true` in the data). **Placeholder reviews must never ship as if they were real.** The build script **fails in production mode** (`npm run build -- --prod`) if any review still has `placeholder: true`, and fake reviews are hidden in production until real ones (e.g. taken from her "Recenzije" Instagram highlight, with the customers' permission) are added.
- A link: "Više recenzija na Instagramu / More reviews on Instagram".

### 5.7 Press (Home)
- A slim band: "Pisali su o nama / As seen on", with the **Pogled.ba** name/wordmark (as text, not their logo file), the headline and a link to the article (URL placeholder in `site.json`).

### 5.8 Instagram band (Home)
- "Pratite nas na Instagramu / Follow along on Instagram", with 6 static images (no Instagram API / embed scripts, for speed and privacy), a follow button and the handle **@eksplozija_slatkog**.

### 5.9 Final CTA (Home)
- A big warm card: "Imate posebnu priliku? / Got a special occasion?" with buttons **"Naruči sada / Order now"** and **"Torta po želji / Custom cake"**.

### 5.10 Menu / Catalogue page
- Category filters (chips) + text search + sort (popular / price).
- Product cards: photo, name, short description, badges (`Bestseller`, `Novo/New`, `Sezonsko/Seasonal`, `Bez orašastih/Nut-free` where applicable), "od/from" price, "+" button.
- Filter state goes in the URL hash (`#kategorija=torte`) so it's shareable.
- Empty state for search: an animated cookie with crumbs and the text "Nismo pronašli taj kolačić…"

### 5.11 Product detail page
- Image gallery (main + thumbnails, swipe on mobile).
- Name, description, ingredients/allergens list, available **sizes** (e.g. cakes: 12 / 20 / 30 people or by kg; pastries: ½ tray, full tray, by kg; mini desserts: 6 / 12 / 24 pcs), **flavour options** where relevant, an optional **inscription** text field (cakes), and a live price estimate.
- Quantity stepper, **"Dodaj u narudžbu / Add to order"** (primary) and **"Naruči odmah putem WhatsAppa / Order now on WhatsApp"** (secondary, sends just this item).
- "Pogledaj recept / See the recipe" link (if a recipe exists).
- "Možda vam se svidi / You may also like": 3 related items.
- JSON-LD `Product` + `Offer` (price in BAM).

### 5.12 Order page (the most important page)
**Layout:** basket on top (or on the right on desktop), form below (or on the left), sticky summary on desktop.

**Basket:**
- Line items with thumbnail, name, chosen size/flavour/inscription, quantity stepper, line price, and remove (with an "Undo" toast).
- Subtotal, "Konačnu cijenu potvrđuje poslastičarka / Final price confirmed by the pastry chef" note, plus the delivery fee rule (placeholder: free pickup; delivery within Mostar 5 KM; outside Mostar on request).
- Saved in `localStorage` (wrapped in try/catch; works without it too). The basket survives page reloads and language switches.

**Order form fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| Ime i prezime / Full name | text | ✔ | |
| Telefon / Phone | tel | ✔ | format hint `+387 6x xxx xxx`; validate loosely |
| Email | email | — | |
| Datum preuzimanja / Pickup or delivery date | date | ✔ | `min` is computed from the lead time of the slowest item in the basket; Sundays (configurable) disabled with a message |
| Vrijeme / Time | select | ✔ | time slots from `site.json` |
| Preuzimanje / Fulfilment | radio | ✔ | Lično preuzimanje / Pickup · Dostava (Mostar) / Delivery |
| Adresa / Address | text | if delivery | shown only when delivery is chosen |
| Prilika / Occasion | select | — | Rođendan, Krštenje/Akika, Vjenčanje, Godišnjica, Baby shower, Praznik, Ostalo |
| Alergije / Allergies | text | — | |
| Napomena / Notes | textarea | — | |
| Saglasnost / Consent | checkbox | ✔ | "I understand the order becomes valid once it is confirmed." |

- Inline validation in the active language, accessible error messages (`aria-describedby`, `aria-invalid`) and focus moved to the first error.
- **Send options** (see §8): big tappable buttons: **WhatsApp**, **Viber**, **Instagram DM**, **Email**.
- After sending: a success screen with confetti made of tiny cookies/sprinkles 🍪, the order summary, the generated order reference (e.g. `ES-20261018-4F7K`), a "Sačuvaj kao PDF / Print" button (uses `window.print()` with a print stylesheet) and an "Isprazni korpu / Clear basket" option.

### 5.13 Custom cake request page
- For birthdays, weddings and themed cakes (like the motorbike cake, the pink moon & clouds baby cake, ruffle cakes with ribbons).
- Fields: occasion, number of guests (slider 8–150), tiers (1/2/3), sponge flavour, filling (multi-select), decoration style (Minimalist, Floral, Ruffles & bows, Themed figure, Number cake, Drip), colours (colour chips), inscription, budget range, date, contact, and "describe your idea" textarea.
- A note: **"Imate sliku inspiracije? Pošaljite je u poruci nakon slanja forme."** ("Have an inspiration picture? Send it in the chat after submitting.") There's no file upload, because there's no backend.
- Same send options as the order page.

### 5.14 Recipes index + recipe pages
- Index: recipe cards (photo, title, time, difficulty, servings), filters by category and difficulty, and search.
- Recipe page:
  - Hero photo, title, short intro written in Veldina's voice.
  - Meta row: prep time, bake time, total, servings, difficulty (1–3 whisk icons).
  - **Servings scaler** (−/+) that recalculates ingredient amounts live (amounts stored as numbers + units in JSON).
  - Ingredient list grouped by component (sponge / filling / glaze), each with a **checkbox** (strike-through on check, state kept in `localStorage`).
  - Numbered steps, with an optional "Kuhinjski mod / Cook mode" that keeps the screen awake via the Wake Lock API (feature-detected) and makes the text bigger.
  - "Savjet poslastičarke / Chef's tip" callouts.
  - **Print recipe** button with a clean print stylesheet.
  - CTA box: **"Nemate vremena za pečenje? Naručite gotov! / No time to bake? Order it ready-made!"** that links to the product page. This links recipes back to orders.
  - JSON-LD `Recipe` schema.
- **All recipes are invented placeholders** written to be realistic. Mark them `placeholder: true` and list them in `CONTENT-TODO.md`. The owner may replace them or remove signature recipes she wants to keep secret; the site must work if a product has no recipe.

### 5.15 Contact page
- Instagram (primary), WhatsApp, Viber, phone, email, Facebook.
- Area: Mostar and surroundings. Embed a lightweight static map image linking to Google Maps. **No** iframe on load, to avoid third-party cookies (load the iframe only after a click).
- Working hours (placeholder): Mon–Sat 09:00–19:00, orders via messages at any time.
- **FAQ** accordion (`<details>`):
  - How far in advance should I order?
  - Do you deliver? Where?
  - How do I pay? (placeholder: cash on pickup; deposit for large/custom orders)
  - Can you make sugar-free / gluten-free / nut-free cakes?
  - How do I store the cake?
  - Can I order from abroad for my family in Mostar?

### 5.16 Collaborations page
- Short intro for brands, audience stats (101K followers, mostly BiH and the region, placeholder demographics), types of collaboration (recipe development, sponsored reels, product reviews, events) and a contact button (email / Instagram DM).

### 5.17 Footer
- Brand wordmark + one-line tagline, quick links, contact icons, language switch, "© 2026 Eksplozija Slatkog. Sva prava zadržana.", a link to Privacy, and the small playful line "Ova stranica koristi samo prave kolačiće. 🍪" (see §10.6). **No developer/tool credits.**

---

## 6. Product Catalogue (seed data, mostly invented)

Based on items visible on the Instagram profile. **Prices are placeholders in KM (BAM)** and need to be confirmed by the owner. Each product in `src/data/products.json` has this shape:

```json
{
  "id": "pistacija-malina-torta",
  "category": "torte",
  "featured": true,
  "badges": ["bestseller"],
  "name": { "bs": "Torta pistacija & malina", "en": "Pistachio & Raspberry Cake" },
  "short": { "bs": "...", "en": "..." },
  "description": { "bs": "...", "en": "..." },
  "allergens": ["gluten", "eggs", "milk", "nuts"],
  "images": ["pistacija-malina-1.jpg", "pistacija-malina-2.jpg"],
  "pricing": { "unit": "size", "options": [
    { "id": "s", "label": { "bs": "12 osoba", "en": "12 servings" }, "price": 60 },
    { "id": "m", "label": { "bs": "20 osoba", "en": "20 servings" }, "price": 95 },
    { "id": "l", "label": { "bs": "30 osoba", "en": "30 servings" }, "price": 135 }
  ]},
  "flavours": null,
  "inscription": true,
  "leadTimeDays": 3,
  "recipe": "pistacija-malina-torta",
  "placeholder": true
}
```

### Seed list

| # | BS name | EN name | Category | Placeholder price |
|---|---|---|---|---|
| 1 | Torta pistacija & malina | Pistachio & Raspberry Cake | Torte | from 60 KM (12 servings) |
| 2 | Pistacija-malina kocke | Pistachio Raspberry Slices | Kolači | 30 KM / tray (½), 55 KM full |
| 3 | Bademi & malina kolač | Almond & Raspberry Slice | Kolači | 28 KM / ½ tray |
| 4 | Esterházy s pistacijom | Pistachio Esterházy Cake | Torte | from 65 KM |
| 5 | Breskvice | Peach Cookies ("Breskvice") | Kolači / Sitni kolači | 25 KM / 30 pcs |
| 6 | Čokoladna salama s pistacijom | Chocolate Biscuit Log with Pistachio | Kolači | 20 KM / roll |
| 7 | Kremasta torta s malinama | Vanilla Raspberry Cream Cake | Torte | from 55 KM |
| 8 | Torta karamel & orah | Caramel Walnut Layer Cake | Torte | from 60 KM |
| 9 | Plazma krem torta | Plazma Biscuit Cream Cake | Torte | from 50 KM |
| 10 | Bijela čokolada & lješnjak torta | White Chocolate Hazelnut Cake | Torte | from 60 KM |
| 11 | Čokoladna torta (double choc) | Double Chocolate Layer Cake | Torte | from 60 KM |
| 12 | Pistacija čaše (mini deserti) | Pistachio Dessert Cups | Mini deserti | 30 KM / 12 pcs |
| 13 | Cimet rolnice s vanilija kremom | Cinnamon Rolls with Vanilla Cream | Peciva | 18 KM / 9 pcs |
| 14 | Savijača (pita) s kremom | Cream Strudel | Kolači | 20 KM / tray |
| 15 | Slavljenička torta "Volani & mašne" | Celebration Cake "Ruffles & Bows" | Slavljeničke torte | from 90 KM (custom) |
| 16 | Dječija torta "Mjesec i oblaci" | Kids' Cake "Moon & Clouds" | Slavljeničke torte | from 100 KM (custom) |
| 17 | Rođendanska torta "Motor" | Birthday Cake "Racing Bike" | Slavljeničke torte | from 110 KM (custom) |
| 18 | Torta s mašnom (dvospratna) | Two-Tier Bow Cake | Slavljeničke torte | from 160 KM (custom) |

Categories (`src/data/categories.json`): `torte` (Cakes), `slavljenicke` (Celebration cakes), `kolaci` (Pastries & slices), `mini` (Mini desserts), `peciva` (Sweet bakes).

Celebration cakes use `"pricing.unit": "quote"`: they show "Cijena na upit / Price on request", and their "Add" button sends the user to the Custom Cake form with that design pre-filled as inspiration.

Every product description should be appetising and specific (layers, textures, flavours) in both languages. Write the Bosnian copy natively; don't translate it word-for-word from English. Use Bosnian/ijekavian forms (e.g. *mlijeko, lješnjak, bijela čokolada, okus, kašika*).

---

## 7. Recipes (invented seed data)

Create a complete, realistic recipe for **at least 8 products** (1, 2, 4, 5, 6, 12, 13, 14), stored in `src/data/recipes.json`:

```json
{
  "id": "breskvice",
  "product": "breskvice",
  "title": { "bs": "Breskvice", "en": "Peach Cookies (Breskvice)" },
  "intro": { "bs": "...", "en": "..." },
  "servings": 30,
  "servingsUnit": { "bs": "komada", "en": "pieces" },
  "prepMinutes": 60, "bakeMinutes": 15, "restMinutes": 120,
  "difficulty": 2,
  "groups": [
    { "title": { "bs": "Tijesto", "en": "Dough" }, "items": [
      { "qty": 500, "unit": "g", "name": { "bs": "brašna", "en": "all-purpose flour" } },
      { "qty": 2, "unit": "pcs", "name": { "bs": "jaja", "en": "eggs" } }
    ]}
  ],
  "steps": [ { "bs": "...", "en": "..." } ],
  "tips": [ { "bs": "...", "en": "..." } ],
  "placeholder": true
}
```

- Units are metric (g, ml, kom/pcs, kašika/tbsp, kašičica/tsp) and are localized through the i18n file.
- The scaler rounds sensibly: g to the nearest 5, eggs to whole numbers or halves with a note, spoons to ½.
- Recipes must be technically plausible (correct baking temperatures, times, ratios).

---

## 8. Order Flow Without a Backend

No database. The order is turned into a **clean, readable message** and handed to a messaging channel the customer already uses.

### 8.1 Message builder (`src/js/order/message.js`)
Builds the text in the **owner's working language (Bosnian)** no matter which language the site is in (so Veldina always gets the same format), with an `[EN]` tag if the customer used the English site:

```
🍰 NOVA NARUDŽBA — ES-20261018-4F7K
━━━━━━━━━━━━━━
👤 Amra Hodžić
📞 +387 61 234 567
📅 Sub, 25.10.2026. u 12:00
🚗 Dostava: Ul. Maršala Tita 10, Mostar
🎉 Prilika: Rođendan

🛒 Narudžba:
• 1× Torta pistacija & malina — 20 osoba — natpis: "Sretan 30. rođendan, Lejla" — 95 KM
• 2× Breskvice — 30 kom — 50 KM

💰 Okvirno: 145 KM + dostava 5 KM
⚠️ Alergije: —
📝 Napomena: Molim bez alkohola u filu.
━━━━━━━━━━━━━━
Poslano sa eksplozijaslatkog.ba
```

### 8.2 Channels (configured in `src/data/site.json`)
| Channel | Mechanism |
|---|---|
| **WhatsApp** (primary, recommended) | `https://wa.me/{phone}?text={encodeURIComponent(message)}` |
| **Viber** | `viber://forward?text={encoded}` on mobile; on desktop show the "copy message" fallback + Viber number |
| **Instagram DM** | Instagram doesn't support pre-filled DMs, so **copy the message to the clipboard** (Clipboard API with a `textarea` fallback), show a toast "Poruka kopirana — zalijepite je u chat 📋", then open `https://ig.me/m/eksplozija_slatkog` |
| **Email** | `mailto:{email}?subject=...&body=...` |
| **Optional form service** | A config flag `formEndpoint` (e.g. Formspree / Web3Forms). If set, an extra "Pošalji direktno / Send directly" button POSTs the order as JSON with `fetch`, with a honeypot field for spam. Off by default. |

- Placeholder contact values in `site.json`: phone `+387 6X XXX XXX` → `"38760000000"` marked `placeholder: true`; email `narudzbe@eksplozijaslatkog.ba` (placeholder domain).
- Order reference: `ES-YYYYMMDD-` + 4 random base32 characters, generated on the client.
- Before redirecting, show a short confirmation modal with the message preview (editable `<textarea>`), so the customer sees exactly what will be sent.
- The basket is **not** cleared automatically (in case the app didn't open); the success screen offers to clear it.

---

## 9. Internationalisation (bs + en)

- `src/i18n/bs.json` and `src/i18n/en.json`: all UI strings (nav, buttons, form labels, validation errors, toasts, units, days/months, FAQ, 404). Content strings live next to the data (`{ "bs": "...", "en": "..." }`).
- The build generates **separate static HTML per language** (best for SEO), with `<html lang="bs">` / `<html lang="en">`, `hreflang` alternates (`bs`, `en`, `x-default`) and localized `<title>` / meta description / Open Graph.
- Client JS reads the strings it needs from a small inlined `window.__I18N__` (only the keys the scripts use) to keep the payload small.
- Date and price formatting with `Intl.DateTimeFormat` / `Intl.NumberFormat` (`bs-BA`, `en-GB`); the currency is shown as **"KM"** in Bosnian and **"BAM"** in English.
- The language preference is remembered (`localStorage`, wrapped in try/catch). `/` uses it, or `navigator.language`, to redirect.
- Adding a language later = add `src/i18n/xx.json` + `xx` keys in the data + one line in `site.json` `languages`. The build must warn about missing keys.

---

## 10. Visual Design & "Cookie" Animations

### 10.1 Mood
Warm, buttery, handmade, like a premium Balkan pâtisserie in a brand-book. Think: cream paper, cocoa, pistachio, raspberry, a touch of gold. Lots of white space, big appetising photos, rounded shapes, soft shadows. Sweet, but not childish.

### 10.2 Colour tokens (CSS custom properties on `:root`)
```css
--color-cream:      #FBF6EF;  /* page background */
--color-butter:     #F3E6CF;  /* cards, sections */
--color-dough:      #E2C79F;  /* borders, subtle accents */
--color-cookie:     #B57A45;  /* primary brand (baked cookie) */
--color-cocoa:      #3E2519;  /* text, dark sections */
--color-pistachio:  #93A866;  /* secondary accent */
--color-raspberry:  #C23B5A;  /* CTA highlight / badges */
--color-blush:      #F6DCDD;  /* soft pink sections */
--color-gold:       #C8A35A;  /* thin lines, stars, details */
--color-white:      #FFFFFF;
```
- Check every text/background pair for **WCAG AA contrast** (primary buttons: cocoa text on butter, or white on raspberry/cocoa; verify).
- Optional **dark mode** (`prefers-color-scheme: dark` plus a manual toggle): a "chocolate" theme with a cocoa background, cream text and gold accents.

### 10.3 Typography (self-hosted WOFF2, `font-display: swap`, subset to Latin + Latin Extended for č ć đ š ž)
- Display/headings: **Fraunces** (soft, warm serif; use its "SOFT" and "WONK" axes slightly for character).
- Body/UI: **DM Sans** (or Inter).
- Accent/signature: **Caveat** or **Sacramento** (only for the signature and small handwritten notes, used sparingly).
- Fluid type scale with `clamp()`.

### 10.4 Shapes & details
- Rounded corners (16–28px), "cookie-edge" wavy SVG section dividers, a subtle paper-grain overlay (tiny inline SVG noise), dotted "sprinkle" patterns as decorative backgrounds at very low opacity.
- Icons: a custom inline SVG set (whisk, rolling pin, cake slice, cookie, delivery bag, calendar, heart). Simple 1.75px line style, rounded caps.

### 10.5 Animations (all subtle, all GPU-friendly, all disabled by `prefers-reduced-motion: reduce`)
1. **Cookie bite hover:** on product cards, a bite-shaped CSS `mask` / SVG clip "bites" the top-right corner with a tiny crumb burst (3–5 crumb particles made with pseudo-elements).
2. **Add-to-basket fly:** a small cookie icon (or a mini thumbnail) arcs from the button to the basket icon (Web Animations API), and the badge bounces.
3. **Sprinkle rain:** on the order success screen, short (≤2s) confetti made of sprinkles and mini cookies on a `<canvas>`, max ~80 particles, then cleaned up.
4. **Scroll reveal:** sections fade/slide up 16px with `IntersectionObserver` and staggered children. One-time only, nothing showy.
5. **Hero float:** product thumbnails around the portrait bob gently (`@keyframes`, 6–9s, different delays).
6. **Rolling-pin loader:** a tiny SVG rolling-pin / whisk spinner for any async state (clipboard, optional form POST).
7. **Button press:** a "squish" effect (`scale(0.97)`) with a soft shadow change. CTAs have a light shimmer like sugar glaze on hover.
8. **Cookie cursor trail (desktop only, opt-in feel):** a very subtle crumb trail is shown **only in the hero** and turned off on touch devices and with reduced motion. Keep it tasteful; if it feels gimmicky, leave it out.
9. **Recipe checklist:** checking an ingredient draws a hand-drawn strike line (SVG `stroke-dashoffset`).
10. **404:** a cookie that's been eaten, with crumbs falling.

Performance budget for animation: no animation libraries, only `transform`/`opacity`, `will-change` only while animating, and no layout thrash.

### 10.6 The "cookie banner" pun
The site sets **no tracking cookies** (see §13). Instead of a GDPR banner, show a one-time, dismissible, charming toast in the corner:
> 🍪 "Ova stranica ne koristi kolačiće za praćenje — samo one prave, iz pećnice." / "This site doesn't use tracking cookies — only the real ones, fresh from the oven." [U redu / Got it]

Its dismissal is stored in `localStorage`. If analytics is ever added, replace this with a proper consent banner.

---

## 11. Technical Architecture

### 11.1 Stack
- HTML5 templates with a tiny custom templating approach (`{{key}}`, `{{#each}}`-style partials implemented in the build script, **or** JS template-literal functions in `src/templates/*.js`; the second is preferred because it needs zero dependencies).
- CSS: native CSS with custom properties, nesting (modern browsers) and `@layer` (reset, tokens, base, components, utilities, pages). Split into partials and concatenated by the build.
- JS: vanilla ES modules, no dependencies at runtime. Bundled/minified by the build.
- Node.js ≥ 20 for the build only.

### 11.2 Allowed dev dependencies (keep it minimal)
- `esbuild`: JS bundling + minification and CSS minification.
- `sharp`: generates responsive images (AVIF + WebP + JPEG fallback, widths 400/800/1200/1600) and blur placeholders.
- `html-minifier-terser`: optional, for HTML.
- `chokidar` + a tiny static server (or `node:http` written by hand): for `npm run dev` with live reload.
- Nothing else unless it's clearly justified in the README.

### 11.3 Folder structure
```
/
├─ package.json            (author: "Lamija Behram")
├─ README.md               (setup, scripts, how to add a cake/recipe/language, deploy)
├─ CONTENT-TODO.md         (every placeholder the owner must replace)
├─ build/
│  ├─ build.mjs            (main build: data → pages, assets, sitemap)
│  ├─ dev.mjs              (watch + local server + live reload)
│  ├─ images.mjs           (sharp pipeline)
│  ├─ i18n-check.mjs       (missing translation keys)
│  └─ lib/                 (render helpers, slugify, html escape, seo helpers)
├─ src/
│  ├─ data/
│  │  ├─ site.json         (brand, contacts, socials, lead times, delivery, hours, channels, languages)
│  │  ├─ categories.json
│  │  ├─ products.json
│  │  ├─ recipes.json
│  │  ├─ reviews.json
│  │  └─ faq.json
│  ├─ i18n/
│  │  ├─ bs.json
│  │  └─ en.json
│  ├─ templates/
│  │  ├─ layout.js
│  │  ├─ partials/ (header.js, footer.js, product-card.js, recipe-card.js, seo.js, icons.js)
│  │  └─ pages/    (home.js, menu.js, product.js, recipes.js, recipe.js, order.js, custom-cake.js, about.js, contact.js, collab.js, 404.js)
│  ├─ css/
│  │  ├─ main.css (imports in @layer order)
│  │  ├─ tokens.css, reset.css, base.css, utilities.css
│  │  ├─ components/ (button, card, chip, form, toast, modal, header, footer, basket, lightbox, stepper)
│  │  ├─ pages/
│  │  ├─ animations.css
│  │  └─ print.css
│  ├─ js/
│  │  ├─ main.js           (boot: nav, lang switch, reveal, toasts)
│  │  ├─ basket/           (store.js — localStorage-safe store with events; ui.js)
│  │  ├─ order/            (form.js, validate.js, message.js, channels.js, reference.js)
│  │  ├─ menu/filter.js
│  │  ├─ product/gallery.js, options.js
│  │  ├─ recipe/scaler.js, checklist.js, cookmode.js
│  │  ├─ fx/               (bite.js, fly-to-basket.js, sprinkles.js, reveal.js, crumbs.js)
│  │  └─ utils/            (dom.js, storage.js, format.js, clipboard.js)
│  ├─ assets/
│  │  ├─ images/           (original photos — owner adds real ones here)
│  │  ├─ fonts/
│  │  ├─ icons/
│  │  └─ favicon/          (cookie/cake favicon SVG + PNGs + webmanifest)
│  └─ static/              (robots.txt, _redirects, copied as-is)
└─ dist/                   (build output, git-ignored)
```

### 11.4 npm scripts
```json
{
  "dev":   "node build/dev.mjs",
  "build": "node build/build.mjs",
  "build:prod": "node build/build.mjs --prod",
  "images": "node build/images.mjs",
  "check": "node build/i18n-check.mjs",
  "preview": "node build/dev.mjs --dist"
}
```
- `--prod`: minify everything, hash asset filenames (`main.3f9a1c.css`), produce `sitemap.xml`, fail on missing translations, and **fail if placeholder reviews would be published**.

### 11.5 Image handling
- Until real photos are added, generate **tasteful placeholder images** (SVG with a soft gradient in brand colours + an icon + the product name), so layouts never break. When a real `src/assets/images/<id>-1.jpg` exists, the build uses it automatically.
- `<picture>` with AVIF/WebP/JPEG, `srcset` + `sizes`, explicit `width`/`height`, `loading="lazy"` (except the hero portrait: `fetchpriority="high"`), `decoding="async"`, and meaningful bilingual `alt` text.
- The hero portrait file is `src/assets/images/veldina-portrait.jpg`. The owner will provide it (the sunset mountain photo above Mostar). Crop it to the subject.

---

## 12. SEO

- Unique localized `<title>` and meta descriptions per page, e.g. "Torte i kolači po narudžbi u Mostaru | Eksplozija Slatkog".
- Open Graph + Twitter cards with a branded share image per page (product photo for product pages).
- JSON-LD:
  - `Bakery` / `LocalBusiness` (name, image, address locality Mostar, areaServed, telephone placeholder, sameAs: Instagram, Facebook, priceRange "KM–KMM").
  - `Person` for Veldina Cokić (jobTitle: "Poslastičarka / Pastry chef", sameAs Instagram).
  - `Product` + `Offer` on product pages, `Recipe` on recipe pages, `FAQPage` on contact, `BreadcrumbList` everywhere.
- `sitemap.xml` with `hreflang` alternates, `robots.txt`, and canonical URLs.
- Semantic headings (one `h1` per page) and descriptive link text.
- Bosnian keywords to use naturally: *torte po narudžbi Mostar, rođendanske torte Mostar, kolači Mostar, slavljeničke torte, dječije torte, breskvice, torta pistacija*.

---

## 13. Privacy, Legal & Security

- **No tracking**, no third-party scripts, no Instagram/Facebook embeds, no Google Fonts CDN (fonts are self-hosted), and the map only loads on click.
- A short **Privacy page** (`/bs/privatnost`, `/en/privacy`): the site stores the basket and preferences only in the visitor's own browser, and order data goes only through the channel the customer chooses (WhatsApp/Viber/Instagram/email).
- Security headers via `_headers` (Netlify/Cloudflare) or documented for other hosts: `Content-Security-Policy` (self only; `form-action` includes the optional form endpoint), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`.
- Escape all data rendered into HTML at build time, and use `textContent` (never `innerHTML` with user input) at runtime.
- Allergen disclaimer: "Proizvodi se rade u kuhinji u kojoj se koriste orašasti plodovi, gluten, jaja i mlijeko." / "Products are made in a kitchen that handles nuts, gluten, eggs and dairy."

---

## 14. Accessibility (WCAG 2.2 AA)

- Semantic landmarks (`header`, `nav`, `main`, `footer`), a skip link, and visible focus styles (in a gold/cocoa colour).
- All interactive elements work with the keyboard; the modal and lightbox trap focus and close on Esc; the menu uses `aria-expanded`.
- Form labels are always visible (not only placeholders); errors are announced through an `aria-live` region; toasts use `role="status"`.
- Touch targets are ≥ 44×44px.
- `prefers-reduced-motion` disables every non-essential animation; `prefers-contrast` is respected where possible.
- Alt text for every product/recipe image, in both languages.

---

## 15. Performance Budget

- Home page: **< 200 KB** transferred before images (HTML + CSS + JS + fonts), JS **< 35 KB** gzipped total.
- LCP < 2.0s on a 4G mid-range phone; CLS < 0.05; INP < 200ms.
- Critical CSS inlined for the hero, the rest loaded normally; fonts preloaded (2 files max).
- No render-blocking JS (`type="module"`, deferred).
- Works well in the **Instagram in-app browser** (test: no `window.open` popups that get blocked, deep links work, clipboard fallback works).

---

## 16. Browser Support

Last 2 versions of Chrome, Safari (iOS 15+), Firefox, Edge, Samsung Internet, plus the Instagram/Facebook in-app browsers. The core flow (browse → basket → send order via WhatsApp) must work even if JavaScript fails: product pages include a plain `wa.me` link with a pre-filled message as a fallback.

---

## 17. Content To Be Provided by the Owner (`CONTENT-TODO.md`)

Generate this file listing every placeholder, including:
- [ ] Real phone number(s) for WhatsApp / Viber
- [ ] Order email address and the final domain name
- [ ] Final prices, sizes and lead times for every product
- [ ] Real product photos (file naming: `<product-id>-1.jpg`, `-2.jpg`, …)
- [ ] Portrait photo(s) of Veldina (hero + About)
- [ ] Logo (if one exists) / confirm the wordmark
- [ ] Real customer reviews (with permission), replacing the sample ones
- [ ] Pogled.ba article URL
- [ ] Delivery zones and fees, payment methods, deposit policy
- [ ] Working hours, closed days
- [ ] Recipes: confirm, edit or remove (especially signature recipes)
- [ ] About-page story and timeline dates
- [ ] Collaboration info / media kit stats

---

## 18. Deliverables

1. Complete source code in the structure above, with clean and commented code (comments in English).
2. `README.md`: requirements, `npm install`, `npm run dev`, `npm run build:prod`, how to add a product/recipe/language, how to deploy to Netlify/Cloudflare Pages/GitHub Pages, and how to switch on the optional form endpoint.
3. `CONTENT-TODO.md`.
4. A working `dist/` build (git-ignored) that passes the acceptance checks below.
5. `.gitignore`, `.editorconfig`, and `.nvmrc` (Node 20).

---

## 19. Acceptance Criteria

- [ ] `npm install && npm run build:prod` succeeds on a clean checkout with Node 20, without errors or missing-translation warnings.
- [ ] Every page exists in **bs** and **en**, and the language switch keeps you on the equivalent page.
- [ ] The hero clearly shows **Veldina** as the pastry chef, with "Order" CTAs visible without scrolling on a 375×667 screen.
- [ ] A user can: browse → filter → open a product → choose size/flavour/inscription → add to basket → fill the form → preview the message → send via WhatsApp, in **under 60 seconds** on mobile.
- [ ] The date picker blocks dates earlier than the required lead time and disabled days.
- [ ] The Instagram DM flow copies the message and opens the DM; the Viber and email flows work; the optional form endpoint works when configured.
- [ ] The basket survives reloads and language switches; the site still works with `localStorage` blocked.
- [ ] Each recipe page has a working servings scaler, ingredient checklist, print view and an "order it ready-made" CTA.
- [ ] All animations are smooth (60fps on a mid-range phone) and are disabled with reduced motion.
- [ ] Lighthouse mobile ≥ 95 on all four categories for Home, Menu, a Product page, a Recipe page and the Order page.
- [ ] No console errors. No third-party requests on page load.
- [ ] axe/Lighthouse accessibility audit: no critical issues.
- [ ] **No name other than "Lamija Behram" as author/collaborator and "Eksplozija Slatkog / Veldina Cokić" as the business appears anywhere in the code, metadata, docs or commits.**

---

## 20. Build Order (suggested milestones)

1. Scaffold the repo, build pipeline, dev server, tokens, base styles and layout (header/footer) in both languages.
2. Data files (site, categories, products, recipes, reviews, FAQ) + i18n files with full bs/en content.
3. Home page (hero, about, featured, how-to-order, reviews, press, Instagram band, CTA).
4. Menu + product pages + basket store/UI.
5. Order page + validation + message builder + all send channels + success screen.
6. Custom cake page.
7. Recipes index + recipe pages (scaler, checklist, cook mode, print).
8. About, Contact (+FAQ), Collaborations, Privacy, 404.
9. Animations & micro-interactions pass.
10. SEO (JSON-LD, sitemap, OG), image pipeline, performance and accessibility pass, prod build checks.
11. README + CONTENT-TODO, and a final review against §19.
