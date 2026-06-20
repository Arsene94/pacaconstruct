# Analiză completă: Performanță, Optimizare & Production-Readiness — PACA CONSTRUCT

> Audit profesional al proiectului `paca-construct` (Next.js 16.2 / React 19 / App Router / Supabase / Upstash / Vercel AI), pe axele non-SEO: rendering & caching, imagini/assets, Core Web Vitals, reziliență, securitate, observabilitate, accesibilitate, testare/CI și calitatea codului.
> Realizat pe codul existent la 20 iunie 2026. Complement al `ANALIZA-SEO-GEO.md`.

---

## 1. Rezumat executiv

Vestea bună: **acest proiect e construit profesionist**, mai bine decât majoritatea site-urilor de business. Are deja lucruri pe care multe echipe le ratează:

- **Caching distribuit corect**: `unstable_cache` cu tag-uri (`services`, `blog`, `rentals`, `faq`) + un **cache handler custom pe Upstash Redis** (partajat între instanțe serverless, defensiv la erori), plus invalidare pe tag-uri la fiecare mutație (`revalidateTag`/`revalidatePath`).
- **Securitate de bază solidă**: Data Access Layer (`dal.ts`) cu `getUser()` care validează token-ul (nu doar cookie-ul), `requireAdmin()`, RLS în Supabase, client admin separat (`service_role` doar pe server, `server-only`).
- **Rate limiting distribuit** (Upstash) pe formulare și pe auth, cu fail-open în dev.
- **Pipeline AI durabil**: cronul e doar dispecer (răspunde rapid), generarea rulează în workflow Upstash cu retry/DLQ și idempotency; cron protejat cu `CRON_SECRET`.

Prin urmare, acest audit NU e despre „reparat lucruri stricate", ci despre **ultima milă de hardening pentru producție** și despre **modernizarea către cele mai noi capabilități Next.js 16.2**. Cele mai importante:

1. **Migrare `unstable_cache` → `use cache` + `cacheTag`/`cacheLife` și activarea Partial Prerendering (PPR).** În 16.2 acestea sunt stabile; `unstable_cache` e **deprecat oficial**. PPR = shell static instant + găuri dinamice în streaming → câștig direct de LCP/TTFB.
2. **Lipsesc complet error/loading/not-found boundaries** — la prima eroare de runtime sau lipsă de date, utilizatorul vede pagina default Next, fără branding și fără recuperare.
3. **Zero headere de securitate** (CSP, HSTS, X-Frame-Options etc.).
4. **`next/image` fără `remotePatterns`** pentru imaginile din Supabase Storage → imagini neoptimizate → risc CWV.
5. **Formulare publice cu validare slabă și fără protecție anti-bot** (fără zod, fără honeypot/Turnstile, fără limite de lungime).
6. **Fără observabilitate** (error monitoring / analytics / RUM) și **fără teste / CI**.
7. **Câteva goluri de accesibilitate** (skip-link, reduced-motion, anunțarea erorilor, focus trap pe meniul mobil).

Praguri-țintă (Core Web Vitals 2026, percentila 75): **LCP < 2.5s, INP < 200ms, CLS < 0.1**. INP e cea mai greu de atins (43% din site-uri pică). Toate recomandările de mai jos sunt aliniate la aceste praguri.

---

## 2. Ce e deja bine (de păstrat, nu de atins)

| Zonă | Stare | Detaliu |
|------|-------|---------|
| Cache de date | ✅ Foarte bun | `unstable_cache` cu tag-uri + handler Upstash partajat + invalidare pe mutație |
| Auth & acces | ✅ Solid | DAL cu `getUser()` (validare token), `requireAdmin()`, RLS, client admin `server-only` |
| Rate limiting | ✅ Prezent | Upstash sliding window pe intake (5/10min) și auth (8/5min), fail-open în dev |
| Pipeline AI | ✅ Rezilient | Cron dispecer rapid + workflow durabil cu retry/DLQ + idempotency; protejat cu `CRON_SECRET` |
| Query-uri DB | ✅ Curat | Selecție pe coloane explicite (nu `select *`), `returns<T>()`, `maybeSingle` |
| Tipare | ✅ Bun | TypeScript `strict`, server-first, `server-only` pe module sensibile |

---

## 3. Probleme CRITICE / impact mare

