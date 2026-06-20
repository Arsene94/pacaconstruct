# Analiză de arhitectură — Sistem de Email (PACA CONSTRUCT)

> Analiză tehnică la nivel de arhitect senior Next.js (10+ ani), pentru un sistem de email complet: template-uri predefinite, management de contacte și grupuri, trimitere segmentată, preview desktop/mobile, și un set implicit de email-uri tranzacționale (utilizatori + admini).
> Repo: `paca-construct` (Next.js 16.2, App Router, Supabase, Upstash QStash/Workflow, Resend). Realizat la 20 iunie 2026.

---

## 1. Rezumat executiv

Astăzi, „sistemul de email" e o singură cale: la o cerere nouă, un job QStash trimite **adminului** un email construit ca string HTML inline. Atât. Nu există confirmare pentru client, nici template-uri reutilizabile, nici contacte/grupuri, nici trimitere în masă, nici preview, iar template-ul HTML frumos din `design/admin/emai.html` **nu e conectat** la aplicație — trăiește doar ca mockup static.

Ce vrei tu e, de fapt, o **platformă de email** cu trei subsisteme distincte, care trebuie proiectate diferit:

1. **Tranzacțional** (declanșat de evenimente): confirmări către client + notificări către admin la cereri de serviciu/închiriere și la schimbări de status. 1 destinatar, predictibil, fără unsubscribe obligatoriu.
2. **Broadcast / campanii** (compus de admin): alegi un template predefinit, selectezi un grup de persoane, faci preview, trimiți/programezi. Volum mare, necesită consimțământ + unsubscribe.
3. **Management de date** (contacte + grupuri/segmente): adaugi/imporți email-uri, le organizezi în grupuri statice și segmente dinamice.

Recomandarea arhitecturală de bază, pe scurt:

- **Template-uri: React Email** (standardul 2026, făcut de echipa Resend) — convertim `emai.html` în componente React tip-safe, randate la HTML cross-client. Structura în cod, **conținutul editabil (subiect, intro, CTA, variabile) în DB**.
- **Sursa de adevăr pentru contacte/grupuri: Supabase** (RLS, GDPR, join cu cererile), opțional sincronizat cu **Resend Audiences** pentru Broadcasts.
- **Livrare: Resend** — tranzacțional via `emails.send` (cu idempotency), masă via `batch`/Broadcasts — orchestrat prin **QStash/Workflow** (reutilizăm infrastructura existentă de retry/DLQ/throttling).
- **Preview: render React Email → HTML → iframe** în admin, cu comutator desktop/mobile + buton „trimite test".
- **Webhooks Resend** → status livrare/bounce/complaint + listă de supresie.

---

## 2. Diagnoza sistemului actual

### Ce există (și e bine proiectat)

- **Pipeline decuplat și rezilient**: `intake.ts` → `notifyNewLead()` → job QStash (`retries: 3`) → worker `/api/jobs/notify-request` (verifică semnătura QStash) → `sendLeadEmail()`. Nu aruncă niciodată; fail-open în dev. **Acesta e fundamentul pe care construim.**
- **Resend** integrat corect, `server-only`, degradare grațioasă dacă lipsește configul.
- Date de cereri bine modelate: `service_requests`, `rental_requests` (au coloana `email`, `code`, `status`, `created_at`).

### Ce lipsește (gap-ul față de cerințe)

| Cerință                                 | Stare azi                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------- |
| Template-uri predefinite, reutilizabile | ❌ HTML inline într-o funcție; template-ul din `emai.html` neconectat       |
| Confirmare către **client**             | ❌ Doar adminul e notificat; emailul clientului e folosit doar ca `replyTo` |
| Mai multe tipuri de email               | ❌ 1 tip logic (notificare admin), 2 subiecte                               |
| Contacte (adaugi email-uri)             | ❌ Inexistent                                                               |
| Grupuri / segmente de persoane          | ❌ Inexistent                                                               |
| Trimitere în masă / broadcast           | ❌ Inexistent                                                               |
| Preview desktop + mobile                | ❌ Inexistent                                                               |
| Status livrare / bounce / unsubscribe   | ❌ Inexistent (fără webhooks, fără supresie)                                |
| Editare conținut din admin              | ❌ Doar în cod                                                              |

