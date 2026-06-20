# PROMPT — Pagină admin „Setări" + Floating Buttons (PACA CONSTRUCT)

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod în repo-ul `paca-construct`.
> Adaugă o pagină de setări în admin (telefoane multiple, WhatsApp per număr, butoane flotante pe site + alte setări relevante), editabile la runtime, cu `siteConfig` ca fallback.

---

═══ START PROMPT ═══

## ROL & OBIECTIV

Ești inginer senior Next.js. Adaugi în `paca-construct` un **sistem de setări de site editabile din admin**, persistente în Supabase, care înlocuiește datele de contact hardcodate. Cerințe explicite:

1. **Pagină de admin „Setări".**
2. **Număr(e) de telefon — multiple**, fiecare cu/ fără **WhatsApp** (toggle individual).
3. **Butoane flotante (floating buttons)** pe site public (apel + WhatsApp + scroll-to-top), configurabile.
4. **Alte setări relevante** (program, social/sameAs, bară de anunț, adresă/hartă etc.).

Totul type-safe, cu RLS, cache + revalidare, accesibil, în stilul existent.

## CONTEXT EXACT AL REPO-ULUI (respectă)

- **Stack:** Next.js 16.2 (App Router, Server Components), React 19, Supabase, Upstash, Tailwind 4, TS `strict`.
- **Sursă de adevăr STATICĂ existentă:** `app/lib/site-config.ts` exportă `siteConfig` (un singur telefon: `phone`, `phoneDisplay`, `whatsapp`, plus `email`, `emailOffice`, `address{}`, `geo{}`, `mapUrl`, `openingHours[]`, `areaServed[]`, `social{googleBusiness,facebook,instagram,linkedin}`, `colors`, etc.) + helperii `absoluteUrl()`, `sameAs()`, `addressLine()`. **Trateaz-o ca DEFAULTS/fallback** — setările din DB le suprascriu la runtime.
- **Încă hardcodate (de înlocuit cu setări):** `tel:+40700000000` și `https://wa.me/40700000000` în `app/components/navbar.tsx` (bara de sus), `app/components/home-sections.tsx` (`ContactCta`), `app/contact/page.tsx`. Bara de sus din navbar are și textul fix „Evaluare si ofertare pentru proiectul tau" → devine „announcement" editabil.
- **Admin:** pagini sub `app/admin/*` (Server Components) folosind kit-ul `app/admin/admin-ui.tsx` (`AdminContent`, `PageHeader`, `TableCard`, `Toolbar`, `Th`, `StatusBadge`, `PrimaryLinkButton`...) + `app/admin/form-ui.tsx` + `app/admin/form-client.tsx`. Acțiunile sunt în `app/actions/*.ts`, încep cu `await requireAdmin()` (din `@/app/lib/dal`), apoi `revalidatePath/revalidateTag(tag, "max")`.
- **Navigația admin:** `app/admin/admin-nav.tsx` — există deja item-ul `{ label: "Setări", icon: "settings", href: "#" }` în `utilityNavItems`. **Schimbă `href` în `/admin/settings`** și adaugă eticheta în `breadcrumbLabels`.
- **Convenții DB:** migrări în `supabase/migrations/` (`YYYYMMDDNNNNNN_nume.sql`); RLS prin funcția `public.is_admin()`; trigger `public.set_updated_at()`; `service_groups` are citire publică (`using (true)`) + CRUD admin — folosește același tipar.
- **Clienți Supabase:** `server.ts` (cookies), `admin.ts` (service_role), `public.ts` (anon, pentru citiri cache-uite). Cache de date în `app/data/*.ts` cu `unstable_cache` + tag-uri.
- **Pagini publice** montează `<Navbar serviceGroups={...} />` și `<Footer />` individual (nu există layout public partajat). **Root layout** `app/layout.tsx` e Server Component (randează `<html><body>{children}`).

## REGULI OBLIGATORII

1. Citește docs Next 16 din `node_modules/next/dist/docs/` înainte de cod (server actions, route segment config, revalidate). Respectă convențiile reale.
2. Nu rupe nimic: dacă nu există rând de setări în DB → folosește `siteConfig` (fallback total). Site-ul trebuie să funcționeze identic înainte de prima salvare.
3. **Nu pune secrete în tabelul de setări** (e citit public). Datele de notificare/cheile rămân în env.
4. Validare cu **zod** pe toate acțiunile; `requireAdmin()` pe tot ce scrie.
5. Accesibilitate WCAG AA pe butoanele flotante (focus, aria, tastatură, reduced-motion, safe-area).
6. După fiecare fază: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Commit per fază.