### 3.1 Migrare la `use cache` + PPR (modernizare Next.js 16.2)
`app/data/*.ts` folosește `unstable_cache` — **deprecat în Next.js 16**. În 16.2 sunt stabile `use cache`, `cacheTag`, `cacheLife`, `updateTag`. Pe lângă faptul că eviți API deprecat, activarea `cacheComponents` aduce **Partial Prerendering** ca default: shell-ul static e servit imediat, iar părțile dinamice (ex. conținut din DB proaspăt) curg în streaming prin `Suspense`. Beneficiu: TTFB/LCP mai bune, exact ce cere pragul 2026.

> Notă: codul folosește deja `revalidateTag("services", "max")` (semnătura cu profil `cacheLife` din Next 16) — deci direcția e clară, doar stratul de citire trebuie modernizat. Conversia nu are codemod oficial; se face manual, pe repo.

### 3.2 Lipsă totală de error/loading/not-found boundaries
Nu există niciun `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`. Consecințe:
- Orice excepție în Server Component (ex. Supabase pică) → pagina default Next, fără branding, fără „încearcă din nou".
- `notFound()` e apelat în pagini, dar nu există `not-found.tsx` custom → 404 generic.
- Fără `loading.tsx`/`Suspense` → nicio stare de încărcare în streaming; navigarea pare „înghețată" pe conexiuni lente.

Necesar: `app/global-error.tsx`, `app/error.tsx`, `app/not-found.tsx`, plus `loading.tsx`/`Suspense` pe rutele cu fetch (servicii, blog, utilaje).

