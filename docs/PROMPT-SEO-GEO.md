# PROMPT MASTER — Implementare completă SEO & GEO (PACA CONSTRUCT)

> Copiază tot ce e mai jos (de la „═══ START PROMPT ═══” până la „═══ END PROMPT ═══”) și dă-l agentului de cod (Claude Code) care lucrează în repo-ul `paca-construct`.
> Promptul presupune execuție directă pe cod, în pași verificabili.

---

═══ START PROMPT ═══

## Rol & obiectiv

Ești inginer SEO/GEO senior + dezvoltator Next.js 16. Lucrezi în repo-ul `paca-construct` (Next.js 16.2.9, React 19, App Router, Server Components, Supabase, Upstash, deploy pe Vercel). Site-ul aparține firmei **PACA CONSTRUCT SRL** — terasamente, excavări, amenajări peisagistice și închirieri utilaje cu operator, în limba română.

**Obiectiv:** site-ul trebuie să fie indexat și găsit de TOATE motoarele de căutare (Google, Bing) ȘI citat de TOȚI agenții AI / LLM (Google AI Overviews & AI Mode, ChatGPT/OpenAI, Perplexity, Claude, Gemini, Bing Copilot), să crească organic, aplicând **cele mai noi standarde SEO/GEO (iunie 2026)**.

**Principiu director (ghidul Google 2026):** „optimizarea pentru AI este în continuare SEO”. Nu există trucuri separate. Câștigă conținutul tehnic solid + date structurate + E‑E‑A‑T + răspunsuri directe (answer‑first). Implementează în consecință.

## Reguli de lucru OBLIGATORII

1. **Acest Next.js diferă de versiunile din training.** ÎNAINTE de a scrie cod, citește ghidurile relevante din `node_modules/next/dist/docs/` (în special `01-app/03-api-reference/03-file-conventions/01-metadata/` pentru `robots`, `sitemap`, `manifest`, `opengraph-image`, `app-icons`; `01-app/03-api-reference/04-functions/generate-metadata.md` și `generate-viewport.md`; `01-app/02-guides/json-ld.md`). Respectă notele de „deprecation”.
2. **Nu strica nimic existent.** Păstrează stilul codului (comentarii în română, tipare TypeScript stricte, server-first). Rulează `npm run build` și `npm run lint` după fiecare fază; nu treci mai departe cu erori.
3. **Centralizează configul.** Toate datele de business (NAP, URL, social) într-un singur fișier; nicio valoare hardcodată dispersată.
4. **Server-rendered.** Tot SEO (metadata, JSON-LD) trebuie să apară în HTML-ul randat pe server (verificabil cu „View Source”), nu injectat pe client.
5. **Nu inventa date de business.** Unde lipsesc valori reale (telefon, adresă, CUI), folosește variabile din config cu valori-placeholder CLAR marcate `// TODO: înlocuiește cu date reale` și raportează-le la final, ca să le completeze omul.
6. Lucrează în faze. La final livrezi un rezumat cu fișiere create/modificate + checklist de validare manuală (GSC, Google Business Profile).

---

## FAZA 0 — Config centralizat + variabile de mediu

Creează `app/lib/site-config.ts` ca sursă unică de adevăr:

- `siteUrl` din `process.env.NEXT_PUBLIC_SITE_URL` (fallback `https://www.pacaconstruct.ro`).
- Identitate business: nume legal („PACA CONSTRUCT SRL”), nume brand, descriere, `// TODO` CUI, Reg. Com.
- NAP: telefon, WhatsApp, email(uri), adresă completă (stradă, oraș, județ, cod poștal, țară RO), `geo` (lat/lng `// TODO`), program (`openingHours`).
- `areaServed`: lista de localități/județe deservite.
- `sameAs`: array cu URL-uri Google Business Profile, Facebook, Instagram, LinkedIn (`// TODO`).
- `defaultOgImage`, `logo`, `locale: "ro_RO"`.

Actualizează `.env.example` cu `NEXT_PUBLIC_SITE_URL` documentat (există deja) și adaugă, dacă lipsesc, chei pentru verificarea GSC/Bing.

**Acceptare:** orice modul poate importa `siteConfig`; nicio dată de contact nu mai e hardcodată în componente.