---

## FAZA 1 — Schema DB + RLS + seed

Creează `supabase/migrations/<timestamp>_site_settings.sql`. Un **singur rând** (singleton), cu coloane `jsonb` pe secțiuni (salvare independentă, validată per-secțiune cu zod):

```sql
create table public.site_settings (
  id           smallint primary key default 1,
  phones       jsonb not null default '[]',   -- PhoneNumber[]
  contact      jsonb not null default '{}',   -- { emailPrimary, emailOffice, address{...}, geo{...}, mapUrl }
  hours        jsonb not null default '[]',   -- OpeningHours[]
  social       jsonb not null default '{}',   -- { googleBusiness, facebook, instagram, linkedin, tiktok, youtube }
  floating     jsonb not null default '{}',   -- FloatingConfig
  announcement jsonb not null default '{}',   -- { enabled, text, href }
  updated_at   timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings enable row level security;
create policy "site_settings public read" on public.site_settings for select using (true);
create policy "site_settings admin insert" on public.site_settings for insert with check (public.is_admin());
create policy "site_settings admin update" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed: un rând id=1 inițializat din valorile actuale (poate rămâne gol; appul cade pe siteConfig).
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
```

Forma `PhoneNumber` (documenteaz-o în cod):

```ts
type PhoneNumber = {
  id: string; // uuid/nanoid generat la adăugare
  label: string; // „Dispecerat", „Birou", „Vânzări"
  e164: string; // „+40712345678" (pentru tel:)
  display: string; // „+40 712 345 678" (afișare)
  whatsapp: boolean; // are WhatsApp?
  whatsappMessage?: string; // mesaj pre-completat (opțional)
  isPrimary: boolean; // numărul principal (exact unul true)
  showInFloating: boolean; // apare în butonul flotant
  order: number;
};
```

**Acceptare:** migrarea rulează; anonimul poate CITI setările, doar adminul scrie; rândul singleton există.

---

## FAZA 2 — Strat de date (`app/data/settings.ts`)

