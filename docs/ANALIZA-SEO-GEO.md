# Analiză completă SEO & GEO — PACA CONSTRUCT

> Audit tehnic al proiectului `paca-construct` (Next.js 16.2.9 / React 19 / App Router / Supabase / Upstash / Vercel AI), realizat pe codul existent la 20 iunie 2026.
> Scopul: identificarea tuturor problemelor care împiedică indexarea, creșterea organică și citarea de către motoare de căutare **și** agenți AI / LLM (Google AI Overviews & AI Mode, ChatGPT, Perplexity, Claude, Gemini, Bing Copilot).

---

## 1. Rezumat executiv

Proiectul are o **fundație tehnică bună** (App Router, Server Components, conținut din DB, imagini `next/image`, HTML în mare parte semantic, un blog generat cu AI deja funcțional). Însă, din perspectivă SEO/GEO, site-ul este **aproape invizibil pentru crawlere și pentru LLM-uri**: lipsesc fișierele și semnalele fundamentale.

Cele mai grave probleme, pe scurt:

1. **Nu există `robots.txt` și nici `sitemap.xml`** — crawlerele nu primesc nicio direcție și nu au hartă a paginilor dinamice (servicii, blog, utilaje).
2. **Zero date structurate (Schema.org / JSON-LD)** pe tot site-ul — exact semnalul pe care Google și LLM-urile îl folosesc pentru a înțelege și cita un business local.
3. **Metadata minimă** — doar `title` + `description`. Lipsesc `metadataBase`, canonical, Open Graph, Twitter Card, `og:image`, icons, manifest, viewport/themeColor.
4. **Date de contact placeholder** (`+40 700 000 000`, fără adresă reală, fără CUI) — blochează schema `LocalBusiness` și distruge semnalele E‑E‑A‑T / încredere.
5. **`next/image` nu are `remotePatterns`** pentru imaginile din Supabase Storage — risc de erori și de optimizare ratată (impact direct pe Core Web Vitals).
6. **Paginile `/admin`, `/login`, `/auth` sunt indexabile** (fără `noindex`).
7. **Nicio măsurare**: fără Google Search Console, fără Bing Webmaster, fără analytics → creșterea organică nu poate fi nici verificată, nici optimizată.

Nuanță importantă (ghidul Google din mai 2026): **„optimizarea pentru AI este în continuare SEO”**. Nu există un truc separat de „GEO”. Câștigă conținutul care: (a) e solid din punct de vedere tehnic, (b) are date structurate, (c) demonstrează E‑E‑A‑T (experiență reală, autoritate, încredere), (d) răspunde direct la întrebări (answer‑first). Acest audit acoperă toate aceste straturi.

---

## 2. Inventarul proiectului (ce există acum)

**Pagini publice (indexabile):**

| Rută | Tip | Metadata actuală | Date structurate |
|------|-----|------------------|------------------|
| `/` | Home (Server) | doar din root layout | ❌ |
| `/servicii/[slug]` | Serviciu (dinamic, din DB) | `generateMetadata`: title+description | ❌ |
| `/inchiriere-utilaje` | Listă utilaje | title+description | ❌ |
| `/inchiriere-utilaje/[slug]` | Utilaj (dinamic) | `generateMetadata`: title+description | ❌ |
| `/blog` | Listă articole | title+description | ❌ |
| `/blog/[slug]` | Articol (dinamic, AI) | `generateMetadata`: title+description | ❌ |
| `/faq` | Întrebări frecvente | title+description | ❌ (ratează FAQPage!) |
| `/contact` | Contact | title+description | ❌ |

**Pagini care NU ar trebui indexate, dar sunt:** `/admin/**`, `/login`, `/login/recovery`, `/login/update-password`, `/auth/callback`.

**Model de date (foarte favorabil pentru Schema.org):**

