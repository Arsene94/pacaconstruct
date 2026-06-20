# PROMPT — Google Tag Manager + Custom Events (PACA CONSTRUCT)

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod în repo-ul `paca-construct`.
> **Modelat 1:1 pe proiectul de referință `~/react/medicalapp` (AuraMed).** Abordare: aplicația trimite **evenimente în containerul web GTM** (prin dataLayer); GA4, Google Ads, TikTok Pixel, Meta — toate se configurează **în GTM**. **Fără container server-side (sGTM), fără endpoint de tracking în aplicație, fără pixeli de vendor în cod.**

---

## CONTEXT

### Starea curentă (paca-construct)

Site Next.js 16.2 matur (RO, EEA). Tracking azi: `app/components/analytics.tsx` încarcă doar GA4 prin `gtag.js` (fără GTM, fără evenimente, fără consimțământ) — **va fi înlocuit**. Puncte de conversie reale, de instrumentat:

- **Formular serviciu** (`app/contact/contact-form.tsx`) — `useActionState` → `state.ok` = succes. Câmpuri: name, phone, email (opțional), location, surface, description, bifă `newsletter`.
- **Formular închiriere** (`app/inchiriere-utilaje/[slug]/rental-request-form.tsx`) — același pattern → `state.ok`; are `machineTitle`.
- **Butoane flotante** (`app/components/floating-buttons.tsx`) — au deja `data-cta`: `whatsapp-float`, `call-float`, `email-float`, `scrolltop-float`, `*-item`.
- **Telefon/WhatsApp/email** în navbar, footer, `ContactCta`.
- **Pagini produs:** `servicii/[slug]`, `inchiriere-utilaje/[slug]` (view_item). Plus blog/FAQ/proiecte/zonă.

### Modelul de referință (DESCHIDE și replică) — `~/react/medicalapp`

- `components/marketing/MarketingScripts.tsx` — Consent Mode v2 default (denied) inline + `<GoogleTagManager gtmId>` din `@next/third-parties/google`, randat **doar pe paginile publice** (`isPublicMarketingPath`).
- `lib/marketing/data-layer.ts` — `pushMarketingEvent()`, tipuri de eveniment namespaced, listă de path-uri blocate, `isPublicMarketingPath`, `cleanMarketingValue`, generare `event_id`.
- `components/ui/tracked-link.tsx` + `tracked-button.tsx` — wrappere peste Link/Button care apelează `pushMarketingEvent` la click.
  Replică acest pattern pentru PACA (prefix de eveniment **`pc_`** în loc de `am_`; fără i18n — `lang="ro"` simplu).

---

═══ START PROMPT ═══

## ROL & OBIECTIV

Implementezi tracking-ul PACA CONSTRUCT **exact ca în `~/react/medicalapp`**: GTM (container web) încărcat prin `@next/third-parties`, Consent Mode v2 default, și un strat `data-layer` cu `pushMarketingEvent` + componente `TrackedLink`/`TrackedButton`. **Toți** pixelii (GA4, Google Ads, TikTok, Meta) se configurează **în GTM**, declanșați de evenimentele din dataLayer. Aplicația NU conține pixeli de vendor, NU are endpoint de tracking, NU folosește container server-side.

## REGULI OBLIGATORII

1. **Deschide întâi fișierele de referință din `~/react/medicalapp`** (`components/marketing/MarketingScripts.tsx`, `lib/marketing/data-layer.ts`, `components/ui/tracked-link.tsx`, `tracked-button.tsx`) și replică structura/convențiile. Citește și docs `@next/third-parties`.
2. **Doar dataLayer → GTM web.** Niciun pixel de vendor în cod; nimic server-side; niciun `api/track`.
3. **Privacy-first:** tracking NUMAI pe paginile publice (gating pe path); niciodată pe `/admin`, `/login`, `/auth`, `/api`. **Zero PII în clar** în dataLayer.
4. **Consent-first:** Consent Mode v2 default (`denied`) setat ÎNAINTE de GTM.
5. Type-safe (TS strict); `npx tsc --noEmit` + `lint` + `build` curat după fiecare fază.
6. Singurul ID în cod: `NEXT_PUBLIC_GTM_ID`. ID-urile de vendor trăiesc în GTM.

## VARIABILĂ ENV (adaugă în `.env.example`)

```
NEXT_PUBLIC_GTM_ID=     # GTM-XXXXXXX (container web). ID-urile GA4/Ads/TikTok/Meta se pun ÎN GTM.
```

