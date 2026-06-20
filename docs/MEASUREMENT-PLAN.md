# Plan de măsurare — PACA CONSTRUCT

Sursă unică de adevăr pentru tracking. Arhitectura replică `medicalapp`:
**doar `dataLayer` → GTM web** (prin `@next/third-parties`), cu **Consent Mode v2
default**. Aplicația **nu** conține pixeli de vendor, **nu** are endpoint de
tracking și **nu** folosește container server-side. Toți pixelii (GA4, Google
Ads, TikTok, Meta) se configurează **în GTM** și se declanșează din evenimentele
`pc_*`.

> Singurul ID din cod: `NEXT_PUBLIC_GTM_ID` (container web `GTM-XXXXXXX`).
> ID-urile GA4 / Ads / TikTok / Meta trăiesc **în GTM**. Adăugarea unei platforme
> noi **nu** cere deploy de cod.

---

## 1. Arhitectură (cod)

| Strat              | Fișier                                                                                                        | Rol                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Scripturi          | `app/components/marketing/marketing-scripts.tsx`                                                              | Consent Mode v2 default (`denied`) **înainte** de `<GoogleTagManager>`. Doar pe pagini publice. |
| Page view + scroll | `app/components/marketing/marketing-page-view-tracker.tsx`                                                    | `pc_public_page_view` la schimbarea de rută + `pc_scroll_depth` (25/50/75/90).                  |
| Data layer         | `app/lib/marketing/data-layer.ts`                                                                             | `pushMarketingEvent()`, gating pe path, `event_id`, curățarea valorilor.                        |
| Componente         | `app/components/ui/tracked-link.tsx` (`TrackedLink`, `TrackedAnchor`), `tracked-button.tsx` (`TrackedButton`) | Wrappere care împing evenimente la click.                                                       |
| View item          | `app/components/marketing/view-item-tracker.tsx`                                                              | `pc_view_service` / `pc_view_machine` la montare.                                               |
| Search             | `app/components/marketing/search-tracker.tsx`                                                                 | `pc_search` pe pagina de blog cu `?q=`.                                                         |

**Privacy-first:** tracking NUMAI pe paginile publice. Gating în
`BLOCKED_MARKETING_PATH_PREFIXES = ["/admin","/login","/auth","/api","/unsubscribe"]`.
Zero PII în clar: toate valorile text trec prin `cleanMarketingValue`
(lowercase, fără caractere speciale, ≤80 caractere).

**Consent-first:** la încărcare, toate categoriile sunt `denied` (mai puțin
`security_storage`). Fără banner → doar _modelare_ (cookieless). Cu banner
(opțional, vezi §6) → `gtag('consent','update',…)`.

---

## 2. Evenimente `pc_*` (dataLayer)

Fiecare push include automat: `event`, `event_id`, `page_path`, `page_host`,
`page_type: "public_marketing"`.