### Observație critică de proiectare

Formularul de **serviciu nu colectează email** (doar nume + telefon). Pentru a trimite confirmare clientului la cererile de serviciu, trebuie adăugat câmp email (opțional → recomandat). La închiriere, emailul există dar e opțional. **Concluzie:** confirmarea către client e „best-effort" — o trimitem doar dacă avem adresă, altfel rămâne doar SMS/telefon.

---

## 3. Traducerea cerințelor tale în componente de arhitectură

| Ce ai cerut                                        | Componenta tehnică                                                     | Decizie                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| „Să predefinesc email-uri"                         | Catalog de **template-uri** (React Email + meta în DB)                 | Structură în cod, conținut/variabile editabile în DB |
| „Să selectez grupe de persoane"                    | **Contacte + grupuri statice + segmente dinamice**                     | Sursă de adevăr în Supabase                          |
| „Să adaug eu email-uri"                            | **Contact management** (manual + import CSV + auto-capture din cereri) | Cu consimțământ + dedup pe adresă                    |
| „Preview desktop + mobile"                         | **Render → iframe** cu width toggle + test send                        | În admin, plus React Email dev server                |
| „Template raw HTML, de convertit"                  | Port `emai.html` → componente React Email                              | Layout partajat + variante                           |
| „Tipuri default: cerere închiriere, serviciu etc." | **Catalog de tipuri** (§6)                                             | Tranzacțional vs marketing, user vs admin            |

---

## 4. Arhitectura propusă (pe straturi)

```
EVENIMENT (cerere nouă / schimbare status / cron / acțiune admin)
        │
        ▼
 ORCHESTRARE  ── QStash job / Workflow durabil (retry, DLQ, throttling, idempotency)
        │
        ▼
 RENDERING   ── React Email component + date  →  render() → HTML + text  (cross-client)
        │
        ▼
 TRIMITERE   ── Resend:  emails.send (1:1, tranzacțional)
                          batch.send / Broadcasts (1:N, campanii)
        │
        ▼
 PERSISTENȚĂ ── email_messages (status), email_events (din webhooks)
        │
        ▼
 FEEDBACK    ── Webhooks Resend → delivered/bounced/complained/opened → supresie + analytics
```

Principiu senior: **separă „ce trimiți" (template) de „cui trimiți" (audiență) de „cum livrezi" (provider) de „când/cu ce reziliență" (orchestrare).** Fiecare strat e înlocuibil independent (provider-agnostic acolo unde contează).

### 4.1 Stratul de template — React Email (de ce)

- Standardul 2026 pentru React/Next, creat chiar de echipa Resend; componentele `@react-email/components` rezolvă automat ciudățeniile de client (Outlook/MSO, Gmail, Apple Mail).
- **Tip-safe**: props pentru valori dinamice (nume, cod cerere, utilaj, link). `render()` la momentul trimiterii produce HTML + variantă text.
- Workflow de preview integrat (`PreviewProps`, comutator desktop/mobile).
- Director `emails/` la rădăcina proiectului (sau `app/emails/`).
- **Pentru email-uri banale** (cod reset, o frază + link) un string HTML e suficient — nu supra-inginerizăm.

### 4.2 Modelul „hibrid" template (decizie cheie)

Non-developerii nu trebuie să editeze HTML brut (risc de deliverability și de stricat layout-ul). Recomandare:

- **Structura** (header topo, footer, butoane, tabel de date, alert-box) = componente React Email, în cod, revizuite.
- **Conținutul editabil** (subiect, titlu, paragraf intro, text CTA + URL, ton) = rânduri în `email_templates`, cu **variabile** (`{{name}}`, `{{code}}`, `{{machine}}`) interpolate server-side și **escapate** (anti-injection).
- Astfel „predefinești email-uri" din admin (conținut + variabile), dar randarea finală trece mereu prin layout-ul sigur.

### 4.3 Stratul de date (Supabase) — schema nouă propusă

