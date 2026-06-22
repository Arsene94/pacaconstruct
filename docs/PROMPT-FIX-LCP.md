# PROMPT — Fix LCP (Performanță 95+) PACA CONSTRUCT

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l unui developer Next.js senior.
> Bazat pe un raport Lighthouse real (mobil, Moto G Power, 4G lent, pacaconstruct.vercel.app).

---

## CONTEXT — măsurătoarea reală

Lighthouse mobil, încărcare inițială, 4G lent:

- First Contentful Paint: **0,9 s** (bun)
- **Largest Contentful Paint: 5,3 s** (slab, singura problemă)
- Total Blocking Time: **0 ms** (perfect)
- Cumulative Layout Shift: **0** (perfect)
- Speed Index: 3,5 s

**Defalcarea LCP (esențială):**

- Time to First Byte: 120 ms (excelent, ISR/static funcționează)
- **Întârziere la încărcarea resursei: 1.050 ms** (imaginea LCP pornește mult prea târziu)
- **Durata de încărcare a resursei: 1.350 ms** (imaginea e prea grea pentru 4G lent)
- Întârziere la redarea elementului: 20 ms (bun)

Element LCP = imaginea hero `hero-mobile.png` (servită prin `/_next/image?...&w=750&q=60`).

Audituri secundare (nescorate, dar utile): render-blocking CSS (15,3 KiB / 160 ms), JavaScript vechi/polyfills (~20 KiB), livrare imagini (~48 KiB de economisit pe hero.png + hero-mobile.png + logo), cookie-script.com (27 KiB, fără cache).

═══ START PROMPT ═══

## ROL & OBIECTIV

Ești developer Next.js senior (10+ ani), specialist Core Web Vitals. Site: `paca-construct` (Next.js 16.2, App Router, deploy Vercel). Toate metricile sunt verzi, **mai puțin LCP = 5,3 s**. Adu **LCP sub 2,5 s** și **scorul de Performanță la 95+**, fără a regresa TBT (0 ms) și CLS (0).

Nu atinge nimic ce nu e legat de LCP. Schimbări mici, măsurabile, cu `npx tsc --noEmit` + `npm run build` curat după fiecare.

## DIAGNOZĂ (respect-o, nu o relua de la zero)

LCP-ul se descompune în: TTFB 120 ms (bun) + **1.050 ms întârziere la pornirea imaginii** + **1.350 ms descărcarea imaginii** + 20 ms render. Deci două pârghii, în ordinea impactului:

A. **Pornește imaginea LCP mai devreme** (rezolvă cei 1.050 ms). Două cauze reale în cod:

1.  **Hero-ul folosește `getImageProps` + `<img>` manual** (`app/components/home-sections.tsx`, `HeroSection`), nu componenta `<Image priority>`. Cu `<img>` manual, Next **nu mai injectează `<link rel="preload" as="image">`** pentru LCP, deci browserul descoperă imaginea abia când parsează DOM-ul, după CSS. Asta explică direct întârzierea de ~1 s.
2.  **Imagini decorative de sub fold se încarcă `eager`** și fură banda pe 4G lent. Concret: în `PrimaryServicePaths` (`home-sections.tsx`, ~linia 150) imaginea mobilă `/hero.png` are `loading="eager"`, deși e a doua secțiune (sub fold). Pe lângă ea, hero-ul randează DOUĂ imagini eager (desktop `/hero.png` + mobil `/hero-mobile.png`).

B. **Fă imaginea LCP mai ușoară** (rezolvă cei 1.350 ms). Sursele hero sunt PNG (grele); `hero-mobile.png` ajunge la ~37 KiB chiar și la q=60.

## FAZA 1 — Preload corect pentru imaginea LCP (cel mai mare câștig)

Alege UNA dintre abordări, ca imaginea LCP să fie preîncărcată și descoperită imediat după HTML:

- **Varianta recomandată (simplă):** înlocuiește `<img>`-ul manual din `HeroSection` cu componenta `next/image` `<Image priority sizes="100vw" fill />`. `priority` injectează automat `<link rel=preload>` corect (cu `imagesrcset`/`imagesizes`). Renunță la `getImageProps` pentru hero.
- **Varianta art-direction curată:** dacă păstrezi imagini diferite desktop/mobil, folosește un `<picture>` nativ cu `<source media="(max-width:767px)" srcset=...>` și `<source media="(min-width:768px)" srcset=...>` + un singur `<img fetchpriority="high" decoding="async">`, și adaugă manual în `<head>` (prin `generateMetadata`/`<link>`) un **preload doar pentru imaginea mobilă** (cea care e LCP pe telefoane), cu `media` și `imagesrcset`. Astfel browserul preîncarcă exact o singură imagine, cea corectă.

Obiectiv: în `view-source`/Network, imaginea LCP are un `<link rel=preload as=image>` și pornește în primele ~150 ms, nu la 1.050 ms.

**Acceptare:** „Întârzierea la încărcarea resursei" din defalcarea LCP scade sub ~200 ms.