- `services`: `title`, `description`, `processes[]`, `specs[]`, `image_src/alt` → ideal pentru `Service`.
- `blog_posts`: `title`, `excerpt`, `body`, `category`, `tags[]`, `image`, `sources[]`, `published_at` (timestamptz în DB!), `updated_at` → ideal pentru `BlogPosting`/`Article`.
- `rental_machines`: `title`, `price`, `specs[]`, `uses[]`, `image` → ideal pentru `Product`/`Offer`.
- `faq_sections` + `faq_items`: `question`/`answer` → ideal pentru `FAQPage`.

**Infrastructură deja prezentă și utilă:** Upstash Search (backend de căutare → permite `WebSite` + `SearchAction`), `NEXT_PUBLIC_SITE_URL` deja prevăzut în `.env.example` (`https://www.pacaconstruct.ro`), generare automată de blog (cron zilnic) — un motor de conținut care, corect optimizat, devine principalul activ GEO.

---

## 3. Probleme CRITICE (blochează indexarea / citarea)

### 3.1 Lipsește `robots.txt`
Nu există `app/robots.ts` și nici fișier static. Crawlerele (Googlebot, Bingbot) și boții AI (GPTBot, ClaudeBot, PerplexityBot, Google‑Extended) nu primesc nicio regulă și nu află de sitemap. Trebuie `app/robots.ts` care: permite indexarea publicului, **interzice** `/admin`, `/login`, `/auth`, `/api`, și **indică explicit** sitemap‑ul.

### 3.2 Lipsește `sitemap.xml`
Nu există `app/sitemap.ts`. Paginile dinamice (zeci de servicii/articole/utilaje din DB) nu au cale de descoperire structurată. Trebuie **sitemap dinamic** care interoghează Supabase și listează toate rutele publicate, cu `lastModified` din `updated_at`.

### 3.3 Zero date structurate (JSON‑LD) pe tot site-ul
`grep` confirmă: niciun `application/ld+json`, niciun `schema.org`. Acesta este cel mai mare deficit GEO. Lipsesc, în ordinea impactului:

- `Organization` + `LocalBusiness` (global, în layout) — **esențial** pentru un business local de construcții; e exact ce extrag AI Overviews pentru citare.
- `FAQPage` pe `/faq` — câștig imediat de vizibilitate (rich results + citare AI).
- `Service` pe `/servicii/[slug]`.
- `Product` + `Offer` pe `/inchiriere-utilaje/[slug]`.
- `BlogPosting`/`Article` pe `/blog/[slug]`.
- `BreadcrumbList` (breadcrumb-uri vizuale există deja, dar fără schema).
- `WebSite` + `SearchAction` (există backend de search).
- `ItemList` pe paginile de listă (blog, utilaje, servicii).

### 3.4 `metadataBase` absent
Root layout (`app/layout.tsx`) nu setează `metadataBase`. Fără el, orice câmp URL (canonical, `og:image`) ar fi relativ/rupt și Next.js dă eroare de build dacă se folosesc căi relative. Trebuie setat din `NEXT_PUBLIC_SITE_URL`.

### 3.5 Imagini remote neconfigurate în `next/image`
`next.config.ts` NU are `images.remotePatterns`, deși imaginile (servicii, utilaje, imaginile de blog generate de AI) vin din **Supabase Storage** (bucket public, URL remote). Consecințe: fie eroare la runtime, fie imagini neoptimizate → LCP slab → penalizare Core Web Vitals (factor de ranking). Trebuie adăugat host‑ul Supabase la `remotePatterns`.

### 3.6 Pagini private indexabile
`/admin/**`, `/login*`, `/auth/callback` nu au `robots: { index: false }`. Proxy‑ul protejează accesul, dar Google poate indexa URL‑urile (ex. pagina de login). Trebuie `noindex` la nivel de metadata + `Disallow` în robots.

---

## 4. Probleme MAJORE (limitează puternic performanța organică / GEO)

### 4.1 Open Graph / Twitter / `og:image` complet absente
Nicio pagină nu are `openGraph` sau `twitter`. La distribuire (WhatsApp — folosit în site, Facebook, LinkedIn, X) și în preview‑urile generate de LLM-uri, paginile apar fără imagine și fără titlu bogat. Lipsește și o imagine OG implicită (`opengraph-image`) + una dinamică per articol/serviciu/utilaj.