### 3.3 Headere de securitate absente
Nici în `next.config.ts`, nici în `proxy.ts` nu există headere de securitate. Lipsesc: `Content-Security-Policy` (ideal cu nonce), `Strict-Transport-Security` (HSTS), `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Impact: clickjacking, MIME sniffing, scurgeri de referrer, lipsă HSTS. Se adaugă via `headers()` în `next.config.ts` (sau în proxy pentru CSP cu nonce).

### 3.4 `next/image` fără `remotePatterns`
`next.config.ts` nu configurează `images.remotePatterns`, deși imaginile (servicii, utilaje, imaginile de blog generate de AI) sunt servite din **Supabase Storage** (bucket public `blog-images`, URL remote). Rezultat: fie eroare la runtime, fie imagini neoptimizate (fără resize/AVIF/WebP) → LCP slab. (Aceeași problemă apare și în auditul SEO — e prioritate dublă.)

### 3.5 Formulare publice: validare slabă + fără anti-bot
`app/actions/intake.ts` verifică doar prezența `name`+`phone`. Lipsesc: validare cu **zod** (e deja în proiect, folosit la AI, dar nu la formulare), limite de lungime, format telefon/email, sanitizare. **Nu există protecție anti-bot** (honeypot, Cloudflare Turnstile/hCaptcha). Formularele publice cu notificare pe email sunt ținte sigure de spam. În plus, erorile Supabase sunt „înghițite" (mesaj generic, fără logare) → debugging orb.

---

## 4. Probleme MAJORE

### 4.1 Observabilitate inexistentă
- **Fără error monitoring** (Sentry / equivalent) — doar `console.error` răzleț (9 apariții). În producție, erorile dispar.
- **Fără analytics / RUM** — niciun `@vercel/analytics` / `@vercel/speed-insights` / GA4. Nu poți măsura **Core Web Vitals reali** (de teren), nici comportamentul userilor. „Optimizare" fără măsurare = ghicit.
- Fără alerting/uptime.

### 4.2 Fără teste și fără CI/CD
Niciun test (unit/integration/e2e), niciun `.github/workflows`. Există `.playwright-mcp/` (urme de tooling), dar fără suită E2E. Lipsește un gate automat care să ruleze `tsc --noEmit`, `lint`, `build` și un smoke-test la fiecare push. Risc de regresii la un proiect care se dezvoltă rapid (mai ales cu conținut generat AI).

### 4.3 `generateStaticParams` absent
Rutele dinamice (`servicii/[slug]`, `blog/[slug]`, `inchiriere-utilaje/[slug]`) nu au `generateStaticParams` → randare on-demand la prima cerere în loc de pre-randare statică/ISR. Cu PPR + `generateStaticParams`, paginile devin instant.

### 4.4 Accesibilitate (a11y)
- **Fără skip-to-content link** — navigarea la tastatură trece prin tot meniul pe fiecare pagină.
- **`scroll-behavior: smooth` mereu activ** — ignoră `prefers-reduced-motion` (problemă vestibulară). Trebuie condiționat.
- **Erorile de formular nu sunt anunțate** — fără regiune `aria-live`, cititoarele de ecran nu aud mesajul de eroare/succes.
- **Meniul mobil**: blochează scroll-ul (bine), dar fără **focus trap**, fără închidere pe `Escape`, fără return-focus la buton.
- Label-urile de formular sunt implicite (input în `<label>`) — acceptabil, dar de standardizat cu `htmlFor`/`id` și `aria-describedby` pentru erori.
- De verificat contrastul paletei (olive/amber/stone) la AA.

### 4.5 Core Web Vitals — riscuri specifice
- **INP**: `navbar.tsx` e integral client component cu state și handlere; pe homepage e ok, dar de urmărit. Hidratarea fonturilor + meniul mega pot afecta INP. Recomandat: măsurare RUM + minimizarea JS client.
- **LCP**: hero are deja `priority`/`fetchPriority` (bine), dar imaginile remote neoptimizate (3.4) anulează avantajul.
- **CLS**: imaginile au `fill` + `sizes` (bine); de verificat fonturile (`next/font` are `display: swap`, dar `size-adjust`/fallback ajută la zero-CLS).

---

## 5. Probleme MEDII / calitate & DX

- **`tsconfig` target `ES2017`** — modernizează la `ES2022` (bundle mai mic, sintaxă nativă) acum că nu mai ții browsere vechi.
- **Trei familii de fonturi Google** (Manrope, Source Serif 4, Inter) — fiecare e cost de rețea/CLS. Reconsideră necesitatea celor trei.
- **ESLint**: `core-web-vitals` + `typescript` (bine), dar fără reguli stricte suplimentare și fără `eslint-plugin-jsx-a11y` explicit. Fără Prettier/format gate, fără pre-commit hooks (husky/lint-staged).
- **Indexuri DB**: de confirmat că există indexuri pe coloanele fierbinți (`slug`, `is_published`, `sort_order`, `blog_schedules.next_run_at`, `blog_topics.status/score`) — query-urile de cron filtrează pe ele.
- **Bundle**: dependențe grele (`ai` SDK, mai multe pachete Upstash) — de asigurat că rămân `server-only` și nu intră în bundle-ul client; util un bundle analyzer.
- **Imagini de debug în repo** (`service-image-check.png`, `service-noimage-check.png` ~1.4MB la rădăcină) — de scos din repo.
- **`.env.local` versionat?** — de confirmat că e în `.gitignore` (secretele nu trebuie să ajungă în git).

---

## 6. Prioritizare (impact / efort)

**Sprint 1 — Hardening esențial (impact mare, efort mic-mediu):**
`remotePatterns` imagini → headere de securitate → `error.tsx`/`global-error.tsx`/`not-found.tsx` → validare zod + honeypot/Turnstile pe formulare + logare erori → `@vercel/analytics` + `@vercel/speed-insights`.

**Sprint 2 — Modernizare rendering (impact mare pe CWV):**
migrare `unstable_cache` → `use cache`/`cacheTag`/`cacheLife` → activare `cacheComponents` (PPR) → `generateStaticParams` + `Suspense`/`loading.tsx` pe rutele dinamice.

**Sprint 3 — Reziliență & observabilitate:**
Sentry (sau echivalent) → alerting → confirmare retry/idempotency în pipeline-ul AI → indexuri DB.

**Sprint 4 — Accesibilitate & calitate:**
skip-link → reduced-motion → `aria-live` pe formulare → focus trap meniu mobil → contrast AA → CI (tsc+lint+build+Lighthouse CI) → husky/lint-staged → `tsconfig` ES2022.

---

## 7. Cum se verifică succesul

- **Lighthouse / PageSpeed Insights**: Performance ≥ 90, Accessibility ≥ 95, Best Practices 100; CWV „Good".
- **CrUX / Speed Insights (date de teren)**: LCP < 2.5s, INP < 200ms, CLS < 0.1 la percentila 75. Alerte la INP>160ms, LCP>2.0s, CLS>0.08.
- **Securitate**: scor A la securityheaders.com și Mozilla Observatory; CSP fără `unsafe-inline` necontrolat.
- **Reziliență**: simulează o eroare Supabase → vezi `error.tsx` branded cu „reîncearcă", nu pagina default.
- **CI**: pipeline verde (type-check + lint + build + e2e smoke) la fiecare PR.
- **a11y**: audit axe-core fără erori critice; navigare completă la tastatură; test cu cititor de ecran pe formulare.

---

*Următorul livrabil — `PROMPT-PERFORMANTA.md` — transformă acest audit într-un prompt unic, executabil, pe faze, cu convențiile Next.js 16.2 și criterii de acceptare.*