---

## FAZA 1 — `MarketingScripts` (Consent Mode default + GTM)

Creează `app/components/marketing/marketing-scripts.tsx` (Client Component), pe modelul medicalapp:

- Citește `NEXT_PUBLIC_GTM_ID`; dacă lipsește SAU `!isPublicMarketingPath(pathname)` → `return null`.
- `<Script id="paca-consent-mode-default" strategy="afterInteractive">` care setează **Consent Mode v2 default**:
  ```js
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  ```
- Apoi `<GoogleTagManager gtmId={gtmId} />` din `@next/third-parties/google` (`npm i @next/third-parties`).
- **Montare:** în `app/layout.tsx`, **înlocuiește** `<Analytics />` cu `<MarketingScripts />`. Șterge/retrage `app/components/analytics.tsx` (GA4 simplu) — GA4 se configurează acum în GTM.

**Acceptare:** GTM se încarcă o singură dată, doar pe paginile publice; Consent Mode default activ înaintea GTM; pe `/admin`/`/login` nu se încarcă nimic.

---

## FAZA 2 — `data-layer.ts` (replica `pushMarketingEvent`)

Creează `app/lib/marketing/data-layer.ts`, pe modelul medicalapp (prefix `pc_`):

- **Tip eveniment** `PacaMarketingEventName` (union), ex.:
  `pc_public_page_view`, `pc_view_service`, `pc_view_machine`, `pc_lead_submit`, `pc_newsletter_optin`, `pc_phone_click`, `pc_whatsapp_click`, `pc_email_click`, `pc_cta_click`, `pc_nav_click`, `pc_footer_link_click`, `pc_mobile_menu_open`, `pc_search`, `pc_scroll_depth`.
- **Payload** (ca medicalapp + extensii pentru conversii): `{ event, placement?, source?, page_area?, link_id?, lead_type?, item_name?, value?, currency? }`.
- `BLOCKED_PATH_PREFIXES = ["/admin","/login","/auth","/api","/unsubscribe"]` + `matchesPathPrefix` + `isBlockedMarketingPath` / `isPublicMarketingPath` (fără stripLocale — PACA n-are prefix de limbă).
- `cleanMarketingValue(value)` — `toLowerCase().trim().replace(/[^a-z0-9_/-]/g,'_').slice(0,80)`.
- `pushMarketingEvent(payload)` — identic conceptual cu medicalapp: `return null` pe server; guard `isPublicMarketingPath(location.pathname)`; generează `event_id` (`crypto.randomUUID()` cu fallback); `window.dataLayer.push({ event, event_id, page_path, page_host, page_type:'public_marketing', ...valori curățate })`; returnează `event_id`. Pentru `pc_lead_submit` include `lead_type`, `item_name`, `value`, `currency:'RON'`.
- `trackPageView()` — împinge `pc_public_page_view` la schimbarea de rută (un mic `RouteTracker` client în layout-ul public, cu `usePathname`).

**Acceptare:** `pushMarketingEvent` e type-safe, gating-ul pe path funcționează, `event_id` generat, valorile curățate; SSR-safe.

---

## FAZA 3 — `TrackedLink` + `TrackedButton`

Creează `app/components/ui/tracked-link.tsx` și `tracked-button.tsx`, pe modelul medicalapp: wrappere peste `next/link` Link și butonul intern, cu prop-uri `trackingEvent`, `trackingPlacement`, `trackingSource`, `trackingPageArea?`, `trackingLinkId`; la `onClick` apelează `pushMarketingEvent(...)` apoi `onClick?.(e)`. (Adaptează la componentele PACA — nu există shadcn Button; folosește `<a>`/`<button>` sau componenta existentă.)

**Acceptare:** un `TrackedLink`/`TrackedButton` împinge evenimentul corect în dataLayer la click, fără a rupe navigarea.

---

## FAZA 4 — Instrumentarea punctelor de conversie (evenimente custom)

Instrumentează site-ul cu `pushMarketingEvent` / componentele tracked. Tabel (toate intră în GTM):