```sql
-- Template-uri (meta + conținut editabil; structura e în cod)
email_templates(
  id, key unique,              -- ex. 'service_request_user', 'rental_request_admin'
  name, category,              -- 'tranzactional' | 'marketing' | 'sistem'
  audience_type,               -- 'user' | 'admin' | 'broadcast'
  subject, preheader,
  blocks jsonb,                -- titlu, intro, cta_label, cta_url, note...
  layout_key,                  -- ce componentă React Email folosește
  is_active, updated_at
)

-- Contacte (sursa de adevăr; globale pe adresă)
contacts(
  id, email unique, name, phone,
  locale default 'ro',
  source,                      -- 'manual' | 'import' | 'service_request' | 'rental_request'
  marketing_consent bool,      -- pentru broadcast
  consent_at, unsubscribed_at,
  status,                      -- 'active' | 'unsubscribed' | 'bounced' | 'complained'
  tags text[], created_at, updated_at
)

-- Grupuri statice + apartenențe
contact_groups(id, name, description, created_at)
contact_group_members(group_id, contact_id, primary key(group_id, contact_id))

-- Segmente dinamice (definite ca filtru, evaluate la trimitere)
contact_segments(id, name, definition jsonb)   -- ex. „solicitanți închiriere ultimele 90 zile"

-- Jurnal trimiteri (audit + status) și evenimente din webhooks
email_messages(
  id, provider_id,             -- id-ul Resend
  template_key, to_email, to_contact_id,
  subject, type,               -- 'tranzactional' | 'broadcast'
  status,                      -- queued|sent|delivered|bounced|complained|opened
  idempotency_key, campaign_id, error, created_at, updated_at
)
email_events(id, message_id, event_type, payload jsonb, occurred_at)

-- Campanii broadcast
email_campaigns(
  id, template_key, audience_ref,  -- grup/segment
  status,                          -- draft|scheduled|sending|sent
  scheduled_at, sent_count, created_by, created_at
)
```

RLS: tot ce ține de email = **doar admin** (scriere/citire); `contacts.unsubscribe` accesibil public doar prin token semnat (vezi §8).

### 4.4 Stratul de trimitere (Resend)

- **Tranzacțional 1:1**: `resend.emails.send({ ..., headers: { 'Idempotency-Key': key } })`. Cheia = `tip:entityId` (ex. `rental_confirm:<requestId>`) ca să nu trimitem dublu la retry.
- **Masă 1:N**: două opțiuni, alese după caz:
  - **`batch.send`** (până la 100/apel) orchestrat prin **Workflow** pentru liste mari — control total, randare per-destinatar (personalizare), status în `email_messages`.
  - **Resend Broadcasts + Audiences** — când vrei UI de campanie „fără cod", draft → schedule, cu unsubscribe gestionat de Resend.
  - Recomandare: **batch via Workflow** ca motor principal (deții datele, personalizezi, loghezi), Broadcasts opțional pentru newsletter simplu.
- **Throttling**: respectă rate limits Resend; Workflow secvențiază natural.

### 4.5 Stratul de preview (desktop + mobile)

- Server action `renderTemplate(key, sampleData)` → rulează `render(<Template/>)` → **HTML**.
- În admin: afișează HTML-ul într-un **`<iframe srcDoc>`** cu comutator de lățime (ex. 600px „desktop" / 375px „mobile") și, ideal, randare reală (iframe izolează CSS-ul de email).
- Buton **„Trimite test"** către o adresă proprie (validarea finală e mereu într-un client real).
- În dev: **React Email preview server** (`email dev`) cu toggle desktop/mobile la `localhost`.
- Notă: preview-ul prin iframe e o aproximare bună, dar Outlook/MSO și dark mode se testează în clienți reali sau cu un tool de tip Litmus/Email on Acid.

### 4.6 Stratul de admin (UX) — pagini noi sub `/admin/email`

- **Template-uri**: listă + editor (subiect, blocuri, variabile) + preview live desktop/mobile + test send. „Predefinești" aici.
- **Contacte**: tabel cu căutare/filtre, adăugare manuală, **import CSV**, status consimțământ/unsubscribe, tag-uri.
- **Grupuri & Segmente**: creare grup static (adaugi contacte) și segment dinamic (definiție filtru).
- **Compune & Trimite**: alegi template → alegi grup/segment → preview → trimite acum / programează. Confirmare cu numărul de destinatari.
- **Jurnal / Analytics**: livrate, bounce, complaint, open; per campanie și per cerere.

