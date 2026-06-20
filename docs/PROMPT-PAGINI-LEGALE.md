# PROMPT — Pagini legale: Confidențialitate + Cookie-uri + banner consimțământ (PACA CONSTRUCT)

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod în repo-ul `paca-construct`.
> Pune politica de confidențialitate redactată în pagina existentă, creează pagina `/cookies` (acum linkată dar inexistentă, deci 404), și leagă bannerul de consimțământ. Conținutul textual e gata în `docs/ANALIZA-SI-POLITICA-CONFIDENTIALITATE.md` (Partea 2) și `docs/POLITICA-COOKIES-SI-CONSIMTAMANT.md`.

---

═══ START PROMPT ═══

## ROL & OBIECTIV

Inginer Next.js. Publici paginile legale ale PACA CONSTRUCT folosind componenta-cadru existentă, fără să inventezi text juridic (textul e furnizat). Trei lucruri:

1. Înlocuiești conținutul din `app/confidentialitate/page.tsx` cu politica de confidențialitate redactată (Partea 2 din `ANALIZA-SI-POLITICA-CONFIDENTIALITATE.md`).
2. Creezi `app/cookies/page.tsx` cu politica de cookie-uri (Partea 1 din `POLITICA-COOKIES-SI-CONSIMTAMANT.md`).
3. Conectezi bannerul de consimțământ (microcopy gata în `POLITICA-COOKIES-SI-CONSIMTAMANT.md`, Partea 2; mecanismul în `PROMPT-GTM-TRACKING.md`, FAZA 6).

## CONTEXT EXACT (respectă)

- **Componentă-cadru:** `app/components/legal-page.tsx` exportă `LegalPage` (async), cu props `{ title, breadcrumbLabel, path, updatedAt, children }`. Randează Navbar + breadcrumb + breadcrumb JSON-LD + titlu + „ultima actualizare" + conținut prose + Footer. Conținutul concret vine din pagina apelantă, ca JSX (`<p>`, `<h2>`, `<ul>`, etc.).
- **Pagina de confidențialitate** există (`app/confidentialitate/page.tsx`) și folosește deja `LegalPage` + `siteConfig` (`legalName`, `addressLine()`, `cui`, `phone`, `phoneDisplay`, `email`). Are `export const dynamic = "force-dynamic"` (navbar citește din DB).
- **`siteConfig`** (`app/lib/site-config.ts`) conține `legalName`, `cui` (TODO), `registrationNumber` (TODO), `address`, `phone`, `phoneDisplay`, `email`, `emailOffice`. **Folosește aceste valori, nu literal `[a se completa]`** — câmpurile reale se completează o singură dată în `siteConfig`.
- **Footer** (`app/components/footer.tsx`) leagă deja `/confidentialitate`, `/cookies`, `/termeni`.
- **Sitemap** (`app/sitemap.ts`) include deja `/confidentialitate`, `/cookies`, `/termeni`.
- Stil: prose în paleta site-ului (olive/amber/stone). Diacritice corecte. Fără em-dash.

## REGULI

1. Nu modifica textul juridic furnizat (doar îl transpui în JSX). Nu adăuga clauze noi.
2. Folosește `siteConfig` pentru identificarea operatorului și datele de contact; unde lipsesc valori reale, ele rămân `// TODO` în `siteConfig`, nu hardcodate în pagină.
3. `npx tsc --noEmit` + `lint` + `build` curat.

---

## FAZA 1 — Înlocuiește conținutul paginii de confidențialitate

În `app/confidentialitate/page.tsx`, păstrează wrapper-ul `LegalPage` și `metadata`, dar înlocuiește `children` cu structura din Partea 2 a politicii (secțiunile 1-11): operator, ce date colectăm, scopuri și temeiuri, retenție, destinatari, cookie-uri (cu link la `/cookies`), transferuri internaționale (DPF + SCC), securitate, drepturi (cu datele ANSPDCP complete), modificări, contact. Mapează datele de identificare pe `siteConfig` (`legalName`, `addressLine()`, `cui`, `registrationNumber`, `phone`/`phoneDisplay`, `email`). Păstrează `updatedAt="iunie 2026"`.

**Acceptare:** `/confidentialitate` afișează politica completă; datele de firmă vin din `siteConfig`; link spre `/cookies` și spre ANSPDCP funcționează.

## FAZA 2 — Creează pagina de cookie-uri

Creează `app/cookies/page.tsx` pe modelul paginii de confidențialitate:

- `export const dynamic = "force-dynamic";`
- `metadata`: title „Politica de cookie-uri", description scurtă, `alternates: { canonical: "/cookies" }`, `robots: { index: true, follow: true }`.
- `<LegalPage title="Politica de cookie-uri" breadcrumbLabel="Cookie-uri" path="/cookies" updatedAt="iunie 2026">` cu conținutul din Partea 1 (secțiunile 1-8).
- **Tabelele de cookie-uri** (cele 3 categorii): randează-le ca `<table>` lizibile. Dacă stilul prose din `LegalPage` nu stilează tabele, adaugă clase Tailwind minime (border, padding, `th` uppercase mic, `td` text-sm), în spiritul paginilor existente.
- Datele de contact din `siteConfig`.

**Acceptare:** `/cookies` nu mai dă 404; afișează categoriile și tabelele; e linkată din footer și apare în sitemap (deja sunt).

## FAZA 3 — Banner de consimțământ (microcopy)

Bannerul în sine se construiește în `PROMPT-GTM-TRACKING.md` (FAZA 6). Aici doar furnizezi textul: folosește microcopy-ul din `POLITICA-COOKIES-SI-CONSIMTAMANT.md`, Partea 2 (titlu, text, butoanele „Accept toate" / „Refuz toate" / „Preferințe", descrierile categoriilor Strict necesare / Analiză / Marketing, „Salvează preferințele", link permanent „Modifică preferințele de cookie-uri" în footer, legături către `/cookies` și `/confidentialitate`). Asigură-te că „Refuz toate" e la același nivel vizual cu „Accept toate" (cerință GDPR).

**Acceptare:** bannerul folosește exact acest microcopy; link-ul „Modifică preferințele" e prezent în footer și redeschide bannerul.

## FAZA 4 — Completări în `siteConfig` (raportează ca TODO)

Confirmă că în `siteConfig` sunt completate (sau marcate `// TODO`): `cui`, `registrationNumber`, `address` reală, `email` de contact pentru date personale. Acestea alimentează ambele pagini. Nu inventa valori.

**Acceptare:** paginile randează datele reale din `siteConfig` odată completate; nicăieri date hardcodate în pagini.

## CRITERII GLOBALE (Definition of Done)

- `/confidentialitate` are politica completă redactată; `/cookies` există și e completă.
- Datele firmei vin din `siteConfig` (o singură sursă).
- Bannerul folosește microcopy-ul aprobat; „Refuz" la fel de simplu ca „Accept".
- Footer + sitemap leagă cele trei pagini legale (deja); fără em-dash; build curat.

═══ END PROMPT ═══

---

## Notă pentru tine (Arsene)

- Textele sunt deja scrise și validate ca structură; promptul doar le pune în cod. **Înainte de a fi „live legal", completează în `siteConfig` CUI, nr. Reg. Com., sediul real și emailul de contact pentru date**, și roagă un avocat/DPO să dea OK-ul final.
- `/cookies` era linkat din footer dar pagina nu exista (404). Promptul o creează, deci dispare și problema asta.
- Pasul următor opțional, dacă vrei „pachet legal complet": o pagină de Termeni și condiții redactată la fel de riguros (acum e tot text-cadru).