| Eveniment dataLayer                                             | Unde / când                                              | Params cheie                                                          |
| --------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| `pc_public_page_view`                                           | fiecare navigare publică                                 | page_path                                                             |
| `pc_view_service` / `pc_view_machine`                           | mount pe `servicii/[slug]` / `inchiriere-utilaje/[slug]` | item_name(slug)                                                       |
| `pc_lead_submit`                                                | **submit reușit** (`state.ok`) în ambele formulare       | lead_type('serviciu'\|'inchiriere'), item_name, value, currency:'RON' |
| `pc_newsletter_optin`                                           | bifă newsletter la submit reușit                         | source                                                                |
| `pc_phone_click`                                                | click `tel:` (floating, navbar, footer, CTA, meniu)      | source, placement                                                     |
| `pc_whatsapp_click`                                             | click `wa.me`                                            | source, placement                                                     |
| `pc_email_click`                                                | click `mailto:`                                          | source                                                                |
| `pc_cta_click`                                                  | CTA „Cere ofertă"/„Suna" etc.                            | link_id, placement                                                    |
| `pc_nav_click` / `pc_footer_link_click` / `pc_mobile_menu_open` | navbar/footer/meniu mobil                                | link_id                                                               |
| `pc_search` / `pc_scroll_depth`                                 | căutare blog / 25-50-75-90%                              | search_term / percent                                                 |

Instrumentare concretă:

- **`pc_lead_submit`:** în `contact-form.tsx` și `rental-request-form.tsx`, `useEffect` care la `state?.ok === true` apelează `pushMarketingEvent({ event:'pc_lead_submit', lead_type, item_name, value, currency:'RON' })`. (`has_email` opțional ca flag, fără emailul în clar.)
- **Floating buttons** (`floating-buttons.tsx`): la click pe apel/WhatsApp/email apelează `pushMarketingEvent` cu `source:'float'` (au deja `data-cta` ca backup pentru triggere GTM).
- **Telefon/WhatsApp/email în navbar/footer/CTA:** înlocuiește cu `TrackedLink` sau adaugă `onClick`.
- **`pc_view_service`/`pc_view_machine`:** client component mic la mount pe paginile de produs.

**Acceptare:** fiecare eveniment apare în GTM Preview cu parametrii și sursa corecte.

---

## FAZA 5 — Configurare în GTM (blueprint — se face în interfața GTM, nu în cod)

Documentează în `docs/MEASUREMENT-PLAN.md`; omul implementează în GTM. **Toate** tag-urile au **Consent Checks**.

- **Variabile (Data Layer Variables):** `lead_type`, `item_name`, `value`, `currency`, `source`, `placement`, `link_id`, `event_id`, `search_term`, `percent` + User-Provided Data (enhanced conversions).
- **Triggere (Custom Event):** câte unul pe fiecare `pc_*`.
- **Tag-uri pe platformă (toate în GTM):**
  - **GA4:** Config (`G-XXXX`, gate `analytics_storage`) + Event tags (mapează `pc_lead_submit`→`generate_lead`, `pc_view_*`→`view_item`, `pc_*_click`→`contact`, etc.).
  - **Google Ads:** Conversion Linker + Conversion Tracking pe `pc_lead_submit`/`pc_phone_click`/`pc_whatsapp_click` (gate `ad_storage`) + **Enhanced Conversions for Leads** (User-Provided Data hash în GTM).
  - **TikTok Pixel:** Base + Events: `pc_lead_submit`→SubmitForm, `pc_view_*`→ViewContent, `pc_*_click`→Contact (gate `ad_storage`).
  - **Meta Pixel:** Base + `pc_lead_submit`→Lead, `pc_view_*`→ViewContent, `pc_*_click`→Contact, `pc_newsletter_optin`→CompleteRegistration; Advanced Matching + `event_id`.

**Acceptare:** maparea event→platformă documentată; toate tag-urile consent-gated; adăugarea unei platforme noi NU cere deploy de cod.

---

## FAZA 6 — (Opțional, recomandat) Banner de consimțământ → Consent Mode Advanced

> medicalapp ține default `denied` (doar modelare). Pentru a **recupera semnal de ads** (și mai multe conversii la cost mic), adaugă un banner care face `gtag('consent','update',{...})`.

- `app/components/marketing/consent-banner.tsx` (client, accesibil): categorii Necesare/Analitice/Marketing; „Accept", „Refuz", „Setări"; la alegere → `consent update` + persistă în cookie first-party (1 an); link „Modifică consimțământul" în footer. GDPR: fără pre-bifare, refuz la fel de ușor ca accept. (Opțional: CMP certificat Google — Cookiebot/Usercentrics.)
- Mod **Advanced**: tag-urile rămân încărcate; la refuz trimit ping-uri cookieless → Google modelează conversiile.

