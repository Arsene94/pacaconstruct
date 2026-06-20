# PROMPT MASTER de implementare — Sistem de Email (PACA CONSTRUCT)

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod (Claude Code) în repo-ul `paca-construct`.
> Bazat pe `ANALIZA-SISTEM-EMAIL.md`. Executabil pe faze, cu schema SQL, componente React Email, acțiuni server și UI de admin. Fiecare fază are criterii de acceptare.

---

═══ START PROMPT ═══

## ROL & OBIECTIV

Ești inginer staff Next.js + arhitect de sisteme de email (10+ ani). Implementezi în repo-ul `paca-construct` un **sistem de email complet**: template-uri predefinite (editabile din admin), management de contacte și grupuri/segmente, trimitere segmentată (broadcast), preview desktop/mobile, și un set implicit de email-uri tranzacționale către clienți și admini.

Construiește **incremental, pe faze**, fără a rupe nimic existent. Reutilizează infrastructura prezentă (QStash/Workflow, Resend, Supabase, DAL). Țintă: cod production-grade, type-safe, rezilient, conform standardelor de deliverability 2026.

## CONTEXT EXACT AL REPO-ULUI (respectă aceste convenții)

- **Stack:** Next.js 16.2 (App Router, Server Components), React 19, Supabase, Upstash (Redis/QStash/Workflow), Resend (deja instalat), Tailwind 4, TypeScript `strict`.
- **Email azi:** `app/lib/notify/email.ts` (`sendLeadEmail`, HTML inline) + `app/lib/notify/notify.ts` (`notifyNewLead` → QStash) + worker `app/api/jobs/notify-request/route.ts` (verifică semnătura QStash). Trimite DOAR adminului. **Generalizează acest pipeline, nu-l rescrie de la zero.**
- **Template de brand sursă:** `design/admin/emai.html` — conține 2 design-uri email-safe (confirmare evaluare + utilaj cu operator), cu paleta: header `#1e2a20` + pattern topo, buton `#D88A24`, `data-table`, `alert-box`, footer. **Convertește-l în React Email.**
- **Supabase:** migrări în `supabase/migrations/` cu denumire `YYYYMMDDNNNNNN_nume.sql`. RLS prin funcția SQL **`public.is_admin()`**. Există trigger **`public.set_updated_at()`**. Enum-uri existente: `request_status`, `request_channel`. Cererile au INSERT public, restul admin.
- **Acțiuni admin:** în `app/actions/*.ts`, încep cu `await requireAdmin()` (din `@/app/lib/dal`), apoi `revalidatePath/revalidateTag`. Folosește `revalidateTag(tag, "max")` (semnătura Next 16).
- **Clienți Supabase:** `app/lib/supabase/server.ts` (cu cookies), `admin.ts` (`service_role`, server-only, ocolește RLS), `public.ts` (anon, pentru citiri cache-uite).
- **Cache de date:** `app/data/*.ts` folosesc `unstable_cache` cu tag-uri (vezi convenția existentă). Respect-o pentru noile module de date.
- **Intake:** `app/actions/intake.ts` — `submitServiceRequest` (NU colectează email azi) și `submitRentalRequest` (email opțional). Apelează `notifyNewLead`.
- **Env existent:** `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY`, `APP_BASE_URL`, `NEXT_PUBLIC_SITE_URL`.

## REGULI OBLIGATORII

1. **Citește documentația înainte de cod:** `node_modules/next/dist/docs/` (App Router, route handlers, server actions) ȘI documentația React Email (`@react-email/components`) ȘI API-ul Resend (emails.send, batch, broadcasts, webhooks, idempotency). Acest Next.js diferă de training — respectă convențiile reale.
2. **Nu rupe fluxul actual.** Cererile trebuie să funcționeze și fără email configurat (degradare grațioasă, ca azi). Nimic nu aruncă în calea vizitatorului.
3. **Pe faze, verificabil.** După fiecare fază: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Commit per fază.
4. **Securitate first:** cheia Resend `server-only`; RLS pe toate tabelele noi prin `public.is_admin()`; webhooks cu semnătură verificată; idempotency pe trimiteri; escapează toate valorile dinamice în template.
5. **Secrete prin env.** Nu hardcoda. Documentează fiecare variabilă nouă în `.env.example`.
6. La final: raport cu fișiere create/modificate, migrări, variabile env noi și pașii manuali (verificare domeniu, webhooks, subdomenii).

