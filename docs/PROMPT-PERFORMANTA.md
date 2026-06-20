# PROMPT MASTER — Performanță, Optimizare & Production-Readiness (PACA CONSTRUCT)

> Copiază tot ce e între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod (Claude Code) în repo-ul `paca-construct`.
> Complement al `PROMPT-SEO-GEO.md`. Execută pe faze, cu verificare după fiecare.

---

═══ START PROMPT ═══

## Rol & obiectiv

Ești inginer staff Next.js + SRE + specialist performanță web. Lucrezi în repo-ul `paca-construct` (Next.js 16.2, React 19, App Router, Server Components, Supabase, Upstash Redis/QStash/Workflow/Search, Vercel AI SDK, Resend, Tailwind 4, TypeScript strict; deploy pe Vercel).

**Obiectiv:** ridică proiectul la nivel **production-grade profesional**, aplicând cele mai noi capabilități Next.js 16.2 și standardele de performanță 2026. Țintă **Core Web Vitals 2026 (percentila 75): LCP < 2.5s, INP < 200ms, CLS < 0.1**. Hardening complet: reziliență, securitate, observabilitate, accesibilitate, testare/CI, calitatea codului.

**Ce e DEJA bine (NU strica, doar construiește peste):** cache de date cu tag-uri + cache handler Upstash custom + invalidare pe mutație; DAL securizat (`getUser()`/`requireAdmin()`); RLS; rate limiting Upstash; pipeline AI durabil (cron dispecer + workflow cu retry/DLQ, protejat cu `CRON_SECRET`); query-uri pe coloane explicite. Păstrează aceste tipare.

## Reguli de lucru OBLIGATORII

1. **Acest Next.js diferă de versiunile din training.** ÎNAINTE de cod, citește ghidurile din `node_modules/next/dist/docs/` — în special pentru `use cache`/`cacheLife`/`cacheTag`/`cacheComponents`, `generateStaticParams`, `error`/`global-error`/`not-found`/`loading` file conventions, `headers` în `next.config`, `next/image`. Respectă notele de deprecation.
2. **Nu regresa nimic.** După FIECARE fază rulează `npx tsc --noEmit`, `npm run lint`, `npm run build`. Nu continua cu erori. Verifică manual o navigare reală.
3. **Măsoară înainte și după.** Rulează Lighthouse (sau `next build` + analiză) pe paginile cheie înainte de optimizări, ca să ai bază de comparație.
4. **Schimbări mici, verificabile.** Commit per fază. Nu rescrie masiv codul funcțional existent.
5. **Nu introduce secrete în cod.** Tot prin env. Confirmă `.env.local` în `.gitignore`.
6. Livrează la final un raport cu fișiere modificate, rezultate Lighthouse înainte/după și pașii manuali rămași (conturi Sentry, Turnstile etc.).

---

## FAZA 1 — Imagini & assets (LCP)

1. **`next.config.ts` → `images.remotePatterns`**: adaugă host-ul Supabase Storage (din `NEXT_PUBLIC_SUPABASE_URL`) cu `pathname: "/storage/v1/object/public/**"`. Setează `images.formats: ["image/avif", "image/webp"]`. Verifică toate `<Image>` cu `src` remote.
2. Confirmă `priority`/`fetchPriority="high"` DOAR pe imaginea LCP (hero) și `loading="lazy"` (implicit) pe rest. Verifică `sizes` corecte pe toate imaginile `fill`.
3. Elimină imaginile de debug din rădăcină (`service-image-check.png`, `service-noimage-check.png`).
4. Fonturi: reevaluează cele 3 familii Google (Manrope, Source Serif 4, Inter). Păstrează `next/font` cu `display: "swap"` și adaugă `fallback`/`adjustFontFallback` pentru zero-CLS. Elimină familiile nefolosite.

**Acceptare:** imaginile remote se servesc optimizat (AVIF/WebP, resize); LCP pe home/servicii sub prag; fără imagini de debug în repo.

---

## FAZA 2 — Headere de securitate