---

## FAZA 1 — Fundație metadata (root)

În `app/layout.tsx`:

1. Adaugă `metadataBase: new URL(siteConfig.siteUrl)`.
2. Extinde `metadata` cu: `title` ca obiect `{ default, template: "%s | PACA CONSTRUCT" }`, `description`, `applicationName`, `authors`, `creator`, `publisher`, `keywords` relevante (terasamente, excavări, amenajări peisagistice, închiriere utilaje cu operator etc.), `alternates: { canonical: "/" }`, `formatDetection`.
3. `openGraph` complet: `type: "website"`, `locale: "ro_RO"`, `siteName`, `url`, `title`, `description`, `images` (OG implicit 1200×630).
4. `twitter`: `card: "summary_large_image"`, `title`, `description`, `images`.
5. `robots`: `{ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }`.
6. `icons` (vezi Faza 4) și `verification` (GSC/Bing/Yandex din env, `// TODO` valori).
7. Adaugă **export `viewport`** separat (`generateViewport`/`export const viewport`) cu `themeColor` (deprecat în `metadata` din Next 14). Folosește culoarea brandului (`#1e2a20` olive sau `#d88a24` amber).
8. Atenție: `<html lang="ro">` rămâne. Nu duplica title-ul.

**Acceptare:** `view-source` pe `/` arată OG, Twitter, canonical absolut, robots. Build curat.

---

## FAZA 2 — `robots.ts` (inclusiv boți AI)

Creează `app/robots.ts` (`MetadataRoute.Robots`):

- Regulă generală `userAgent: "*"`: `allow: "/"`, `disallow: ["/admin", "/login", "/auth", "/api"]`.
- **Permite explicit boții AI** (vrem citare maximă), fiecare cu `allow: "/"` și aceleași `disallow` private: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot`, `CCBot`, `Amazonbot`, `Bytespider`, `Meta-ExternalAgent`.
- `sitemap: \`${siteConfig.siteUrl}/sitemap.xml\``.
- `host` opțional.

**Acceptare:** `/robots.txt` se servește, listează sitemap-ul, interzice zonele private, permite boții AI.

---

## FAZA 3 — `sitemap.ts` dinamic (din Supabase)

Creează `app/sitemap.ts` (`MetadataRoute.Sitemap`), server-side:

- Rute statice: `/`, `/inchiriere-utilaje`, `/blog`, `/faq`, `/contact` (+ paginile noi „despre”, „termeni”, „confidentialitate” dacă există) cu `changeFrequency`/`priority` adecvate (home `priority 1`).
- Rute dinamice: interoghează Supabase pentru toate `services`, `blog_posts`, `rental_machines` **publicate** (`is_published = true`) și generează URL-urile, cu `lastModified` din `updated_at`.
- Folosește un client Supabase read-only adecvat sitemap-ului (anon/public).
- Dacă volumul de articole crește mult, pregătește terenul pentru `generateSitemaps` (sharding la nevoie).

**Acceptare:** `/sitemap.xml` listează TOATE paginile publice + cele dinamice, cu `lastmod` corect. Zero rute private.

---

## FAZA 4 — Icons, manifest, OG images

1. `app/manifest.ts` (`MetadataRoute.Manifest`): `name`, `short_name`, `description`, `start_url: "/"`, `display: "standalone"`, `background_color`, `theme_color`, `icons` (192, 512, maskable), `lang: "ro"`, `categories`.
2. Icons: generează și adaugă `app/icon.png` (≥512×512), `app/apple-icon.png` (180×180), păstrează `favicon.ico`. Dacă nu poți genera binar, creează `app/icon.tsx` cu `ImageResponse` (logo text pe fundal brand).
3. OG implicit: `app/opengraph-image.tsx` cu `ImageResponse` (1200×630, brand + tagline). Adaugă `app/twitter-image.tsx` (poate reutiliza).
4. OG dinamic per entitate: `opengraph-image.tsx` în `app/blog/[slug]/`, `app/servicii/[slug]/`, `app/inchiriere-utilaje/[slug]/`, care randează titlul entității + brand. Setează `alt`, `size`, `contentType`.

**Acceptare:** fiecare pagină are `og:image` valid; `manifest.webmanifest` se servește; iconurile apar în `<head>`.

