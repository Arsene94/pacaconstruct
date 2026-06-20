# GTM `GTM-WGZMLP4K` — ce e configurat și ce trebuie completat

Container web pentru `pacaconstruct.vercel.app`. Sursa de adevăr pentru evenimente
rămâne [`docs/MEASUREMENT-PLAN.md`](./MEASUREMENT-PLAN.md). Acest fișier descrie
**containerul deja construit** în `GTM-WGZMLP4K_workspace3.json` și **pașii manuali**
(ID-uri, conturi, publicare) pe care trebuie să-i faci în interfețele GTM / GA4 /
Google Ads / Meta / TikTok / Search Console.

> Principiul nu se schimbă: **niciun ID de vendor în cod**. Singurul ID din cod
> este `NEXT_PUBLIC_GTM_ID = GTM-WGZMLP4K`. Tot restul (GA4, Ads, Meta, TikTok)
> trăiește în container și se declanșează din evenimentele `pc_*` din `dataLayer`.

---

## 0. Import & publicare (o singură dată)

1. GTM → containerul `GTM-WGZMLP4K` → **Admin → Import Container**.
2. Fișier: `GTM-WGZMLP4K_workspace3.json`.
3. Workspace: **Existing → Default Workspace** (sau unul nou).
4. Opțiune: **Merge → Overwrite conflicting tags/triggers/variables**.
   (Merge păstrează templates-urile deja prezente: _CookieScript CMP_ și _Meta Pixel_.)
5. **Confirm**. Verifică în Preview (§6), apoi **Submit / Publish**.

Containerul importat conține: **7 foldere**, **19 variabile**, **14 triggere**,
**26 tag-uri**, **2 custom templates** (CookieScript CMP + Meta Pixel oficial).

---

## 1. ⚠️ Constante de înlocuit (OBLIGATORIU)

Toate ID-urile sunt centralizate în variabile **Constant** (folder `01 · Variabile`).
Înlocuiește valorile `XXX` — nu trebuie atinse tag-urile, doar aceste 7 constante:

| Variabilă (GTM)                    | Pune aici…                              | De unde o iei                                           |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| `Const - GA4 Measurement ID`       | `G-XXXXXXXXXX`                          | GA4 → Admin → Data Streams → Web → _Measurement ID_     |
| `Const - Google Ads Conversion ID` | **doar numeric** (partea de după `AW-`) | Google Ads → Goals → Conversions → tag setup            |
| `Const - Ads Label - Lead`         | eticheta conversiei „Lead"              | Google Ads → acțiunea de conversie → _Conversion label_ |
| `Const - Ads Label - Phone`        | eticheta conversiei „Apel"              | idem                                                    |
| `Const - Ads Label - WhatsApp`     | eticheta conversiei „WhatsApp"          | idem                                                    |
| `Const - Meta Pixel ID`            | ID-ul pixelului (15–16 cifre)           | Meta Events Manager → Data Sources → Pixel → _Details_  |
| `Const - TikTok Pixel ID`          | Pixel ID (20 caractere)                 | TikTok Events Manager → pixel → _Edit details_          |

> `Const - Google Ads Conversion ID` se pune **fără** prefixul `AW-`: tag-ul Google Ads
> Conversion (`awct`) cere doar numărul. Prefixul `AW-` apare doar la Google Tag, nu aici.

> **De ce unele placeholder-uri sunt `0`, nu `X`:** la import, GTM **rezolvă variabilele
> Constant și le validează după format**. `Const - Google Ads Conversion ID` (câmp numeric)
> și `Const - Meta Pixel ID` (regex `^[0-9,]+$`) trebuie să fie **cifre**, altfel importul
> eșuează cu „Valoarea trebuie completată". De aceea vin pre-completate cu zerouri
> (`000000000`, `000000000000000`) — **trebuie înlocuite** cu ID-urile reale.
> `Const - GA4 Measurement ID` rămâne `G-XXXXXXXXXX` (charsetul `A-Z0-9` e valid),
> iar `Const - TikTok Pixel ID` e folosit într-un tag Custom HTML (nevalidat), deci `X` e ok.