## FAZA 2 — Oprește imaginile non-LCP să fure banda

- În `app/components/home-sections.tsx`, schimbă `loading="eager"` → `loading="lazy"` (sau elimină eager) pe TOATE imaginile care nu sunt hero-ul de deasupra foldului. Concret: imaginea mobilă din `PrimaryServicePaths` (~linia 150) și orice altă `/hero.png` decorativă din `ServicePath`/`ServicesMosaic`.
- Pe homepage, **doar** hero-ul (deasupra foldului) + logo-ul din navbar rămân prioritare. Restul: lazy.
- Asigură-te că varianta hero ascunsă pe viewport-ul curent NU se descarcă (cu `<picture>`/media, browserul ia o singură sursă).

**Acceptare:** pe mobil, în Network, înainte de LCP se încarcă doar: HTML, CSS critic, imaginea hero mobilă, logo-ul. Nu și `/hero.png` desktop sau imaginile din secțiunile de jos.

## FAZA 3 — Imagine LCP mai ușoară

- Re-exportă sursele hero din PNG într-un format potrivit pentru fotografii: ideal un **AVIF/WebP** de bază sau un JPEG bine comprimat în `public/` (PNG e nepotrivit pentru poze). next/image livrează oricum AVIF/WebP, dar pornind de la o sursă mai mică, rezultatul scade.
- Coboară `quality` pe hero la ~50 pentru mobil (perceptibil identic pe o fotografie de fundal întunecată) și verifică dimensiunile: pentru un telefon ~360 CSS px la 2x, 720–750 px e suficient.
- Adaugă `placeholder="blur"` (cu `blurDataURL`) pe hero pentru încărcare percepută mai bună (nu schimbă LCP-ul, dar îmbunătățește percepția).
- Țintă: imaginea LCP livrată **sub ~20 KiB**.

**Acceptare:** „Durata de încărcare a resursei" scade vizibil (sub ~700 ms pe 4G lent); auditul „Îmbunătățește livrarea imaginilor" dispare sau scade mult.

## FAZA 4 — Elimină CSS-ul care blochează redarea (~130 ms)

- Activează inlinierea CSS-ului critic în `next.config.ts`: `experimental: { inlineCss: true }` (Next 15.2+). Mută cele 15,3 KiB de CSS din calea critică (request blocant) în `<head>`, eliminând round-trip-ul.
- Verifică pe build că nu apar regresii de stil și că auditul „Solicitări de blocare a redării" dispare.

**Acceptare:** auditul render-blocking pentru chunk-ul CSS dispare; FCP rămâne ≤ 1 s.

## FAZA 5 — JavaScript vechi / polyfills

- Există deja `browserslist` în `package.json` (target browsere moderne). **Confirmă că e aplicat efectiv** la build (chunk-ul de ~14 KiB cu `Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `String.trimStart/End` ar trebui să dispară). Dacă persistă, întărește target-ul (ex. `Chrome >= 111, Safari >= 16, Firefox >= 111, Edge >= 111`) și asigură-te că nu există un `.browserslistrc` care îl suprascrie.
- Restul polyfill-urilor vin din **cookie-script.com** (terț, încărcat prin GTM) — nu le poți rescrie. Asigură-te doar că scriptul se încarcă **după consimțământ / non-blocant** (TBT e deja 0, deci OK) și că nu intră în calea critică a LCP.

**Acceptare:** chunk-ul de polyfills al aplicației dispare din build; bytes JS scad cu ~14 KiB.

## VERIFICARE & DEFINITION OF DONE

- `npx tsc --noEmit` + `npm run build` curat; pe build, homepage rămâne **static/ISR** (nu „ƒ Dynamic").
- Rulează Lighthouse mobil (4G lent) pe preview-ul Vercel după deploy:
  - **LCP < 2,5 s** (țintă ~2 s), din care întârzierea de pornire a imaginii < 200 ms și descărcarea < 700 ms.
  - **Performanță ≥ 95**, cu TBT 0 ms și CLS 0 păstrate.
- Confirmă în Network că se preîncarcă o singură imagine hero (cea corectă pentru viewport) și nicio imagine decorativă înainte de LCP.

═══ END PROMPT ═══

---

## Notă pentru tine (Arsene)

- **Cauza #1 a LCP-ului** e că hero-ul folosește `getImageProps` + `<img>` manual, ceea ce pierde preload-ul automat pe care `<Image priority>` îl pune singur. Asta singură explică ~1 secundă din întârziere. Faza 1 e prioritatea absolută.
- **Cauza #2** e o imagine decorativă de sub fold lăsată `loading="eager"` care fură banda pe 4G lent (Faza 2).
- Restul (imagine mai ușoară, inline CSS, polyfills) sunt câștiguri incrementale care te duc confortabil peste 95.
- Tot ce am schimbat eu data trecută (force-dynamic → ISR) a adus TTFB-ul la 120 ms, deci partea de server e deja rezolvată; acum e strict despre imaginea LCP din client.