---

## FAZA 5 — Date structurate JSON‑LD (nucleul GEO)

Folosește patternul recomandat de Next 16: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />`. Creează un helper `app/components/json-ld.tsx` (componentă reutilizabilă care primește obiectul și face escaping-ul). Opțional, tipare cu `schema-dts`.

Construiește un modul `app/lib/schema.ts` cu funcții care produc obiectele, alimentate din `siteConfig` și din date:

1. **`Organization` + `LocalBusiness`** (în `app/layout.tsx`, deci pe toate paginile). Tip recomandat: `GeneralContractor` sau `LocalBusiness` cu: `name`, `legalName`, `url`, `logo`, `image`, `telephone`, `email`, `address` (PostalAddress complet), `geo` (GeoCoordinates), `openingHoursSpecification`, `areaServed` (din config), `priceRange`, `sameAs`, `hasMap` (link Google Maps). Include `@id` stabil (ex. `${siteUrl}#organization`) pentru a lega entitatea între scheme.
2. **`WebSite` + `SearchAction`** (în layout): `potentialAction` SearchAction către o rută de căutare (folosește backend-ul Upstash Search existent; dacă nu există rută `/cauta?q=`, creează una minimă sau leagă la `/blog?q=`).
3. **`FAQPage`** pe `/faq`: mapează `faq_sections`/`faq_items` în `mainEntity[]` (`Question`/`acceptedAnswer`). Curăță HTML din răspunsuri.
4. **`Service`** pe `/servicii/[slug]`: `name`, `description`, `provider` (referință `@id` Organization), `areaServed`, `serviceType`, și `hasOfferCatalog`/`OfferCatalog` din `processes`/`specs` dacă e relevant.
5. **`Product` + `Offer`** pe `/inchiriere-utilaje/[slug]`: `name`, `image`, `description`, `brand`, `offers` (`Offer` cu `price`/`priceCurrency: "RON"` parsat din `machine.price`, `availability`, `priceSpecification`, `seller` = Organization). `additionalProperty` din `specs[]`.
6. **`BlogPosting`/`Article`** pe `/blog/[slug]`: `headline`, `description`, `image`, `datePublished` + `dateModified` (ISO — vezi Faza 6), `author` (Person/Organization cu E‑E‑A‑T), `publisher` (Organization cu logo), `mainEntityOfPage`, `keywords` din `tags`, `articleSection` din `category`. Dacă există `sources[]`, ia-le în considerare drept `citation`.
7. **`BreadcrumbList`** pe toate paginile cu breadcrumb (utilaje, contact, servicii, blog): `itemListElement[]` cu `position`/`name`/`item` URL absolut.
8. **`ItemList`** pe paginile de listă (`/blog`, `/inchiriere-utilaje`, listă servicii): elementele în ordine.

**Acceptare:** fiecare tip validează FĂRĂ erori/avertismente critice în Google Rich Results Test și Schema Markup Validator. `@id`-urile leagă corect entitățile.

---

## FAZA 6 — Strat de date: expune date ISO + canonical per pagină

1. În `app/data/blog.ts`: extinde tipul public `BlogPost` cu `publishedAtISO` și `updatedAtISO` (din coloanele `published_at`/`updated_at`, deja în DB). Mapează-le în `mapPost`. Nu strica `publishedAt` (label) folosit la afișare. Folosește ISO pentru `<time dateTime>` în pagina articolului și pentru schema.
2. Adaugă `alternates: { canonical: "/ruta" }` în `generateMetadata`-ul fiecărei pagini dinamice (`servicii/[slug]`, `blog/[slug]`, `inchiriere-utilaje/[slug]`) și în metadata statică a paginilor fixe. Adaugă și `openGraph`/`twitter` specifice (title, description, url, image din entitate) — nu doar title+description.
3. Adaugă `generateStaticParams` pentru `servicii/[slug]`, `blog/[slug]`, `inchiriere-utilaje/[slug]` (listează slug-urile publicate) ca paginile să fie pre‑randate; păstrează revalidate/ISR coerent cu strategia de cache existentă.

**Acceptare:** articolele au dată ISO în schema și în `<time>`; fiecare pagină dinamică are canonical + OG proprii; build pre‑randează rutele.