Cât timp constantele sunt placeholder, tag-urile se încarcă dar nu raportează nimic util —
deci poți importa containerul fără frică, nu trimite date până nu completezi ID-urile.

---

## 2. Ce e deja construit în container

### 2.1 Consimțământ (Consent Mode v2) — folder `00 · Consent`

- **CookieBanner** (template oficial _CookieScript CMP_) rulează pe
  **Consent Initialization – All Pages** și setează default **toate categoriile = `denied`**
  (cookieless), cu `wait_for_update = 500ms`. Bannerul real e servit de CookieScript
  (`script_src` deja completat). Modifici categoriile/limba din contul CookieScript.
- La accept/refuz, CookieScript trimite `gtag('consent','update',…)` automat.

### 2.2 Variabile — folder `01 · Variabile`

- 7 **Constante** (§1).
- 12 **Data Layer Variables** (`DLV - …`): `lead_type`, `item_name`, `value`,
  `currency`, `source`, `placement`, `link_id`, `event_id`, `search_term`,
  `percent`, `page_path`, `page_type`.

### 2.3 Triggere — folder `02 · Triggere`

14 triggere **Custom Event**, câte unul pentru fiecare eveniment `pc_*`
(`CE - pc_lead_submit`, `CE - pc_phone_click`, …).

### 2.4 Tag-uri

**Google · GA4** (folder `03`) — tipuri native `googtag` + `gaawe`:
| Tag | Eveniment GA4 | Se declanșează la |
| --- | --- | --- |
| `Google tag - GA4` | (config, `send_page_view=false`) | All Pages |
| `GA4 - page_view` | `page_view` | `pc_public_page_view` |
| `GA4 - generate_lead` | `generate_lead` (+ `lead_type`,`item_name`,`value`,`currency`) | `pc_lead_submit` |
| `GA4 - view_item` | `view_item` (`item_name`) | `pc_view_service`, `pc_view_machine` |
| `GA4 - contact` | `contact` (`source`,`placement`,`method`) | `pc_phone_click`, `pc_whatsapp_click`, `pc_email_click` |
| `GA4 - select_content` | `select_content` (`link_id`,`placement`) | `pc_cta_click`, `pc_nav_click`, `pc_footer_link_click` |
| `GA4 - sign_up` | `sign_up` | `pc_newsletter_optin` |
| `GA4 - search` | `search` (`search_term`) | `pc_search` |
| `GA4 - scroll` | `scroll` (`percent_scrolled`) | `pc_scroll_depth` |

**Google Ads** (folder `04`) — native `gclidw` (Conversion Linker) + `awct` (Conversion Tracking):

- `Google Ads - Conversion Linker` (All Pages).
- `Google Ads - Conversie Lead` (cu `value`+`currency`, Enhanced Conversions ON) ← `pc_lead_submit`.
- `Google Ads - Conversie Apel telefonic` ← `pc_phone_click`.
- `Google Ads - Conversie WhatsApp` ← `pc_whatsapp_click`.

**Meta** (folder `05`) — template oficial _Meta Pixel_ (`cvt_5RM3Q`), cu `event_id` pentru deduplicare:

- `Meta - PageView` (All Pages) · `Meta - Lead` · `Meta - ViewContent` ·
  `Meta - Contact` · `Meta - CompleteRegistration` · `Meta - Search`.

**TikTok** (folder `06`) — scriptul oficial `ttq` (Custom HTML):

- `TikTok - Base Pixel` (All Pages, `ttq.load` + `ttq.page`) · `TikTok - SubmitForm` ·
  `TikTok - ViewContent` · `TikTok - Contact` · `TikTok - CompleteRegistration` · `TikTok - Search`.

### 2.5 Consimțământ pe tag-uri (important)