## DEPENDENȚE DE INSTALAT

```
npm i react-email @react-email/components
# (resend e deja instalat)
```

Adaugă scriptul `"email": "email dev"` în `package.json` pentru preview-ul local React Email.

## VARIABILE ENV NOI (adaugă în .env.example, documentate)

```
# Email — adrese & branding
EMAIL_FROM_TRANSACTIONAL="PACA CONSTRUCT <noreply@tx.pacaconstruct.ro>"
EMAIL_FROM_MARKETING="PACA CONSTRUCT <salut@news.pacaconstruct.ro>"
EMAIL_REPLY_TO="office@pacaconstruct.ro"
EMAIL_ADMIN_TO="office@pacaconstruct.ro"   # înlocuiește/ți NOTIFY_EMAIL_TO
# Webhooks & unsubscribe
RESEND_WEBHOOK_SECRET=        # din dashboard Resend (Svix)
EMAIL_UNSUBSCRIBE_SECRET=     # secret aleator pt. semnarea token-urilor HMAC
```

---

## FAZA 0 — Fundație template (React Email, conversia `emai.html`)

Creează structura:

```
emails/
  brand.ts                  # tokeni: olive #1e2a20, amber #d88a24, limestone #f1efe9, carbon #171a16, etc.
  components/
    email-layout.tsx        # Html lang="ro" > Head + Preview(preheader) + Body(#fbf9f3) + container 600px + Header(topo + logo) + {children} + Footer
    button.tsx              # CTA #d88a24
    data-table.tsx          # rânduri {label,value}
    alert-box.tsx           # border-left olive, fundal limestone
    divider.tsx
  templates/                # o componentă per tip (vezi catalogul §FAZA 4)
    service-request-user.tsx
    service-request-admin.tsx
    rental-request-user.tsx
    rental-request-admin.tsx
    request-in-review.tsx
    request-quoted.tsx
    request-confirmed.tsx
    request-closed.tsx
    admin-daily-digest.tsx
    newsletter-article.tsx
    broadcast-generic.tsx
  registry.ts               # mapă: key -> { component, category, audience, subject(props), sampleProps }
  render.ts                 # render(key, props) -> { html, text, subject }
```

Cerințe:

- Mapează 1:1 stilurile din `emai.html` (header topo, button, data-table, alert-box, footer „Tehnicitate în armonie cu natura"). Stiluri **inline**, layout pe `<table>`, lățime 600px, fonturi web-safe cu fallback, suport dark mode, imagini cu `alt`+dimensiuni.
- `render.ts` produce **HTML + variantă text** (folosește `render()` din `@react-email/render`).
- `registry.ts` e sursa unică de tipuri: fiecare intrare are `category` (`tranzactional|marketing|sistem`), `audience` (`user|admin|broadcast`), `subject(props)` și `sampleProps` (pentru preview).
- Material Symbols / Tailwind CDN din mockup sunt DOAR pentru pagina veche de preview — NU intră în emailul real.

**Acceptare:** `npm run email` pornește preview-ul; cele 2 variante din `emai.html` arată identic, cu date sample; `render(key, props)` întoarce HTML + text + subject.

---

## FAZA 1 — Schema bazei de date (migrări + RLS)

Creează `supabase/migrations/<timestamp>_email_system.sql`. Folosește `gen_random_uuid()`, `timestamptz default now()`, triggerul `set_updated_at`, și enum-uri noi.

```sql
-- Enum-uri
create type public.email_category   as enum ('tranzactional','marketing','sistem');
create type public.email_audience   as enum ('user','admin','broadcast');
create type public.contact_status   as enum ('active','unsubscribed','bounced','complained');
create type public.email_status     as enum ('queued','sent','delivered','bounced','complained','opened','failed');
create type public.campaign_status  as enum ('draft','scheduled','sending','sent','failed');

-- Template-uri (conținut editabil; structura rămâne în cod via registry key)
create table public.email_templates (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,           -- corespunde unei intrări din emails/registry.ts
  name        text not null,
  category    public.email_category not null,
  audience    public.email_audience not null,
  subject     text not null,
  preheader   text,
  blocks      jsonb not null default '{}',     -- { title, intro, cta_label, cta_url, note, ... }
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Contacte (sursa de adevăr, globale pe adresă)
create table public.contacts (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  name              text,
  phone             text,
  locale            text not null default 'ro',
  source            text not null default 'manual',  -- manual|import|service_request|rental_request
  marketing_consent boolean not null default false,
  consent_at        timestamptz,
  unsubscribed_at   timestamptz,
  status            public.contact_status not null default 'active',
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Grupuri statice + apartenențe
create table public.contact_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null, description text, created_at timestamptz not null default now()
);
create table public.contact_group_members (
  group_id uuid not null references public.contact_groups(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  primary key (group_id, contact_id)
);

-- Segmente dinamice (filtru evaluat la trimitere)
create table public.contact_segments (
  id uuid primary key default gen_random_uuid(),
  name text not null, definition jsonb not null default '{}', created_at timestamptz not null default now()
);

-- Campanii broadcast
create table public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  audience_kind text not null,        -- 'group' | 'segment'
  audience_id   uuid,
  subject_override text,
  status public.campaign_status not null default 'draft',
  scheduled_at timestamptz, sent_count integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- Jurnal trimiteri (audit + status) + evenimente webhook
create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  provider_id text,                   -- id Resend
  template_key text not null,
  to_email text not null,
  to_contact_id uuid references public.contacts(id) on delete set null,
  campaign_id uuid references public.email_campaigns(id) on delete set null,
  subject text not null,
  category public.email_category not null,
  status public.email_status not null default 'queued',
  idempotency_key text unique,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.email_messages(id) on delete cascade,
  provider_id text,
  event_type text not null,
  payload jsonb,
  occurred_at timestamptz not null default now()
);

-- Indexuri
create index on public.contacts (status);
create index on public.contacts using gin (tags);
create index on public.email_messages (status);
create index on public.email_messages (campaign_id);
create index on public.email_messages (to_contact_id);

-- Triggere updated_at (urmează tiparul existent set_updated_at)
create trigger set_updated_at before update on public.email_templates for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.contacts        for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.email_campaigns for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.email_messages  for each row execute function public.set_updated_at();
```

RLS (toate tabelele de mai sus): activează RLS și aplică **admin-only** prin `public.is_admin()` pentru TOATE operațiile, CU O EXCEPȚIE — `contacts` permite **INSERT public** (auto-capture din formulare), dar `select/update/delete` doar admin:

```sql
alter table public.contacts enable row level security;
create policy "contacts public insert" on public.contacts for insert with check (true);
create policy "contacts admin read"    on public.contacts for select using (public.is_admin());
create policy "contacts admin update"  on public.contacts for update using (public.is_admin()) with check (public.is_admin());
create policy "contacts admin delete"  on public.contacts for delete using (public.is_admin());
-- email_templates, contact_groups, contact_group_members, contact_segments,
-- email_campaigns, email_messages, email_events: enable RLS + 4 politici is_admin() (ca la `projects`).
```

Unsubscribe-ul public NU se face prin RLS, ci printr-o rută server cu token semnat + client admin (vezi FAZA 7).

Adaugă un **seed** (migrare separată sau în seed-ul existent) care populează `email_templates` cu rândurile implicite din catalog (FAZA 4), cu `key` egal cu cele din `registry.ts`.

**Acceptare:** migrările rulează curat; RLS testat (anon poate doar insera în `contacts`; restul blocat); seed-ul creează template-urile implicite.

---

## FAZA 2 — Strat de date (types + acces)

Creează `app/data/email.ts` și `app/data/contacts.ts` în stilul existent (`mapRow`, `returns<T>()`, tipuri publice, citiri cache-uite cu tag-uri `email`/`contacts` unde e potrivit). Funcții minime:

- Contacte: `getContacts(filter)`, `getContactById`, `getContactByEmail`, `countContacts`.
- Grupuri/segmente: `getGroups`, `getGroupWithMembers`, `getSegments`, `resolveAudience(kind,id) -> Contact[]` (pentru segmente, traduce `definition` jsonb în query Supabase).
- Template-uri: `getEmailTemplates`, `getEmailTemplate(key)` (merge cu `registry` pentru structură).
- Jurnal: `getEmailMessages(filter)`, `getCampaign(id)`, statistici agregate (counts pe status) pentru dashboard.

**Acceptare:** funcțiile întorc tipuri curate; `resolveAudience` produce lista corectă de destinatari activi (exclude `unsubscribed/bounced/complained`).

---

## FAZA 3 — Nucleul de trimitere (Resend + idempotency + orchestrare)

Creează `app/lib/email/`:

- `resend.ts`: client singleton `server-only`; `isConfigured()`; expune `getResend()`.
- `templates.ts`: `resolveTemplate(key, vars)` → ia structura din `emails/registry.ts` + conținutul editabil din `email_templates` (DB), interpolează variabilele `{{...}}` **escapate**, întoarce `{ subject, html, text }`.
- `send.ts`:
  - `sendEmail({ templateKey, to, vars, category, idempotencyKey, contactId?, campaignId?, listUnsubscribe? })`:
    1. randează (templates.ts), 2. inserează/upsert `email_messages` (status `queued`), 3. `resend.emails.send(...)` cu header `Idempotency-Key`, `from` în funcție de `category` (tx vs marketing), `replyTo`, și pentru marketing headerele `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, 4. actualizează `provider_id`+status `sent`. Prinde erorile → status `failed` + `error`, nu aruncă în flux.
  - Idempotency key: `tx` → `\`${templateKey}:${entityId}\``; broadcast → `\`${campaignId}:${contactId}\``.
- `dispatch.ts`: generalizează `notify.ts` — `enqueueEmail(payload)` publică job QStash spre `/api/jobs/send-email`; fallback inline dacă QStash lipsește. Nu aruncă niciodată.
- Worker nou `app/api/jobs/send-email/route.ts`: verifică semnătura QStash (ca la `notify-request`), apelează `sendEmail`.

Refactor: `app/lib/notify/notify.ts` și `email.ts` devin un caz particular (folosesc noul `sendEmail` cu `service_request_admin`/`rental_request_admin`). Păstrează API-ul `notifyNewLead` ca să nu strici `intake.ts`, dar pe dedesubt folosește noul nucleu.

**Acceptare:** un apel `sendEmail` randează template-ul brandat, scrie în `email_messages`, trimite via Resend, e idempotent (al doilea apel cu aceeași cheie nu dublează); fără QStash, trimite inline.

---

## FAZA 4 — Email-uri tranzacționale (catalogul implicit)

### 4.1 Confirmări client + notificări admin la intake

- `app/actions/intake.ts`:
  - **Adaugă câmp `email` (opțional)** la formularul de serviciu (UI în `app/contact/contact-form.tsx` + citire în `submitServiceRequest`). La închiriere există deja.
  - După inserarea cererii: trimite `*_admin` (mereu) + `*_user` (DOAR dacă există email client). Folosește `dispatch.enqueueEmail` cu idempotency pe `requestId`.
  - **Auto-capture contact** (cu `marketing_consent=false` implicit; adaugă o bifă opțională „vreau să primesc noutăți" → `true` + `consent_at`). Upsert în `contacts` cu `source` potrivit.

### 4.2 Email-uri pe ciclul de viață (din admin)

- În `app/actions/content.ts` (sau o acțiune nouă `app/actions/requests.ts`): la schimbarea `status` a unei cereri, trimite email-ul corespunzător clientului (dacă are email): `request_in_review`, `request_quoted` (cu link/atașament ofertă), `request_confirmed`, `request_closed` (+ CTA recenzie Google). `await requireAdmin()` + idempotency pe `\`${status}:${requestId}\``.

### Catalogul de tipuri (implementează toate; `key` = fișier registry + rând DB)

| key                     | category      | audience  | declanșator                   | variabile                                     |
| ----------------------- | ------------- | --------- | ----------------------------- | --------------------------------------------- |
| `service_request_user`  | tranzactional | user      | cerere serviciu (are email)   | name, code, service, location, surface        |
| `service_request_admin` | tranzactional | admin     | cerere serviciu               | name, phone, email, + detalii, adminUrl       |
| `rental_request_user`   | tranzactional | user      | cerere închiriere (are email) | name, code, machine, period, accessReq        |
| `rental_request_admin`  | tranzactional | admin     | cerere închiriere             | name, phone, email, machine, period, adminUrl |
| `request_in_review`     | tranzactional | user      | status→În evaluare            | name, code                                    |
| `request_quoted`        | tranzactional | user      | status→Ofertat                | name, code, offerUrl                          |
| `request_confirmed`     | tranzactional | user      | status→Confirmat              | name, code, scheduleInfo                      |
| `request_closed`        | tranzactional | user      | status→Închisă                | name, code, reviewUrl                         |
| `admin_daily_digest`    | sistem        | admin     | cron zilnic                   | requests[], counts                            |
| `newsletter_article`    | marketing     | broadcast | articol nou (opțional)        | title, excerpt, url, imageUrl                 |
| `broadcast_generic`     | marketing     | broadcast | admin compune                 | subject, body blocks                          |

**Acceptare:** la o cerere nouă cu email, clientul primește confirmarea brandată și adminul notificarea; la schimbarea statusului, clientul primește email-ul corect; totul logat în `email_messages`.

---

## FAZA 5 — Contacte & grupuri (UI admin)

Creează sub `app/admin/email/`:

- `contacts/page.tsx`: tabel (căutare, filtre status/tag), adăugare manuală, **import CSV** (parsează, validează email cu zod, dedup pe adresă, marchează `source='import'`), editare status/consimțământ/tag-uri.
- `groups/page.tsx` + `groups/[id]`: creare grup, adăugare/eliminare contacte; listare segmente (definiție jsonb).
- `app/actions/email.ts` (toate `await requireAdmin()`): `createContact`, `updateContact`, `deleteContact`, `importContacts`, `createGroup`, `addToGroup`, `removeFromGroup`, `createSegment`. Validare zod pe tot. `revalidatePath`/`revalidateTag("contacts","max")`.
- Adaugă intrare în navigația admin (`app/admin/admin-nav.tsx`).

**Acceptare:** adaugi/imporți contacte, le grupezi, vezi numărul de membri activi; dezabonații sunt excluși din audiențe.

---

## FAZA 6 — Compune, preview (desktop/mobile) & broadcast

- **Preview server action** `renderEmailPreview(key, vars)` → întoarce HTML (din `render.ts`). În UI: `<iframe srcDoc={html}>` cu **comutator de lățime** (toggle „Desktop 600px" / „Mobile 375px") și buton **„Trimite test"** către o adresă proprie (`sendEmail` cu category tx, idempotency aleator).
- `campaigns/new` (compose): alegi `template_key` → alegi audiență (grup sau segment) → editezi `blocks`/subiect → **preview live desktop/mobile** → „Trimite acum" sau „Programează" (`scheduled_at`). Confirmare cu numărul de destinatari rezolvați.
- **Broadcast durabil** `app/api/workflow/broadcast/route.ts` (Upstash Workflow): primește `campaignId`, rezolvă audiența, trimite în **batch-uri (≤100)** prin `resend.batch.send` cu idempotency per contact, actualizează `sent_count` și `status`. Reia de unde a rămas la retry (fără dubluri datorită idempotency). Declanșat dintr-o acțiune `sendBroadcast(campaignId)` (requireAdmin) care setează `status='sending'` și pornește workflow-ul.
- Pentru marketing: include automat `List-Unsubscribe` (token semnat per contact) în fiecare email.

**Acceptare:** preview-ul reflectă fidel emailul pe ambele lățimi; test send funcționează; un broadcast către un grup trimite la toți membrii activi, o singură dată, cu progres în `email_campaigns.sent_count`.

---

## FAZA 7 — Webhooks, supresie & unsubscribe

- `app/api/webhooks/resend/route.ts`: verifică **semnătura Svix** (`RESEND_WEBHOOK_SECRET`); mapează evenimentele → actualizează `email_messages.status` și scrie `email_events`:
  - `email.sent→sent`, `email.delivered→delivered`, `email.opened→opened`, `email.clicked→clicked`, `email.bounced→bounced` (+ marchează contactul `bounced`, **supresie**), `email.complained→complained` (+ `complained` + `unsubscribed_at` + supresie).
- **Listă de supresie:** `sendEmail` refuză trimiterea către contacte `unsubscribed/bounced/complained` (pentru marketing; tranzacționalul critic poate trece, dar nu către `bounced` hard).
- **Unsubscribe one-click:** `app/unsubscribe/route.ts` (GET + POST pentru RFC 8058) — verifică token-ul HMAC (`EMAIL_UNSUBSCRIBE_SECRET`), setează `unsubscribed_at` + `status='unsubscribed'`, afișează confirmare. `app/lib/email/unsubscribe.ts`: `signToken(contactId)` / `verifyToken(token)`.

**Acceptare:** statusurile se actualizează din webhooks; un bounce/complaint suprimă contactul; unsubscribe one-click funcționează din Gmail; nu se mai trimite către suprimați.

---

## FAZA 8 — Deliverability, compliance & hardening (standarde 2026)

- **Autentificare domeniu (manual + documentat):** verifică domeniul în Resend; configurează **SPF + DKIM + DMARC** (start `p=none` → progresează). Recomandă **subdomenii separate**: `tx.` (tranzacțional) și `news.` (marketing). Documentează pașii în `docs/EMAIL-DELIVERABILITY.md`.
- **Compliance:** `List-Unsubscribe` + `List-Unsubscribe-Post` pe TOT ce e marketing (nu pe tranzacțional); consimțământ explicit pentru marketing; respectă rata de spam < 0.3%.
- **Securitate:** cheie Resend `server-only`; webhooks semnate; idempotency peste tot; token unsubscribe HMAC; escape pe toate variabilele; `requireAdmin()` pe toate acțiunile; rate limit (Upstash) pe `sendTest`/`sendBroadcast`; fără PII în loguri.
- **Observabilitate:** loghează eșecurile (Sentry, dacă există din `PROMPT-PERFORMANTA.md`); dashboard `app/admin/email/page.tsx` cu counts pe status + per campanie.

**Acceptare:** scor bun pe mail-tester.com; domeniu verde (SPF/DKIM/DMARC); unsubscribe + supresie funcționale; acțiunile protejate și rate-limited.

---

## LIVRABIL FINAL (raportează)

1. Fișiere create/modificate, pe faze. 2. Migrări noi + rezumat schema. 3. Variabile env noi. 4. Output `tsc`/`lint`/`build`. 5. Pași manuali rămași: verificare domeniu Resend, configurare webhook (URL + secret), subdomenii DNS, completare date reale `EMAIL_*`.

## CRITERII GLOBALE DE ACCEPTARE (Definition of Done)

- Template-urile din `emai.html` convertite în React Email; preview desktop/mobile în admin + test send.
- La cerere nouă: client primește confirmare (dacă are email) + admin notificare, brandate, logate.
- Email-uri pe ciclul de viață al cererii (în evaluare/ofertat/confirmat/închisă).
- Contacte: adăugare manuală + import CSV + auto-capture cu consimțământ; grupuri + segmente.
- Broadcast către un grup/segment, în batch, idempotent, cu progres și unsubscribe one-click.
- Webhooks → status + supresie; bounce/complaint respectate.
- Domeniu autentificat; conform 2026 (SPF/DKIM/DMARC, spam <0.3%, one-click unsubscribe pe marketing).
- `tsc`/`lint`/`build` curat; RLS admin-only (mai puțin INSERT public pe `contacts`); idempotency confirmă zero dubluri.

═══ END PROMPT ═══

---

## Note pentru tine (Arsene) — context, nu parte din prompt

- **Conturi/DNS pe care le faci tu:** verificarea domeniului în Resend, înregistrările SPF/DKIM/DMARC, subdomeniile `tx.`/`news.`, și configurarea webhook-ului în dashboard-ul Resend (URL `/api/webhooks/resend` + secret). Agentul lasă `// TODO` pentru valori.
- **Decizie de produs:** vrei bifă de consimțământ marketing pe formulare? (recomandat — îți construiește o listă legală pentru newsletter/oferte). Tranzacționalul nu are nevoie de ea.
- **Recomand execuția pe faze**, în ordine: 0→1→2→3→4 îți dau deja confirmările către clienți (cel mai mare câștig). 5→6 aduc broadcast-ul. 7→8 sunt hardening + deliverability.
- **Suprapuneri utile:** Sentry (din `PROMPT-PERFORMANTA.md`) e folosit la observabilitate; datele reale de contact (din `PROMPT-SEO-GEO.md`, `site-config`) alimentează footerul email-urilor.

### Surse (standarde 2026)

- [React Email + Resend în Next.js](https://reactemailtemplates.com/blog/send-react-email-with-resend) · [Resend Broadcasts](https://resend.com/blog/broadcast-api) · [Resend Audiences](https://resend.com/docs/dashboard/audiences/introduction)
- [Bulk sender requirements 2026 (PowerDMARC)](https://powerdmarc.com/bulk-email-sender-requirements/) · [Red Sift checklist](https://redsift.com/guides/bulk-email-sender-requirements)