- Definește tipurile: `PhoneNumber`, `OpeningHours`, `FloatingConfig`, `Announcement`, `ResolvedSettings`.
- `getSiteSettings(): Promise<ResolvedSettings>` — citește rândul (client `public.ts`, **cache-uit** cu tag `"settings"`, revalidate rezonabil), apoi **merge peste `siteConfig`** (DB câștigă unde e setat; altfel default din `siteConfig`). Dacă `phones` e gol → sintetizează un `PhoneNumber` din `siteConfig.phone/whatsapp` (compat).
- Helperi: `getPrimaryPhone(s)`, `getWhatsAppPhones(s)`, `waLink(phone)` → `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, `telLink(phone)` → `tel:${e164}`.
- `getSettingsAdmin()` — rândul brut pentru editare în panou.

`FloatingConfig` (default sensibil):

```ts
type FloatingConfig = {
  enabled: boolean; // default true
  position: "right" | "left"; // default "right"
  channels: { whatsapp: boolean; call: boolean; scrollTop: boolean; email: boolean };
  showOnMobile: boolean; // default true
  showOnDesktop: boolean; // default true
  expandLabels: boolean; // etichete la hover
  whatsappPhoneId?: string; // implicit: primul telefon cu whatsapp / primary
  callPhoneId?: string; // implicit: primary
};
```

**Acceptare:** `getSiteSettings()` întoarce mereu un obiect complet și corect, și fără rând în DB (fallback siteConfig).

---

## FAZA 3 — Acțiuni server (`app/actions/settings.ts`)

Toate încep cu `await requireAdmin()`, validează cu **zod**, fac `upsert` pe `id=1` (doar coloana secțiunii editate), apoi `revalidateTag("settings", "max")` + `revalidatePath("/", "layout")` (reîmprospătează chrome-ul public peste tot):

- `updatePhones(phones)` — validează: exact un `isPrimary`, `e164` format internațional (regex), `display` ne-gol; normalizează ordinea.
- `updateContactSettings(contact)` — emailuri (format), adresă, `mapUrl` (URL), geo (numeric).
- `updateHours(hours)`.
- `updateSocial(social)` — fiecare URL valid sau gol.
- `updateFloatingSettings(floating)`.
- `updateAnnouncement(announcement)`.

**Acceptare:** salvările persistă pe secțiuni independente; validările resping date invalide cu mesaje clare; site-ul public se actualizează imediat după salvare.

---

## FAZA 4 — Pagina de admin `/admin/settings`

Creează `app/admin/settings/page.tsx` (Server Component; `getSettingsAdmin()`) + componente client de formular (`settings-forms.tsx`), folosind kit-ul `admin-ui`/`form-ui`. Organizează în **secțiuni** (carduri/taburi):

1. **Telefoane & WhatsApp** (cerința principală): listă **repetabilă** de numere. Pentru fiecare rând: `label`, `număr (E.164)`, `afișare`, **toggle „WhatsApp"**, câmp opțional „mesaj WhatsApp pre-completat", radio „principal", toggle „arată în butonul flotant", reordonare (sus/jos). Butoane „Adaugă număr" / „Șterge". Un singur „principal".
2. **Butoane flotante:** toggle „Activează", poziție (stânga/dreapta), canale (WhatsApp / Apel / Scroll-sus / Email — checkbox-uri), „arată pe mobil", „arată pe desktop", „etichete la hover", select „număr pentru WhatsApp" și „număr pentru apel" (din lista de telefoane). **Preview live** mic al stack-ului de butoane.
3. **Contact & locație:** email principal, email office, adresă (stradă, oraș, județ, cod poștal), link hartă (`mapUrl`), geo (lat/lng).
4. **Program (opening hours):** rânduri pe zile cu deschidere/închidere + etichetă; toggle „Închis" pe zi.
5. **Social (`sameAs`):** Google Business, Facebook, Instagram, LinkedIn, TikTok, YouTube.
6. **Bară de anunț:** toggle + text + link opțional (alimentează bara de sus din navbar).

Fiecare secțiune salvează independent (acțiunea ei). Wire: în `app/admin/admin-nav.tsx` schimbă `Setări` `href` în `/admin/settings` și adaugă în `breadcrumbLabels` `"/admin/settings": "Setări"`. Adaugă `metadata` (`robots:{index:false}` e moștenit din admin layout).

**Acceptare:** poți adăuga/șterge/reordona numere, comuta WhatsApp per număr, seta principalul, configura butoanele flotante și restul — totul persistă și se reflectă pe site.

---

## FAZA 5 — Componenta Floating Buttons (site public)

Creează `app/components/floating-buttons.tsx` (**Client Component**), primește `settings: ResolvedSettings` ca prop. Comportament:

- Randează un **stack de butoane flotante** în colțul configurat (default dreapta-jos): **WhatsApp** (verde brand sau olive/amber), **Apel** (`tel:`), opțional **Scroll-to-top** (apare după scroll) și **Email**.
- Dacă există mai multe numere cu `showInFloating`, butonul principal deschide un **mic meniu** cu numerele etichetate (apel + WhatsApp per număr); altfel acțiune directă pe numărul principal.
- **WhatsApp**: `https://wa.me/<digits>?text=<encoded>` (din `whatsappMessage` sau un default „Bună ziua, aș dori o ofertă pentru…"). **Apel**: `tel:<e164>`. `target="_blank" rel="noopener noreferrer"` pe WhatsApp.
- **Accesibilitate:** `aria-label` pe fiecare buton, `:focus-visible` clar, navigare la tastatură, meniul cu `aria-expanded`/`Escape`/return-focus, `role` corect.
- **Mobil:** respectă `env(safe-area-inset-bottom)`, dimensiuni ≥ 44px, nu acoperă CTA-uri esențiale; `showOnMobile`/`showOnDesktop` controlează vizibilitatea (Tailwind responsive).
- **Mișcare:** animație de intrare discretă, dezactivată sub `@media (prefers-reduced-motion: reduce)`.
- **Brand:** stil consistent (olive `#1e2a20` / amber `#d88a24`), borduri subțiri, fără umbre stridente.
- **Ascundere pe zone private:** folosește `usePathname()` și **return null** pe `/admin`, `/login`, `/auth`.
- Atribute `data-*` pentru analytics (ex. `data-cta="whatsapp-float"`).

**Montare globală:** în `app/layout.tsx` (Server Component) apelează `getSiteSettings()` și randează `<FloatingButtons settings={settings} />` chiar înainte de `</body>`, după `{children}`. (Guard-ul de pathname din componentă îl ascunde pe admin/login.)