- **Tag-urile Google** (GA4, Ads, Conversion Linker) au `Consent = NOT_SET`
  **intenționat**: respectă Consent Mode v2 **nativ** — la `denied` trimit ping-uri
  _cookieless_ care alimentează **modelarea** conversiilor. A le bloca cu „additional
  consent" ar opri modelarea.
- **Meta și TikTok** NU au consent mode nativ → sunt **gated pe `ad_storage`**
  (firing blocat până la accept). Așa trebuie.

---

## 3. Configurare pe platforme (interfețe externe)

### 3.1 Google Analytics 4

1. Creează proprietatea GA4 + un **Web data stream** pentru domeniu → ia `G-XXXXXXXXXX` → constanta.
2. **Admin → Events → Key events**: marchează drept _key event_ (conversie):
   `generate_lead`, `contact`, `sign_up` (eventual `search`).
3. (Opțional) GA4 → Google Ads link pentru import audiențe/conversii.
4. Notă `send_page_view=false`: page-view-ul e trimis exclusiv de `GA4 - page_view`
   pe `pc_public_page_view`, ca să prinzi și navigările SPA (Next.js App Router) o
   singură dată. Dacă în Preview vezi că primul page-view lipsește, pune
   `send_page_view=true` în `Google tag - GA4`.

### 3.2 Google Ads

1. **Goals → Conversions → New conversion action → Website**, manual, câte una pentru:
   **Lead** (formular), **Apel telefonic**, **WhatsApp**.
2. Din „Use Google Tag Manager" ia **Conversion ID** (numeric) + **Conversion label**
   pentru fiecare → constantele `Const - Google Ads Conversion ID` și `Const - Ads Label - *`.
3. **Enhanced Conversions**: în container e **dezactivat** (`enableEnhancedConversion = false`),
   **intenționat** — dacă îl activezi pe tag, GTM cere obligatoriu o variabilă
   **User-Provided Data**, iar site-ul **nu** trimite PII în `dataLayer` (privacy-first),
   deci nu există ce mapa. Cum îl activezi corect, când vrei:
   - **Recomandat (fără cod, fără PII):** Google Ads → acțiunea de conversie →
     Enhanced Conversions → metoda **Google Tag** / **Automatic** (Google tag-ul de pe
     pagină detectează singur câmpurile formularului). Nu necesită modificări în container.
   - **Manual:** creează în GTM o variabilă **User-Provided Data** (din dropdown, ca să
     nu greșești tipul), apoi pune `enableEnhancedConversion = true` pe cele 3 tag-uri
     `awct` și selecteaz-o — doar dacă/­când există date hash-uite disponibile.
4. **Conversii offline** (CPA real, fără cod): la submit se salvează deja
   `gclid/gbraid/wbraid/utm_*` în DB (`service_requests`/`rental_requests`, vezi
   MEASUREMENT-PLAN §6). Când un lead devine „Confirmat", folosește `gclid` + valoarea
   reală pentru **Offline Conversion Import** în Google Ads.

### 3.3 Meta (Facebook) Pixel

1. **Events Manager → Data Sources → Pixel** → ia ID-ul → `Const - Meta Pixel ID`.
2. Template-ul oficial e deja importat; deduplicarea browser↔server merge pe `event_id`
   (`{{DLV - event_id}}`, deja setat pe fiecare tag Meta).
3. **Advanced Matching** e `false` în container (nu trimitem PII din cod). Activează-l
   doar dacă adaugi câmpuri hash-uite în `dataLayer`.
4. (Opțional) **Conversions API**: în template e `optInMetaCAPI=false`. Pentru CAPI
   real, configurează din Events Manager (Conversions API Gateway / partener) și
   păstrează același `event_id` pentru deduplicare.

### 3.4 TikTok Pixel

