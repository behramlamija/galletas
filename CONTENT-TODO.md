# Sadržaj koji treba zamijeniti prije objave

Sve navedeno ispod je trenutno **izmišljeno ili privremeno**. Podaci se mijenjaju u `src/data/` i `src/i18n/`,
a zatim se pokrene `npm run build:prod`.

## Kontakt i osnovni podaci — `src/data/site.json`

- [ ] **Broj telefona** za WhatsApp i Viber (`contact.whatsapp`, `contact.viber` — format `38761234567`, bez `+`)
      i prikaz broja (`contact.phoneDisplay`). Trenutno: `+387 60 000 0000`.
- [ ] **Email za narudžbe** (`contact.email`). Trenutno: `narudzbe@eksplozijaslatkog.ba`.
- [x] **Adresa stranice** (`url`): `https://galletas.behramlamija.workers.dev`. Ako kasnije kupite domenu, promijenite je ovdje.
- [ ] Tačan **Facebook link** (`contact.facebook`).
- [ ] **Link na članak Pogled.ba** (`press.url`). Trenutno vodi na naslovnu Pogled.ba.
- [ ] **Radno vrijeme** i neradni dani (`hours`, `ordering.closedDays`). Trenutno: pon–sub 09–19, nedjelja zatvoreno.
- [ ] **Rokovi za narudžbu** po kategoriji (`ordering.leadTimeDays`, `customLeadTimeDays`). Trenutno: torte 3, kolači 2, slavljeničke 7 dana.
- [ ] **Dostava** — cijena u Mostaru (`ordering.deliveryFeeMostar`, trenutno 5 KM) i zone izvan Mostara.
- [ ] **Termini preuzimanja** (`ordering.timeSlots`).

## Objava

- [ ] Kada je sve spremno za javnost, u `src/data/site.json` postaviti `"hideFromSearch": false`
      (tada Google može indeksirati stranicu i dobija sitemap).

## Proizvodi — `src/data/products.json`

- [ ] **Cijene i veličine** za svih 18 proizvoda (sve su okvirne / izmišljene).
- [ ] Nazivi i opisi — provjeriti da odgovaraju stvarnim okusima i sastojcima.
- [ ] **Alergeni** za svaki proizvod.
- [ ] Okusi (`flavours`) gdje postoje izbori.
- [ ] Nakon provjere, ukloniti `"placeholder": true`.

## Fotografije — `src/assets/images/`

- [ ] **Prave fotografije u visokoj rezoluciji** (najmanje 1200 px širine). Trenutne slike su izrezane iz
      Instagram screenshotova (~240 px) i izgledaju mutno na većim ekranima.
      Imena fajlova: `<id-proizvoda>-1.jpg`, `-2.jpg`… (npr. `breskvice-1.jpg`).
- [ ] **Portret Veldine** u punoj rezoluciji (`veldina-portrait.jpg`) — po mogućnosti i druga fotografija za stranicu O meni.
- [ ] 6 fotografija za Instagram traku (`instagramImages` u `site.json`).
- [ ] **Logo**, ako postoji (trenutno je tekstualni logo s kolačićem u `src/templates/partials/icons.js` i `src/assets/favicon/favicon.svg`).

## Recenzije — `src/data/reviews.json`

- [ ] **Prave recenzije kupaca** (npr. iz Instagram highlighta "Recenzije"), uz dozvolu kupaca.
      Trenutnih 5 su **primjeri** — vide se samo u razvojnoj verziji i nikad ne izlaze na javnu stranicu.
      Za prave recenzije postaviti `"placeholder": false`.

## Recepti — `src/data/recipes.json`

- [ ] Svih 8 recepata su **izmišljeni** (ali realni) primjeri. Veldina treba potvrditi, izmijeniti ili ukloniti
      recepte — posebno one koje želi zadržati kao tajnu kuće.

## Tekstovi — `src/i18n/bs.json` i `en.json`

- [ ] **Priča "O meni"** (`about.p1`–`p4`) — provjeriti i prilagoditi.
- [ ] **Vremenska linija** (`about.timeline`) — godine su izmišljene.
- [ ] **Saradnja** — statistika publike i media kit (`collab.*`).
- [ ] **Plaćanje i avans** — tekst u FAQ (`src/data/faq.json`).
- [ ] Datum posljednje izmjene na stranici Privatnost (`privacy.updated`).