În `next.config.ts`, adaugă `async headers()` care aplică pe toate rutele:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (și/sau `frame-ancestors 'self'` în CSP)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (ajustează la nevoie)
- `Content-Security-Policy`: pornește în `Report-Only`, permite explicit Supabase, Upstash, Vercel, Google Fonts, domeniile de imagini; țintește eliminarea `unsafe-inline`. Pentru JSON-LD/scripturi inline folosește **nonce** (generat în `proxy.ts`/middleware și propagat), nu `unsafe-inline`.

**Acceptare:** securityheaders.com → A; Mozilla Observatory bun; site-ul funcționează cu CSP (întâi Report-Only, apoi enforce).

---

## FAZA 3 — Reziliență: error / loading / not-found

1. `app/global-error.tsx` (prinde erori din root layout; include `<html><body>`), branded, cu buton „reîncearcă" (`reset()`).
2. `app/error.tsx` (Client Component) — fallback branded per segment, cu `reset()` și logare către monitoring (vezi Faza 5).
3. `app/not-found.tsx` — 404 branded, cu linkuri utile (servicii, contact). Asigură că `notFound()` din pagini îl folosește.
4. `loading.tsx` + `Suspense` pe rutele cu fetch (`/servicii/[slug]`, `/blog`, `/blog/[slug]`, `/inchiriere-utilaje`, `/inchiriere-utilaje/[slug]`) cu skeleton-uri (rezervă spațiu → zero CLS).
5. Opțional: error boundaries fine pe secțiuni care pot pica independent.

**Acceptare:** simulezi o eroare (ex. oprești Supabase) → vezi `error.tsx` branded, nu pagina default Next; 404 pe slug inexistent → `not-found.tsx`; navigare lentă → skeleton.

---

## FAZA 4 — Securitatea & robustețea formularelor

În `app/actions/intake.ts` (și acțiunile de auth):

1. **Validare cu `zod`** (deja în proiect): schema pentru fiecare formular — `name` (lungime min/max), `phone` (regex RO), `email` (opțional, format), limite de lungime pe toate textele. Respinge payload-uri invalide cu mesaje clare.
2. **Anti-bot**: adaugă un câmp **honeypot** (ascuns; dacă e completat → respinge silențios) ȘI integrează **Cloudflare Turnstile** (sau hCaptcha) cu verificare server-side a token-ului. Păstrează rate limiting-ul Upstash existent.
3. **Logare**: la eroare Supabase, loghează către monitoring (Faza 5) cu context (fără date personale sensibile), nu doar mesaj generic la user.
4. Confirmă `return=minimal` (deja corect pentru RLS anonim) și sanitizează inputurile stocate.

**Acceptare:** payload invalid/bot → respins; submit legitim → ok; spam-ul scade; erorile apar în monitoring.

---

## FAZA 5 — Observabilitate (monitoring + analytics + RUM)

1. **Error monitoring**: integrează **Sentry** pentru Next.js (sau echivalent) — server, client, edge; conectează la `error.tsx`/`global-error.tsx` și la `catch`-urile din pipeline-ul AI și acțiuni. Source maps la build.
2. **RUM / Core Web Vitals de teren**: adaugă `@vercel/speed-insights` și `@vercel/analytics` (sau GA4 prin `next/script strategy="afterInteractive"`). Respectă GDPR (consimțământ cookie dacă e cazul — vezi pagina de confidențialitate din promptul SEO).
3. **Logare structurată** pe server (înlocuiește `console.error` ad-hoc cu un logger mic, cu nivel + context).
4. Setează praguri de alertă: INP > 160ms, LCP > 2.0s, CLS > 0.08.

**Acceptare:** erorile reale apar în dashboard-ul de monitoring; CWV de teren vizibile; alertele configurate.

---

## FAZA 6 — Modernizare rendering: `use cache` + PPR (Next.js 16.2)

> `unstable_cache` e deprecat în Next 16. APIurile `use cache`, `cacheTag`, `cacheLife`, `updateTag` sunt stabile în 16.2. Nu există codemod oficial — migrare manuală, atentă.