1. **Events Manager → ai pixelul** → ia Pixel ID → `Const - TikTok Pixel ID`.
2. Folosim **scriptul oficial `ttq`** (Custom HTML). Alternativ poți înlocui cele 6
   tag-uri TikTok cu **template-ul oficial „TikTok Pixel"** din _Community Template
   Gallery_ (Tag → New → Discover more → caută „TikTok") — același rezultat, UI mai curat.
3. Evenimentele: `SubmitForm` (lead), `ViewContent` (serviciu/utilaj), `Contact`
   (tel/WhatsApp/email), `CompleteRegistration` (newsletter), `Search`.

### 3.5 Google Search Console (verificare proprietate)

GSC **nu necesită tag** în container. Verifici domeniul prin metoda **Google Tag Manager**:

1. Search Console → **Add property → URL prefix** = `https://pacaconstruct.vercel.app`.
2. Metoda de verificare **Google Tag Manager** → detectează snippet-ul `GTM-WGZMLP4K`
   (deja injectat de `@next/third-parties`). Apasă **Verify**.
   (Necesită rol _Publish_ pe container.) Apoi trimite sitemap-ul `/sitemap.xml`.

---

## 4. Ce trebuie modificat / verificat în cod (de regulă: nimic)

- **Niciun deploy de cod** pentru ID-uri — toate trăiesc în GTM. ✓
- Confirmă în `.env` că `NEXT_PUBLIC_GTM_ID=GTM-WGZMLP4K`.
- Evenimentele `pc_*` din §2.3 trebuie să existe deja în `dataLayer` (sunt împinse de
  `app/components/marketing/*` + `app/lib/marketing/data-layer.ts`). Dacă adaugi un
  eveniment nou `pc_*`: instrumentează în cod → documentează în MEASUREMENT-PLAN →
  adaugă trigger + tag în GTM (nu invers).

---

## 5. De completat ulterior (opțional, când ai bugete/valori)

- **`value` pe lead**: în cod `value` nu e populat (nu există estimare în UI). Poți
  pune o valoare fixă per `lead_type` direct în GTM (ex. o variabilă Lookup Table pe
  `{{DLV - lead_type}}`) și să o folosești în `conversionValue` / Meta `value`.
- **Meta CAPI / TikTok Events API** (server-side) pentru rezistență la ad-blockers —
  necesită gateway, nu cod în app.
- **Consent Mode Advanced banner custom** (MEASUREMENT-PLAN §5) dacă renunți la CookieScript.

---

## 6. QA înainte de publicare (GTM Preview / Tag Assistant)

1. **Preview** pe domeniul public și verifică, pentru fiecare `pc_*`, că:
   - se declanșează tag-ul corect (GA4 / Ads / Meta / TikTok);
   - parametrii (`{{DLV - …}}`) au valori curate, fără PII.
2. **Consimțământ**: înainte de accept → Google trimite cookieless, Meta/TikTok **nu**
   se declanșează; după accept → toate se declanșează.
3. **Gating de path**: pe `/admin`, `/login`, `/auth`, `/api`, `/unsubscribe`
   **NU** trebuie să se încarce GTM și **niciun** `pc_*` (gating în cod).
4. **Meta** → Test Events (Events Manager). **TikTok** → Test Event. **Ads** →
   diagnostics Enhanced Conversions. **GA4** → DebugView.
5. Performanță: GTM `afterInteractive`, fără layout shift de la banner.
6. **Submit / Publish** versiunea.

---

## 7. Rezumat acțiuni

- [ ] Import `GTM-WGZMLP4K_workspace3.json` (Merge/Overwrite).
- [ ] Completează cele **7 constante** cu ID-urile reale.
- [ ] GA4: key events + (eventual) `send_page_view`.
- [ ] Google Ads: 3 acțiuni de conversie + Enhanced Conversions.
- [ ] Meta: Pixel ID (+ opțional CAPI).
- [ ] TikTok: Pixel ID.
- [ ] Search Console: verificare via GTM + sitemap.
- [ ] QA în Preview → **Publish**.