| Eveniment              | Unde / când                                        | Parametri proprii                                                                                           |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pc_public_page_view`  | fiecare navigare publică                           | `source: public_website`                                                                                    |
| `pc_view_service`      | mount pe `/servicii/[slug]`                        | `item_name` (slug)                                                                                          |
| `pc_view_machine`      | mount pe `/inchiriere-utilaje/[slug]`              | `item_name` (slug)                                                                                          |
| `pc_lead_submit`       | submit reușit (`state.ok`) în ambele formulare     | `lead_type` (`serviciu`\|`inchiriere`), `item_name` (utilaj, doar la închiriere), `source`, `currency: RON` |
| `pc_newsletter_optin`  | bifă newsletter la submit reușit                   | `source`                                                                                                    |
| `pc_phone_click`       | click `tel:` (float, navbar topbar, footer, meniu) | `source`, `placement`                                                                                       |
| `pc_whatsapp_click`    | click `wa.me`                                      | `source`, `placement`                                                                                       |
| `pc_email_click`       | click `mailto:`                                    | `source`, `placement`                                                                                       |
| `pc_cta_click`         | „Cere oferta" (navbar desktop + mobil)             | `link_id: cere_oferta`, `placement`, `source`                                                               |
| `pc_nav_click`         | linkuri navbar / meniu mobil                       | `link_id` (href), `placement`, `source`                                                                     |
| `pc_footer_link_click` | linkuri din footer                                 | `link_id` (href), `placement: footer`                                                                       |
| `pc_mobile_menu_open`  | deschiderea meniului mobil                         | `placement: navbar`, `source: navbar`                                                                       |
| `pc_search`            | căutare blog (`/blog?q=`)                          | `search_term`                                                                                               |
| `pc_scroll_depth`      | praguri 25 / 50 / 75 / 90 %                        | `percent`                                                                                                   |

> `value` este suportat de `pushMarketingEvent` pentru conversii value-based, dar
> nu e populat din cod (nu există estimare în UI). Se poate completa ulterior din
> GTM (ex: valoare fixă per `lead_type`) sau prin import offline (vezi §7).

---

## 3. Configurare în GTM (se face în interfața GTM, nu în cod)

Toate tag-urile au **Consent Checks** (Additional consent checks / Consent
Initialization). Niciun tag fără gating.

### 3.1 Variabile — Data Layer Variables

Creează câte o DLV pentru fiecare câmp folosit:
`lead_type`, `item_name`, `value`, `currency`, `source`, `placement`,
`link_id`, `event_id`, `search_term`, `percent`, `page_path`, `page_type`.

Plus **User-Provided Data** variable (din formulare) pentru Enhanced Conversions
— hash-uită în GTM, niciodată în clar în cod.

### 3.2 Triggere — Custom Event

Câte un trigger `Custom Event` per eveniment, cu `Event name` = numele `pc_*`
exact (ex: `pc_lead_submit`).

### 3.3 Tag-uri pe platformă (toate în GTM)

**GA4**

- Config tag (`G-XXXX`), gate `analytics_storage`.
- Event tags (mapare):
  - `pc_lead_submit` → `generate_lead` (params: `lead_type`, `item_name`, `value`, `currency`)
  - `pc_view_service` / `pc_view_machine` → `view_item` (`item_name`)
  - `pc_phone_click` / `pc_whatsapp_click` / `pc_email_click` → `contact` (`source`, `placement`)
  - `pc_cta_click` / `pc_nav_click` / `pc_footer_link_click` → `select_content`
  - `pc_newsletter_optin` → `sign_up`
  - `pc_search` → `search` (`search_term`)
  - `pc_scroll_depth` → `scroll` (`percent`)

**Google Ads**

- Conversion Linker (all pages).
- Conversion Tracking pe `pc_lead_submit`, `pc_phone_click`, `pc_whatsapp_click`,
  gate `ad_storage`.
- Enhanced Conversions for Leads: User-Provided Data (hash în GTM) + `event_id`.

**TikTok Pixel**

- Base pixel, gate `ad_storage`.
- `pc_lead_submit` → `SubmitForm`; `pc_view_*` → `ViewContent`;
  `pc_*_click` → `Contact`.

**Meta Pixel**

- Base pixel + Advanced Matching, `event_id` pentru deduplicare.
- `pc_lead_submit` → `Lead`; `pc_view_*` → `ViewContent`;
  `pc_*_click` → `Contact`; `pc_newsletter_optin` → `CompleteRegistration`.

---

## 4. QA & verificare (Faza 8)

- **GTM Preview / Tag Assistant**: verifică fiecare `pc_*`, parametrii și
  Consent Mode. Confirmă că pe `/admin`, `/login`, `/auth`, `/api`,
  `/unsubscribe` **nu** se încarcă GTM și **nu** se trimite niciun eveniment.
- **Meta**: Test Events (browser). **Google Ads**: diagnostics Enhanced Conversions.
- **Performanță**: GTM `afterInteractive`; CWV neafectat; (dacă există banner)
  fără layout shift.
- **Privacy**: zero PII în clar; `/confidentialitate` actualizată cu cookie-uri /
  tracking + temei legal; (dacă există banner) link „Modifică consimțământul".

---

## 5. (Opțional) Banner de consimțământ — Consent Mode Advanced

Default-ul rămâne `denied` (doar modelare). Pentru recuperarea semnalului de
ads, un banner `app/components/marketing/consent-banner.tsx` ar face
`gtag('consent','update',{…})` pe categorii (Necesare / Analitice / Marketing),
persistat în cookie first-party (1 an), cu „Accept" / „Refuz" / „Setări" (refuz
la fel de ușor ca accept, fără pre-bifare). Tag-urile rămân încărcate; la refuz
trimit ping-uri cookieless → Google modelează conversiile. **Neimplementat încă.**

---

## 6. Click-IDs & conversii offline (Faza 7 — implementat)

Fără server-side. La submit se captează din URL/cookie: `gclid`, `gbraid`,
`wbraid`, `fbclid`, `ttclid`, `msclkid`, `utm_*`, `landing_page`, plus
`consent_ads`, stocate ca hidden fields și salvate în coloanele
`service_requests` / `rental_requests`.

**Cod:**

- `app/lib/marketing/attribution.ts` — lista parametrilor + `readAttribution(form)`
  (curățare + maparea la coloane DB).
- `app/components/marketing/attribution-fields.tsx` — captează din URL,
  persistă first-touch într-un cookie first-party (`paca_attr`, 90 zile) și
  injectează `<input type="hidden">` în ambele formulare; `consent_ads` din
  cookie-ul `paca_consent_ads` (setat de un eventual banner — Faza 6).
- `app/actions/intake.ts` — `...readAttribution(form)` în rândul de insert.
- Migrare: `supabase/migrations/20260620000013_lead_attribution.sql`
  (coloane nullable + `consent_ads boolean default false` + `value_estimate numeric`).

**Operațional (manual, fără cod):** când un lead devine „Confirmat" în admin,
se folosesc `gclid`/`fbclid`/… + valoarea reală pentru Offline Conversion Import
în Google Ads / Meta (interfață / Sheets) → reclamele se optimizează pe lead-uri
câștigate (CPA mai mic). `value_estimate` poate fi completat pentru import
value-based.

---

## 7. Guvernanță

- Acest document = sursă unică (eveniment → params → mapare vendor).
- Orice eveniment nou `pc_*`: adaugă în `PacaMarketingEventName`, instrumentează
  la punctul real, apoi documentează aici și creează trigger-ul în GTM.
- Niciun ID de vendor în cod. Niciun pixel direct. Niciun PII în clar.