---

## FAZA 7 — `noindex` pe zonele private

În `app/admin/layout.tsx`, `app/login/page.tsx` (+ `recovery`, `update-password`) și orice pagină de autentificare: adaugă `export const metadata = { robots: { index: false, follow: false } }`. Combinat cu `Disallow` din robots.ts. Verifică `auth/callback` (route handler — fără indexare oricum, dar confirmă).

**Acceptare:** paginile private au `<meta name="robots" content="noindex">`.

---

## FAZA 8 — Conținut, E‑E‑A‑T & semantică (factorul #1 pentru AI)

1. **Fix dublu `<h1>` pe `/contact`**: păstrează un singur `<h1>` în DOM, comutat prin CSS responsiv (nu două elemente). Verifică „un singur h1 per pagină” pe tot site-ul.
2. **Pagini de încredere obligatorii** (creează rute reale și leagă-le în footer în loc de `#`):
   - `/despre` — „Despre noi”: poveste, experiență (ani, proiecte), echipă, valori, certificări, flotă. Acesta e cel mai puternic semnal „first‑hand experience” pentru AI.
   - `/confidentialitate` — Politică de confidențialitate (GDPR RO/UE).
   - `/termeni` — Termeni și condiții.
   - (opțional) `/proiecte` — portofoliu cu studii de caz (înainte/după, locație, tip lucrare) → conținut unic, foarte citabil.
3. **E‑E‑A‑T pe blog**: adaugă autor vizibil (entitate Person sau „Echipa PACA CONSTRUCT”), dată lizibilă cu `<time dateTime>`, și o secțiune „de ce ne poți crede” / legătură la `/despre`. Pentru articolele generate AI, asigură un human-in-the-loop sau un disclaimer de revizuire.
4. **Answer‑first**: pentru pagini de serviciu și articole, primul paragraf răspunde direct la întrebarea-țintă (LLM-urile extrag de sus). Adaugă blocuri Q&A / „Întrebări frecvente” specifice pe paginile de serviciu (și schema `FAQPage` aferentă).
5. **SEO local 2026 — pagini zonă de serviciu**: creează un model de pagini per localitate/județ deservit (ex. `/servicii/[slug]/[zona]` sau `/zona/[oras]`) cu conținut UNIC per zonă, `areaServed` în schema și hartă încorporată. „Acoperim toată țara” nu mai e suficient pentru ranking local / AI.
6. **Diacritice**: asigură conținut românesc corect (ă/â/î/ș/ț) în textele din DB și în componente. Adaugă validare în formularele din admin pentru câmpurile de conținut.
7. **Internal linking**: leagă contextual articolele de paginile de serviciu relevante și invers (ancore descriptive, nu „click aici”).

**Acceptare:** un singur h1/pagină; paginile legale și „despre” există și sunt linkate; blogul are autor + dată ISO; serviciile au bloc Q&A answer‑first.

---

## FAZA 9 — Performanță / Core Web Vitals

1. **`next.config.ts` — `images.remotePatterns`**: adaugă host-ul Supabase Storage (din `NEXT_PUBLIC_SUPABASE_URL`, pattern `/storage/v1/object/public/**`) ca `next/image` să optimizeze imaginile remote. Verifică toate `<Image>` cu `src` remote.
2. Confirmă `priority`/`fetchPriority` pe imaginea LCP (hero are deja), `sizes` corecte, lățimi/`quality` rezonabile.
3. Verifică fonturile (`next/font` are `display: swap`); reconsideră dacă 3 familii sunt necesare.
4. Asigură-te că paginile SEO sunt statice/ISR, nu dynamic fără motiv.

**Acceptare:** imaginile remote se optimizează; Lighthouse Performance bun; CWV „Good” pe pagini cheie.

---

## FAZA 10 — Măsurare & off-page (checklist pentru om + cod unde se poate)