**Acceptare:** butoanele apar pe tot site-ul public (nu pe admin/login), respectă config-ul (canale, poziție, mobil/desktop), apelul și WhatsApp funcționează cu numărul corect, accesibile și cu reduced-motion respectat.

---

## FAZA 6 — Înlocuirea valorilor hardcodate + legături

- **Navbar** (`app/components/navbar.tsx`): bara de sus citește telefonul principal + WhatsApp din setări și textul din `announcement` (ascunde bara dacă `announcement.enabled=false`). Primește `settings` (sau doar feliile necesare) ca prop nou — paginile care montează `<Navbar/>` îi pasează `settings` (fetch din `getSiteSettings()`, cache-uit, ieftin). Aplică la fel pentru `Footer` și `ContactCta` (`home-sections.tsx`) și `app/contact/page.tsx`.
- Evită prop-drilling masiv: paginile sunt deja Server Components ce fac fetch — adaugă `getSiteSettings()` și pasează `settings` la `Navbar`/`Footer`/CTA. (Alternativ acceptabil: un mic Server Component `SiteChrome` care le compune.)
- **JSON-LD / SEO:** acolo unde schema `LocalBusiness`/Organization folosește telefon/program/social/hartă, **citește din `getSiteSettings()` (resolved)**, nu doar din `siteConfig` static, ca datele editate în admin să apară în structured data. Telefon = `getPrimaryPhone()`, `sameAs` = din `social`, `openingHoursSpecification` = din `hours`, `hasMap` = `mapUrl`.

**Acceptare:** nicăieri nu mai există `+40700000000` / `wa.me/40700000000` hardcodat; tot vine din setări; JSON-LD reflectă datele editate.

---

## FAZA 7 — Verificare

- Fără rând în DB → site identic cu azi (fallback `siteConfig`).
- Adaugi 2 numere (unul cu WhatsApp, unul fără), setezi principalul → bara navbar, footer, pagina contact și butoanele flotante arată corect.
- Floating buttons: testează poziție, canale, mobil/desktop, meniul multi-număr, a11y (tastatură + screen reader), reduced-motion.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` curate.
- Rich Results Test: telefon/program/sameAs din schema reflectă setările.

## LIVRABIL FINAL

Fișiere create/modificate (migrare, `data/settings.ts`, `actions/settings.ts`, `admin/settings/*`, `floating-buttons.tsx`, wiring), variabile env (niciuna nouă necesară), output build/lint/tsc, listă valori `// TODO` rămase (date reale).

## CRITERII GLOBALE DE ACCEPTARE (Definition of Done)

- Pagină `/admin/settings` funcțională, link „Setări" activ în nav.
- Telefoane **multiple**, fiecare cu toggle **WhatsApp** + mesaj opțional + principal + „arată în flotant".
- **Floating buttons** pe tot site-ul public (apel + WhatsApp + scroll-top), configurabile, accesibile, ascunse pe admin/login.
- Setări adiționale: contact/adresă/hartă, program, social (sameAs), bară de anunț.
- DB-backed cu fallback `siteConfig`; RLS (public read, admin write); cache + revalidare la salvare.
- Zero date de contact hardcodate; JSON-LD citește setările live.
- `tsc`/`lint`/`build` curat; a11y AA pe butoane.

═══ END PROMPT ═══

---

## Note pentru tine (Arsene)

- **De ce DB, nu doar `site-config.ts`:** ai cerut editare din admin → setările trebuie să fie la runtime în DB. `siteConfig` rămâne ca **fallback/seed**, deci nimic nu se strică dacă tabelul e gol.
- **Telefoane multiple cu WhatsApp per număr** e modelat ca array `PhoneNumber[]` — fiecare cu toggle WhatsApp, mesaj pre-completat, „principal" și „arată în flotant". Exact ce ai cerut.
- **Alte setări incluse** (relevante pentru un business local): program, social (`sameAs` — ajută și SEO/GEO), adresă + hartă (`hasMap`), bară de anunț. Le poți extinde ușor (sunt jsonb).
- **Legătură cu celelalte prompturi:** setările alimentează JSON-LD-ul din `PROMPT-SEO-GEO.md` (telefon/program/social/hartă devin editabile) și footerul email-urilor din sistemul de email. Recomand să rulezi acest prompt după ce SEO `site-config` e deja în loc (este).
- **Opțional (fază viitoare):** „mod mentenanță", badge „Deschis acum" calculat din program, alegerea numărului de WhatsApp în funcție de pagina/serviciul curent.