### 4.2 Date NAP placeholder (Name, Address, Phone)
Telefon `+40 700 000 000`, emailuri generice, „București / servicii naționale”, fără adresă, fără CUI/Reg. Com. Pentru `LocalBusiness` și pentru E‑E‑A‑T (încredere), aceste date trebuie să fie **reale și consistente** pe tot site-ul (footer, contact, schema, Google Business Profile). Trebuie centralizate într-un singur `site-config`.

### 4.3 Fără semnale E‑E‑A‑T
- Blogul (generat AI) nu are autor, bio, „reviewed by”, dată vizibilă lizibilă. Google tratează AI content acceptabil **doar** cu E‑E‑A‑T clar.
- Nu există pagină „Despre noi” / „Echipă” / proiecte realizate cu dovezi (portofoliu, ani de experiență, certificări) — exact „first‑hand experience”, cel mai puternic factor de vizibilitate în AI.
- Linkurile „Politica de confidențialitate” și „Termeni” din footer duc la `#` (pagini inexistente) — semnal negativ de încredere + problemă GDPR (RO/UE).

### 4.4 Date de blog ne‑mașinabile
Tipul public `BlogPost` expune doar `published_label` (string de afișare), nu data ISO. În DB există `published_at`/`updated_at` (timestamptz), dar nu sunt expuse stratului public. Pentru `datePublished`/`dateModified` în schema și pentru `<time datetime>`, trebuie expuse datele ISO.

### 4.5 SEO local 2026 insuficient
Conform ghidurilor 2026, „acoperim toată țara” nu mai e suficient. Pentru interogări locale („excavări [oraș]”, „închiriere buldoexcavator [zonă]”) sunt necesare **pagini de zonă de serviciu** substanțiale (conținut unic per localitate/județ, schema `areaServed`, hartă). Acum nu există nicio pagină de acest tip.

### 4.6 Multiple `<h1>` pe `/contact`
Pagina de contact randează **două** elemente `<h1>` cu același text (varianta mobil + desktop, ambele în DOM). Ideal un singur `<h1>` per pagină, comutat prin CSS, nu duplicat ca element.

---

## 5. Probleme MEDII (optimizări de calitate)

- **Diacritice lipsă în conținutul vizibil** („terasamente”, „amenajari”, „excavari” fără ă/â/î/ș/ț). Google indexează ambele forme, dar textul corect cu diacritice îmbunătățește relevanța pentru limba română, claritatea pentru LLM-uri și percepția de profesionalism (E‑E‑A‑T). De evaluat la nivel de conținut din DB.
- **`WebSite` + `SearchAction`** lipsă, deși există infrastructură de căutare (Upstash) — ratează sitelinks search box.
- **Fără `generateStaticParams`** pentru servicii/blog/utilaje → paginile dinamice nu sunt pre‑randate static; impact pe performanță și pe predictibilitatea crawl‑ului.
- **Trei familii de fonturi Google** (Manrope, Source Serif 4, Inter) — `next/font` are `display: swap` implicit (bine), dar 3 familii cresc payload‑ul; de reconsiderat.
- **Listare fără paginare/canonical** pe blog când va crește volumul (cronul adaugă zilnic articole) — de planificat paginare + `rel=next/prev` logic / canonical.
- **Alt text**: imaginile decorative au corect `alt=""`; imaginile de conținut (utilaje, articole) folosesc `image_alt` din DB — de asigurat că e mereu completat (validare în admin).

---

## 6. Strat GEO / AI-specific (cele mai noi standarde, iunie 2026)