---

## 5. Decizii de arhitectură (ADR) cu trade-off-uri

| Decizie                 | Variante                                     | Alegere & de ce                                                                                 |
| ----------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Motor de template       | raw HTML strings · MJML · **React Email**    | **React Email** — tip-safe, cross-client, ecosistem Resend, preview integrat                    |
| Editare conținut        | tot în cod · WYSIWYG raw HTML · **hibrid**   | **Hibrid** — structură în cod (sigură), conținut+variabile în DB (flexibil, fără risc)          |
| Sursa contactelor       | doar Resend Audiences · **Supabase (+sync)** | **Supabase** — RLS, GDPR, join cu cereri, independent de provider                               |
| Trimitere în masă       | doar Broadcasts · **batch via Workflow**     | **Batch via Workflow** — personalizare + logging proprii; Broadcasts opțional                   |
| Subdomenii de trimitere | unul singur · **separat tx vs marketing**    | **Separat** (`tx.` vs `news.`) — reputație izolată; o campanie nu strică livrarea confirmărilor |
| Orchestrare             | trimitere inline · **QStash/Workflow**       | **QStash/Workflow** — există deja; retry/DLQ/idempotency                                        |

---

## 6. Catalogul de tipuri de email (setul implicit recomandat)

Legendă: **U**=către utilizator/client, **A**=către admin, **M**=marketing (necesită consimțământ + unsubscribe).

### Tranzacționale — cereri (declanșate de `intake.ts`)