**Acceptare:** fără consimțământ → doar modelare; după accept → tag-uri complete; refuz respectat; banner accesibil.

---

## FAZA 7 — (Opțional, pârghia de cost) Click-IDs + conversii offline

> Fără server-side. Doar captezi și stochezi identificatorii; importul în Ads e operațional (manual/Sheets), nu din cod.

1. La submit, captează din URL/cookie `gclid`, `gbraid`, `wbraid`, `fbclid`, `ttclid`, `msclkid`, `utm_*`, `landing_page` (hidden fields).
2. Migrare DB: coloane pe `service_requests`/`rental_requests` (`gclid`, `fbclid`, `ttclid`, `utm_*`, `landing_page`, `consent_ads`, `value_estimate`); populează în `app/actions/intake.ts`.
3. Când o cerere devine „Confirmat" (admin), folosești `gclid`/`fbclid` + valoarea reală pentru **Offline Conversion Import** în Google Ads/Meta (din interfață/Sheets). Astfel reclamele se optimizează pe lead-uri **câștigate** → **CPA mai mic**.

**Acceptare:** lead cu `gclid` devenit „Confirmat" poate fi importat ca offline conversion cu valoare (pe baza identificatorilor stocați).

---

## FAZA 8 — QA, performanță & guvernanță

- **GTM Preview / Tag Assistant:** verifică fiecare `pc_*`, parametrii, gating-ul pe path, Consent Mode.
- **Meta Test Events (browser); Google Ads diagnostics** enhanced conversions.
- **Performanță:** GTM după interactive; CWV neafectat; banner fără layout shift.
- **Privacy:** zero PII în clar; `/confidentialitate` actualizată (cookie-uri/tracking + temei legal); link „Modifică consimțământul" (dacă faza 6).
- **Guvernanță:** `docs/MEASUREMENT-PLAN.md` ca sursă unică (event → params → mapare vendor).

## LIVRABIL FINAL

Fișiere: `marketing/marketing-scripts.tsx`, `lib/marketing/data-layer.ts`, `ui/tracked-link.tsx` + `tracked-button.tsx`, `RouteTracker`, instrumentarea (forms/floating/links/produs), (opțional) consent-banner + migrare click-IDs. Variabilă env (`NEXT_PUBLIC_GTM_ID`). `MEASUREMENT-PLAN.md`. Pași manuali în GTM/Ads/Meta/TikTok.

## CRITERII GLOBALE (Definition of Done)

- Arhitectură **identică cu medicalapp**: `MarketingScripts` + `pushMarketingEvent` + `TrackedLink/Button`; GTM web prin `@next/third-parties`.
- Consent Mode v2 default; tracking doar pe pagini publice; gtag-ul GA4 simplu eliminat.
- Toate evenimentele `pc_*` instrumentate la punctele reale; toate tag-urile (GA4/Ads/TikTok/Meta) configurate **în GTM**.
- Fără server-side, fără endpoint de tracking, fără pixeli de vendor în cod; zero PII; CWV neafectat.

═══ END PROMPT ═══

---

## Note pentru tine (Arsene)

- Promptul e acum **oglindă a `~/react/medicalapp`**: `MarketingScripts` (Consent Mode default + `@next/third-parties` GTM, gated pe path), `data-layer.ts` cu `pushMarketingEvent`, și `TrackedLink/TrackedButton`. Agentul deschide fișierele din medicalapp și le replică pentru PACA (prefix `pc_`, fără i18n).
- **Tot prin GTM:** Google Ads, TikTok Pixel, Meta, GA4 — toate configurate în container; codul trimite doar evenimentele. Adaugi o platformă nouă fără deploy.
- **Față de medicalapp am adăugat 2 faze OPȚIONALE** (clar marcate): bannerul de consimțământ (FAZA 6, pentru Consent Advanced → mai multe conversii) și captarea click-IDs pentru conversii offline (FAZA 7, pârghia de CPA). Dacă vrei strict ca medicalapp, sari peste ele.
- **Pași în afara codului:** containerul web GTM + tag-urile/trigger-ele, conturile Ads/Meta/TikTok. Agentul lasă `// TODO` pentru ID-uri.

### Surse (standarde 2026)

- Consent Mode v2 (EEA), Advanced pentru recuperare conversii. — [CookieHub](https://www.cookiehub.com/blog/google-consent-mode-v2-setup-gtm-guide)
- GTM în Next.js App Router (`@next/third-parties`, `sendGTMEvent`). — [Next.js Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries)