1. Migrează `app/data/*.ts` de la `unstable_cache(fn, keys, { tags, revalidate })` la directiva **`'use cache'`** în corpul funcției + `cacheTag('services'|'blog'|'rentals'|'faq')` + `cacheLife({ revalidate, ... })` (sau profil predefinit). Păstrează aceleași tag-uri ca invalidarea din `app/actions/content.ts` să rămână validă.
2. Activează `cacheComponents: true` în `next.config.ts` (pornește `use cache` + `cacheLife`/`cacheTag` și **Partial Prerendering** ca default). Învelește părțile dinamice în `<Suspense>` ca shell-ul static să fie servit instant.
3. Verifică `revalidateTag(..., 'max')` / `updateTag()` pentru semantica read-your-writes în Server Actions (după mutații în admin).
4. Adaugă **`generateStaticParams`** la `servicii/[slug]`, `blog/[slug]`, `inchiriere-utilaje/[slug]` (slug-uri publicate) → pre-randare + ISR.
5. Confirmă că datele care depind de cookie-uri/request NU intră accidental sub `use cache` (folosește clientul Supabase public pentru citirile cache-uite, cum se face deja).

**Acceptare:** build fără API deprecat; PPR activ (shell static + streaming); paginile dinamice pre-randate; invalidarea pe tag-uri funcționează după edit în admin; TTFB/LCP îmbunătățite față de baza măsurată în Faza 0.

---

## FAZA 7 — Accesibilitate (WCAG 2.2 AA)

1. **Skip-to-content**: link „Sari la conținut" la începutul `body`, vizibil la focus, care duce la `<main id="main">`.
2. **Reduced motion**: în `globals.css`, mută `scroll-behavior: smooth` sub `@media (prefers-reduced-motion: no-preference)`; adaugă reguli care reduc animațiile pentru utilizatorii sensibili.
3. **Formulare**: leagă `<label htmlFor>`/`id`, adaugă `aria-describedby` pentru erori și o regiune **`aria-live="polite"`** care anunță mesajele de eroare/succes la cititoarele de ecran. Marchează câmpurile obligatorii (`required` + `aria-required`).
4. **Meniul mobil** (`navbar.tsx`): focus trap cât e deschis, închidere pe `Escape`, return-focus la butonul declanșator, `aria-modal`/roluri corecte.
5. **Contrast**: verifică paleta (olive/amber/stone pe limestone) la AA (4.5:1 text normal); ajustează unde pică.
6. Asigură stări de `:focus-visible` clare pe toate elementele interactive.

**Acceptare:** axe-core fără erori critice; navigare completă la tastatură; reduced-motion respectat; erori de formular anunțate vocal.

---

## FAZA 8 — Testare & CI/CD

1. **Type-check + lint + build** ca gate: script `npm run check` (`tsc --noEmit && eslint . && next build`).
2. **Teste**: unit (Vitest) pentru logica pură (`schedule.ts computeNextRun`, validări zod, parsere); E2E (Playwright) pentru fluxuri critice (submit formular contact/închiriere, navigare servicii/blog, 404). Există deja urme `.playwright-mcp/` — formalizează.
3. **GitHub Actions** (`.github/workflows/ci.yml`): rulează `check` + teste la fiecare PR/push; opțional **Lighthouse CI** cu praguri (Perf ≥ 90, a11y ≥ 95) și buget de performanță.
4. **Dependabot/renovate** + `npm audit` în CI pentru vulnerabilități.
5. **Pre-commit**: `husky` + `lint-staged` (lint + format pe fișierele atinse). Adaugă Prettier.

**Acceptare:** PR-urile trec printr-un pipeline verde; un test care pică blochează merge-ul; Lighthouse CI rulează pe preview.

---

## FAZA 9 — Calitate cod, DB & bundle