1. **Verificare în cod**: adaugă `metadata.verification` (Google/Bing) din env (`// TODO` valori reale).
2. **Analytics**: integrează `@vercel/analytics` (+ `@vercel/speed-insights`) sau GA4 (prin `next/script` cu `strategy="afterInteractive"`). Respectă GDPR (consimțământ dacă e cazul).
3. **`llms.txt` (OPȚIONAL, prioritate joasă)**: poți adăuga `app/llms.txt/route.ts` care servește un index Markdown al paginilor cheie. **Notă onestă:** Google a confirmat (2026) că `llms.txt` NU influențează AI Overviews și niciun LLM major nu îl citește în producție — adaugă-l doar pentru completitudine/tooling, nu ca pârghie de ranking.
4. **Checklist manual (raportează-l utilizatorului la final):** creează/optimizează Google Business Profile (NAP identic cu site-ul, categorii, fotografii, recenzii), leagă-l prin `sameAs`/`hasMap`; verifică proprietatea în Google Search Console + Bing Webmaster Tools; trimite `sitemap.xml`; cere indexare pentru paginile cheie; înscrie firma în directoare RO relevante (consistență NAP).

**Acceptare:** analytics activ; verification meta prezent; raport final cu pașii manuali off-page.

---

## Livrabil final (ce raportezi)

1. Listă fișiere create/modificate, pe faze.
2. Output `npm run build` + `npm run lint` curat.
3. Lista valorilor `// TODO` care necesită date reale (NAP, CUI, geo, social, verification).
4. Rezultatele validării schema (Rich Results Test) per tip.
5. Checklist off-page rămas în sarcina omului (GSC, GBP, Bing).

## Criterii globale de acceptare (Definition of Done)

- `/robots.txt` și `/sitemap.xml` valide, sitemap cu toate rutele publice + dinamice, robots permite boții AI și interzice privatul.
- Fiecare pagină publică: title+description unice, canonical absolut, OG + Twitter + `og:image`.
- JSON-LD prezent și **fără erori** pentru: Organization/LocalBusiness, WebSite/SearchAction, FAQPage, Service, Product/Offer, BlogPosting, BreadcrumbList, ItemList.
- Zonele private: `noindex` + `Disallow`.
- Imagini remote optimizate; un singur `<h1>`/pagină; pagini legale + „despre” reale și linkate.
- `npm run build` și `npm run lint` trec; SEO totul randat server-side (verificat în „View Source”).
- Lighthouse SEO 100; CWV „Good” pe pagini cheie.

═══ END PROMPT ═══

---

## Note pentru tine (Arsene) — context, nu parte din prompt

- **Datele reale lipsă** sunt blocante pentru schema `LocalBusiness` și E‑E‑A‑T: telefon, adresă completă, CUI/Reg. Com., coordonate geo, link-uri social/Google Business Profile. Pregătește-le; agentul le va lăsa ca `// TODO`.
- **Google Business Profile** și verificarea în **Search Console / Bing** sunt pași în afara codului — îi faci tu (sau cu ajutorul meu, separat). Fără ele, AI Overviews și SEO-ul local nu ajung la potențial.
- **`llms.txt`** e inclus doar opțional și cu rezervă: în iunie 2026 nu e o pârghie SEO reală (Google a spus oficial că nu-l folosește). Prioritate joasă.
- Recomand executarea promptului **pe faze**, cu commit + verificare după fiecare, nu tot deodată.

### Surse (standarde 2026 folosite la audit)
- Google a publicat (mai 2026) prima sa îndrumare oficială pentru optimizarea pentru AI generativ: „este în continuare SEO”. — [averi.ai](https://www.averi.ai/blog/google-s-ai-guide-just-killed-4-geo-myths-(and-validated-3)), [Frase GEO 2026](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- Date structurate pentru AI search (Organization, LocalBusiness, Product, Article, FAQPage). — [Stackmatix: Structured Data AI Search 2026](https://www.stackmatix.com/blog/structured-data-ai-search)
- SEO local 2026 / AI Overviews + LocalBusiness (areaServed, geo, hasMap, sameAs, pagini de zonă). — [Stackmatix: AI Overview Local](https://www.stackmatix.com/blog/google-ai-overview-local-businesses), [Fuel Online: Local SEO 2026](https://fuelonline.com/seo/google-business-profile-optimization-2026-the-complete-local-seo-guide/)
- `llms.txt` — adoptare redusă, nefolosit de LLM-urile majore, Google a spus „nu”. — [Codersera (mai 2026)](https://codersera.com/blog/llms-txt-complete-guide-2026/), [LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