- **`robots.ts` trebuie să permită explicit boții AI** pe care îi vrei drept surse: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI), `ClaudeBot`, `Claude-User`, `anthropic-ai` (Anthropic), `PerplexityBot`, `Perplexity-User`, `Google-Extended` (Gemini/Vertex), `Applebot-Extended`, `Bingbot`/`Microsoft` (Copilot), `CCBot` (Common Crawl). Decizia ta: pentru vizibilitate maximă în LLM-uri, le **permiți**.
- **Structură answer‑first**: pentru fiecare pagină de serviciu/articol, primul paragraf trebuie să răspundă direct la întrebarea-țintă (LLM-urile extrag de sus). FAQ-urile și blogul sunt vehiculul ideal.
- **`llms.txt` — opțional, impact nedovedit.** Google a confirmat oficial (2026) că `llms.txt` **nu** influențează AI Overviews, iar niciun furnizor major (OpenAI, Google, Anthropic, Meta) nu îl citește în producție. Adoptare ~10%. Recomandare: îl poți adăuga (cost minim, inofensiv) pentru completitudine și pentru tooling de developeri, dar **nu** ca pârghie SEO. Prioritate joasă.
- **Multimodal**: AI surfacing favorizează imagini/video. `og:image` per pagină + alt text descriptiv ajută și aici.
- **`sameAs` / entitate**: legarea Organization de Google Business Profile, Facebook, Instagram, LinkedIn prin `sameAs` ajută LLM-urile să recunoască entitatea „PACA CONSTRUCT”.

---

## 7. Performanță & măsurare

- **Core Web Vitals**: rezolvă `remotePatterns` (4.x), asigură `priority` pe LCP (hero are deja), `sizes` corecte (în mare ok), și pre-randare statică.
- **Google Search Console + Bing Webmaster Tools**: neconfigurate. Necesită verificare (meta tag prin `metadata.verification` sau DNS) + trimiterea sitemap‑ului. Fără GSC nu poți confirma indexarea, nu vezi interogările, nu măsori creșterea.
- **Analytics**: niciun GA4 / Vercel Analytics / Plausible. Fără măsurare, „creșterea organică” e oarbă.
- **Google Business Profile**: separat de cod, dar esențial pentru SEO local + AI Overviews (sursă primară de NAP, recenzii, hartă). De creat și legat prin `sameAs`/`hasMap`.

---

## 8. Prioritizare (ce aduce cel mai mult, cel mai repede)

**Sprint 1 — Fundație tehnică (obligatoriu, impact maxim):**
`site-config` centralizat (NAP + URL) → `metadataBase` + Open Graph/Twitter în root → `robots.ts` → `sitemap.ts` dinamic → `remotePatterns` → `noindex` pe admin/login → `manifest.ts` + icons + `opengraph-image`.

**Sprint 2 — Date structurate (impact GEO maxim):**
`Organization`/`LocalBusiness` global → `FAQPage` → `Service` → `Product/Offer` → `BlogPosting` → `BreadcrumbList` → `WebSite/SearchAction` → `ItemList`.

**Sprint 3 — Conținut & E‑E‑A‑T:**
date NAP reale → pagini „Despre/Echipă/Portofoliu” → autor blog + date ISO → pagini „Politică de confidențialitate”/„Termeni” → fix dublu `<h1>` → answer‑first → diacritice.

**Sprint 4 — Local + măsurare:**
pagini zonă de serviciu → GSC + Bing + sitemap submit → GA4/Vercel Analytics → Google Business Profile + `sameAs`.

**Opțional (prioritate joasă):** `llms.txt`.

---

## 9. Cum se verifică succesul

- **Google Rich Results Test** și **Schema Markup Validator** → fără erori pe fiecare tip de schema.
- **`npm run build`** fără erori de metadata; verificare `view-source` că JSON-LD și OG apar în HTML‑ul randat pe server.
- **Lighthouse SEO ≥ 100** și CWV „Good” pe pagini cheie.
- **GSC**: sitemap „Success”, pagini „Indexed”, apariție în Performance.
- **Test real**: întrebări în ChatGPT/Perplexity/Google AI Mode de tip „închiriere buldoexcavator cu operator [zonă]” → site-ul apare/este citat.

---

*Următorul livrabil — `PROMPT-SEO-GEO.md` — transformă acest audit într-un prompt unic, executabil, cu toate fișierele, convențiile Next.js 16 și criteriile de acceptare.*