1. **`tsconfig`**: ridică `target` la `ES2022`.
2. **Bundle**: rulează `@next/bundle-analyzer`; confirmă că `ai` SDK și pachetele Upstash rămân **server-only** și nu intră în bundle-ul client; reduce JS client unde se poate (mai puține Client Components).
3. **Indexuri DB** (Supabase migrations): confirmă/adaugă indexuri pe `services(slug, is_published, sort_order)`, `blog_posts(slug, is_published, sort_order, published_at)`, `rental_machines(slug, is_published)`, `blog_schedules(is_active, next_run_at)`, `blog_topics(status, score)`. Verifică politicile RLS să nu facă scanări costisitoare.
4. **ESLint**: adaugă `eslint-plugin-jsx-a11y` (dacă nu e inclus) și reguli stricte rezonabile.
5. Curăță fișierele de debug și artefactele din repo; confirmă `.gitignore` (secrete, `.next`, build).

**Acceptare:** bundle client mai mic; fără server deps în client; query-uri rapide; `tsc`/lint curat.

---

## Livrabil final (ce raportezi)

1. Fișiere create/modificate, pe faze.
2. Lighthouse / PSI înainte vs. după (LCP, INP, CLS, scoruri) pe home + o pagină de serviciu + un articol.
3. Rezultat `npm run check` + teste verzi.
4. Scor securityheaders.com.
5. Pași manuali rămași: conturi Sentry, cheie Turnstile, activare Speed Insights/Analytics în Vercel, secrete în CI.

## Criterii globale de acceptare (Definition of Done)

- Imagini remote optimizate (AVIF/WebP); fără imagini de debug.
- Headere de securitate complete; scor A; CSP în enforce (fără `unsafe-inline` necontrolat).
- `error.tsx` + `global-error.tsx` + `not-found.tsx` branded; `loading.tsx`/`Suspense` pe rutele cu fetch.
- Formulare: validare zod + honeypot + Turnstile + rate limit; erori logate.
- Monitoring (Sentry) + RUM (Speed Insights/Analytics) active; alerte CWV setate.
- `unstable_cache` eliminat → `use cache`/`cacheTag`/`cacheLife`; `cacheComponents`/PPR activ; `generateStaticParams` pe rute dinamice.
- a11y: skip-link, reduced-motion, `aria-live`, focus trap meniu; axe-core fără erori critice.
- CI verde (type-check + lint + build + teste + Lighthouse CI).
- CWV de teren țintă: LCP < 2.5s, INP < 200ms, CLS < 0.1 (p75).

═══ END PROMPT ═══

---

## Note pentru tine (Arsene) — context, nu parte din prompt

- **Ordinea recomandată**: rulează întâi promptul ăsta de hardening SAU pe cel de SEO — nu contează strict, dar **Faza 6 (PPR)** e cea mai sensibilă; fă-o separat, cu măsurare înainte/după, și fii gata de rollback. Restul fazelor sunt independente și sigure.
- **Conturi externe necesare** (le pregătești tu): Sentry (sau alt monitoring), Cloudflare Turnstile (anti-bot), activare Speed Insights/Analytics în Vercel. Agentul le va lăsa ca `// TODO` cu chei din env.
- **Suprapunere cu promptul SEO**: `remotePatterns` și paginile legale (confidențialitate, pentru consimțământ analytics) apar în ambele — fă-le o singură dată.
- **Ce e deja excelent** și nu trebuie atins: caching-ul cu Upstash, DAL-ul, rate limiting-ul, pipeline-ul AI durabil. Promptul construiește peste ele, nu le rescrie.

### Surse (standarde 2026 folosite la audit)
- Core Web Vitals 2026 — praguri LCP < 2.5s, INP < 200ms, CLS < 0.1 (p75); INP cel mai greu de atins. — [corewebvitals.io](https://www.corewebvitals.io/core-web-vitals), [DigitalApplied: CWV Benchmarks 2026](https://www.digitalapplied.com/blog/core-web-vitals-benchmarks-2026-pass-rate-reference)
- Next.js 16 — `use cache`/`cacheTag`/`cacheLife`/`updateTag` stabile în 16.2, `unstable_cache` deprecat, Cache Components + PPR. — [Next.js 16 blog](https://nextjs.org/blog/next-16), [Migration playbook 15→16](https://www.digitalapplied.com/blog/next-js-15-to-16-migration-playbook-cache-components-2026)