| Cheie template          | Declanșator                               | Către | Conținut                                                                                 |
| ----------------------- | ----------------------------------------- | ----- | ---------------------------------------------------------------------------------------- |
| `service_request_user`  | cerere serviciu creată (dacă are email)   | U     | confirmare + cod `#REQ` + rezumat (locație, suprafață, serviciu) + „te contactăm în 24h" |
| `service_request_admin` | idem                                      | A     | lead nou cu toate detaliile + link în panou + `replyTo` clientul                         |
| `rental_request_user`   | cerere închiriere creată (dacă are email) | U     | confirmare + utilaj + perioadă + cerințe de acces (din `emai.html` #2)                   |
| `rental_request_admin`  | idem                                      | A     | lead nou + detalii + link panou                                                          |

### Tranzacționale — ciclu de viață cerere (declanșate de schimbarea `status` în admin)

| Cheie               | Declanșator            | Către | Conținut                                   |
| ------------------- | ---------------------- | ----- | ------------------------------------------ |
| `request_in_review` | status → „În evaluare" | U     | „un inginer analizează cazul"              |
| `request_quoted`    | status → „Ofertat"     | U     | oferta / deviz (link sau PDF atașat) + CTA |
| `request_confirmed` | status → „Confirmat"   | U     | programare lucrare + pași următori         |
| `request_closed`    | status → „Închisă"     | U     | mulțumire + cerere de recenzie (Google)    |

### Sistem / auth (branded)

| Cheie                 | Declanșator        | Către | Notă                                                         |
| --------------------- | ------------------ | ----- | ------------------------------------------------------------ |
| `auth_password_reset` | reset parolă admin | A     | brandează emailul Supabase (SMTP custom) sau trimite din app |
| `auth_welcome`        | cont admin nou     | A     | opțional                                                     |

### Operaționale (admin)

| Cheie                 | Declanșator     | Către | Conținut                                                                 |
| --------------------- | --------------- | ----- | ------------------------------------------------------------------------ |
| `admin_daily_digest`  | cron zilnic     | A     | rezumatul cererilor noi din ultimele 24h (reutilizează cron-ul existent) |
| `admin_weekly_report` | cron săptămânal | A     | vol. cereri, conversii, articole publicate                               |

### Marketing / broadcast (necesită consimțământ + unsubscribe)

| Cheie                    | Declanșator                         | Către | Conținut                                   |
| ------------------------ | ----------------------------------- | ----- | ------------------------------------------ |
| `broadcast_custom`       | admin compune                       | M     | campanie liberă pe template ales           |
| `newsletter_new_article` | articol blog nou (ai deja blog AI!) | M     | anunț articol → trafic recurent + GEO      |
| `seasonal_offer`         | manual                              | M     | ofertă sezonieră (ex. amenajări primăvară) |
| `re_engagement`          | segment „cereri vechi neînchise"    | M     | follow-up                                  |

> „Ce mai e nevoie": cele 4 din ciclul de viață + digest-ul admin + newsletter-ul de articole sunt cele mai valoroase și de obicei uitate. Newsletter-ul de articole se leagă perfect de motorul tău de blog AI.

---

## 7. Conversia `design/admin/emai.html` → React Email

Fișierul conține deja două design-uri email-safe (tabel + stiluri inline + paleta brandului: header `#1e2a20` cu pattern topo, buton `#D88A24`, `data-table`, `alert-box`, footer). Plan de conversie:

1. **`EmailLayout`** (componentă partajată): `Html` `lang="ro"`, `Head`, `Preview` (preheader), `Body` (#fbf9f3), container 600px, **Header** (logo „PACA CONSTRUCT" pe fundal topo), `children`, **Footer** („© PACA CONSTRUCT SRL · Tehnicitate în armonie cu natura").
2. **Componente reutilizabile**: `Button`, `DataTable` (rânduri label/valoare), `AlertBox`, `Divider` — mapate 1:1 din clasele CSS existente.
3. **Variante (din cele 2 mockup-uri)**: `ServiceRequestUserEmail` (#1 „Confirmare evaluare") și `RentalRequestUserEmail` (#2 „Utilaj cu operator"). Restul tipurilor din §6 refolosesc layout-ul + blocuri.
4. **Tokeni de brand** centralizați (olive/amber/limestone/carbon) — aceiași ca în site.
5. **Reguli email-CSS** (obligatorii): stiluri **inline**, layout pe **`<table>`**, lățime 600px, fără flex/grid, fonturi cu fallback web-safe, imagini cu `alt` + dimensiuni explicite (anti-CLS în client), suport **dark mode** (meta + culori robuste), variantă **text** generată. Material Symbols + Tailwind CDN din mockup sunt **doar pentru pagina de preview**, nu intră în emailul real.

---

## 8. Deliverability & compliance (standarde 2026)

Reguli de bulk sender (Gmail/Yahoo/Outlook, valabile la volume mari, dar best-practice de la primul email):

- **Autentificare domeniu**: **SPF + DKIM + DMARC** aliniate (verifică domeniul în Resend). DMARC poate porni `p=none`, dar progresezi spre `quarantine`/`reject`.
- **Subdomenii separate**: `tx.pacaconstruct.ro` (tranzacțional) vs `news.pacaconstruct.ro` (marketing) — reputație izolată.
- **One-click unsubscribe (RFC 8058)** — **obligatoriu pentru marketing** (header `List-Unsubscribe` + `List-Unsubscribe-Post`); **NU** se aplică tranzacționalelor (confirmări, reset parolă sunt exceptate).
- **Rata de spam < 0.3%** (țintă < 0.1%). Peste prag → emailurile sunt **respinse la SMTP (bounce)**, nu doar trimise în spam.
- **Listă de supresie**: la `bounced`/`complained` (din webhooks) → marchezi contactul și **nu mai trimiți**. Onorează unsubscribe imediat.
- **Consimțământ**: marketing doar cu opt-in (ideal double opt-in); captarea din formulare necesită bifă explicită. Tranzacționalul nu necesită opt-in (e răspuns la o acțiune).
- **Conținut**: raport text/imagine sănătos, link-uri curate, fără „spam words", domeniu de tracking propriu.

---

## 9. Securitate

- **RLS**: `contacts`, `email_templates`, `email_campaigns`, `email_messages` = doar admin. Inserarea în `contacts` din formulare publice = doar prin server action controlat (nu direct).
- **Cheie Resend** `server-only`, niciodată în client.
- **Webhooks Resend**: verifică **semnătura** (Svix) înainte de a procesa — altfel oricine îți poate falsifica statusuri/unsubscribe.
- **Idempotency** pe trimiteri tranzacționale → fără dubluri la retry QStash.
- **Token de unsubscribe semnat** (HMAC cu secret server) în URL → nu permite dezabonarea altcuiva prin ghicirea unui id.
- **Anti-injection în template**: escapează toate valorile dinamice (deja există `escapeHtml`); variabilele din DB sunt date, nu cod.
- **Rate limit** pe acțiunile de trimitere din admin (reutilizează Upstash) + confirmare explicită la broadcast (numărul de destinatari).
- **PII în loguri**: nu loga corpuri complete cu date personale în monitoring.

---

## 10. Reziliență & observabilitate

- **Reutilizează QStash/Workflow**: fiecare trimitere = job cu `retries` + DLQ; broadcast = Workflow durabil (poate relua de unde a rămas, fără re-trimiteri datorită idempotency).
- **Mașină de stări** în `email_messages`: `queued → sent → delivered | bounced | complained | opened`.
- **Webhooks** actualizează statusul în timp real; alimentează analytics și supresia.
- **Sentry** (vezi `ANALIZA-PERFORMANTA.md`) pe eșecuri de randare/trimitere.
- **Dashboard admin**: livrate/bounce/complaint/open per campanie și per tip; alertă dacă bounce/complaint depășește pragul.

---

## 11. Plan de implementare pe faze (recomandat)

**Faza 1 — Fundație template + confirmări client (impact imediat):**
React Email + conversia `emai.html` (layout + 2 variante) → `service_request_user` + `rental_request_user` + brandarea notificărilor admin. Adaugă câmp email (opțional) la formularul de serviciu. Trimitere prin pipeline-ul QStash existent + idempotency.

**Faza 2 — Ciclul de viață al cererii:**
Email-uri pe schimbarea de status (în evaluare / ofertat / confirmat / închisă), declanșate din acțiunile de admin (`content.ts`).

**Faza 3 — Contacte & grupuri:**
Tabele `contacts`/`contact_groups`/segmente + UI admin (adăugare manuală, import CSV, auto-capture cu consimțământ din cereri).

**Faza 4 — Compose, preview & broadcast:**
Pagina „Compune & Trimite" + preview desktop/mobile (iframe) + test send + batch via Workflow. Template editabil (blocuri + variabile).

**Faza 5 — Webhooks, supresie, compliance & analytics:**
Webhooks Resend + listă de supresie + List-Unsubscribe one-click + DMARC/subdomenii + dashboard. Newsletter de articole (leagă de blogul AI).

---

## 12. Definiție de „gata" (cum verifici)

- Confirmările ajung la client (când există email) și notificările la admin, ambele cu template-ul brandat, randate corect în Gmail/Outlook/Apple Mail (test real, nu doar iframe).
- Preview desktop/mobile în admin reflectă fidel emailul; „trimite test" funcționează.
- Poți adăuga/importa contacte, le grupezi, alegi un grup și trimiți un broadcast cu preview.
- Domeniu autentificat (SPF/DKIM/DMARC verde), scor bun pe mail-tester.com.
- Bounce/complaint actualizate din webhooks; unsubscribe one-click funcțional pe marketing; supresia respectată.
- Idempotency confirmă: niciun email dublu la retry.

---

_Următorul pas firesc (ca la livrabilele anterioare): un `PROMPT-SISTEM-EMAIL.md` executabil, pe faze, cu schema SQL, componentele React Email, acțiunile server și UI-ul de admin. Spune-mi și îl compun._

### Surse (standarde 2026 folosite la analiză)

- React Email + Resend, render & preview desktop/mobile, `emails/` dir. — [reactemailtemplates.com](https://reactemailtemplates.com/blog/send-react-email-with-resend), [Sequenzy: send emails in Next.js 2026](https://www.sequenzy.com/blog/send-emails-nextjs)
- Resend Audiences / Broadcasts / Batch / Idempotency / Webhooks. — [Resend Broadcast API](https://resend.com/blog/broadcast-api), [Resend Audiences](https://resend.com/docs/dashboard/audiences/introduction)
- Reguli bulk sender 2026 (SPF/DKIM/DMARC, spam <0.3%, one-click unsubscribe pt. marketing, tranzacțional exceptat). — [PowerDMARC](https://powerdmarc.com/bulk-email-sender-requirements/), [Red Sift 2026 checklist](https://redsift.com/guides/bulk-email-sender-requirements)
