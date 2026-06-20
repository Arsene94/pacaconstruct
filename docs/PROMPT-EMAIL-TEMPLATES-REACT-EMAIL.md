# PROMPT — Template-uri de email cu React Email (`@react-email/components`)

> Copiază tot între „═══ START PROMPT ═══" și „═══ END PROMPT ═══" și dă-l agentului de cod în repo-ul `paca-construct`.
> Acest prompt acoperă DOAR stratul de template-uri (componente + render + preview). Trimiterea/contactele/broadcast-ul sunt în `PROMPT-SISTEM-EMAIL.md`. Aici construim biblioteca de email-uri cu **React Email** și **`@react-email/components`**, convertind fidel design-ul aprobat din `design/admin/emai.html`.

---

═══ START PROMPT ═══

## ROL & OBIECTIV

Ești inginer senior frontend specializat în email development. Construiești **biblioteca de template-uri de email** a PACA CONSTRUCT folosind **React Email** și **`@react-email/components`**. Convertești design-ul HTML aprobat din `design/admin/emai.html` în componente React tip-safe, reutilizabile, randate la HTML cross-client (Gmail, Apple Mail, Outlook/MSO), cu variantă text și preview desktop/mobile.

Output-ul tău: un director `emails/` complet, cu layout + componente partajate, toate tipurile de email, un `registry` și un `render()` server-side. Nu construiești logica de trimitere aici — doar template-urile și randarea lor.

## CONTEXT (respectă exact)

- **Stack:** Next.js 16.2, React 19, TypeScript `strict`. Resend e deja instalat (îl folosește alt strat).
- **Design sursă:** `design/admin/emai.html` — 2 design-uri email-safe deja aprobate (1: „Confirmare solicitare evaluare", 2: „Solicitare utilaj cu operator"). Reprodu-le **fidel** ca aspect.
- **Identitate vizuală (tokeni din `app/globals.css` + `emai.html`):**
  - Olive (header/footer, titluri): `#1e2a20`
  - Amber (CTA/accent): `#d88a24`
  - Carbon (text tare): `#171a16`
  - Limestone (fundal pagină): `#fbf9f3`; bordură/limestone deschis: `#E6E1D7`
  - Text corp: `#434843`; text secundar: `#6B706A`; footer text: `#849284`
  - Alert verde (border): `#526529`; eroare: `#B91C1C`
- **Specul de design extras din `emai.html` (păstrează-l):**
  - Container 600px, fundal alb `#ffffff`, bordură `1px solid #E6E1D7`, pe fundal pagină `#fbf9f3`.
  - **Header:** fundal `#1e2a20` + pattern „topo" (`repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,.03) 10px 11px)`), logo „PACA CONSTRUCT" alb, 24px, bold, `letter-spacing:1px`, padding 24px, centrat.
  - **Content:** padding `32px 24px`. H1 email: 20px bold `#171a16`. Paragraf: 16px / line-height 24px `#434843`.
  - **Button (CTA):** fundal `#d88a24`, text alb `!important`, padding `14px 28px`, bold, `border-radius:2px`, inline-block.
  - **Data-table:** lățime 100%; `th` uppercase 12px `#6B706A` lățime 40%; `td` 14px; border-bottom `1px solid #E6E1D7`; padding 12px.
  - **Alert-box:** fundal `#f0eee8`, `border-left:4px solid #526529`, padding 16px.
  - **Divider:** `1px` `#E6E1D7`, margin `24px 0`.
  - **Footer:** fundal `#1e2a20`, text `#849284` 12px, centrat; semnătura „© {an} PACA CONSTRUCT SRL · Tehnicitate în armonie cu natura".
- **Unde se conectează (nu implementa aici, doar expune API-ul):** stratul de trimitere va importa `render(key, props)` din `emails/render.ts` și `registry` din `emails/registry.ts`.

## REGULI OBLIGATORII

1. **Citește documentația React Email** înainte de cod (componentele din `@react-email/components`, `render` din `@react-email/render`, `PreviewProps`, suport Tailwind/dark mode). Nu te baza pe memorie — API-ul evoluează.
2. **Folosește EXCLUSIV `@react-email/components`** ca primitive (`Html, Head, Font, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Link, Hr, Img`). Fără HTML brut ad-hoc; componentele rezolvă compatibilitatea cross-client.
3. **Email-safe:** stiluri inline (obiecte de stil derivate din tokeni), layout pe secțiuni/rânduri, lățime 600px, fonturi web-safe cu fallback, fără flex/grid modern, imagini cu `alt` + dimensiuni explicite.
4. **Tip-safe:** fiecare template are un tip de props exportat; valorile dinamice vin DOAR prin props. **Escapează** orice text provenit de la utilizator (React o face implicit în `{children}`, dar nu introduce `dangerouslySetInnerHTML`).
5. **Localizare RO:** `Html lang="ro"`, diacritice corecte, format dată `ro-RO`.
6. **Dark mode + accesibilitate:** culori robuste, contrast AA, `Preview` (preheader) la fiecare email, structură semantică.
7. Verifică după fiecare pas: `npx tsc --noEmit`, `npm run lint`, și preview-ul (`npm run email`).

## INSTALARE

```
npm i react-email @react-email/components
```

Adaugă în `package.json`: `"email": "email dev --dir emails"`.

## STRUCTURA DE FIȘIERE (creează exact)

```
emails/
  brand.ts                    # tokeni: culori, fonturi, spațiere, stiluri partajate
  components/
    email-layout.tsx          # Html>Head(Font,dark-mode)>Preview>Body>Container>Header>{children}>Footer
    header.tsx                # logo pe fundal topo
    footer.tsx               # semnătură + (slot) unsubscribe pt. marketing
    button.tsx               # CTA amber
    data-table.tsx           # rânduri {label,value}
    alert-box.tsx            # variante: info | warning | danger
    divider.tsx
    info-paragraph.tsx       # H1 + paragraf standard
  templates/
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
  registry.ts                 # key -> { component, category, audience, subject(props), sampleProps }
  render.ts                   # render(key, props) -> { subject, html, text }
  types.ts                    # tipuri partajate (BrandEmailProps, etc.)
```

## PASUL 1 — Tokeni de brand (`emails/brand.ts`)

Exportă culorile de mai sus, stack-uri de font web-safe (corp: `Arial, Helvetica, sans-serif`; titlu editorial: `Georgia, 'Times New Roman', serif` — ecou la Source Serif), spațieri, și obiecte de stil reutilizabile (`styles.container`, `styles.header`, `styles.h1`, `styles.paragraph`, `styles.button`, `styles.table`, `styles.th`, `styles.td`, `styles.alert`, `styles.divider`, `styles.footer`). Toate valorile EXACT ca în specul din `emai.html`.

## PASUL 2 — Layout + componente partajate

`emails/components/email-layout.tsx` (schelet de referință — completează-l):

```tsx
import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
} from "@react-email/components";
import { brand, styles } from "../brand";
import { Header } from "./header";
import { Footer } from "./footer";

export type EmailLayoutProps = {
  preheader: string;
  children: React.ReactNode;
  unsubscribeUrl?: string; // prezent doar la marketing
};

export function EmailLayout({ preheader, children, unsubscribeUrl }: EmailLayoutProps) {
  return (
    <Html lang="ro">
      <Head>{/* meta dark-mode + color-scheme; Font fallback web-safe */}</Head>
      <Preview>{preheader}</Preview>
      <Body
        style={{
          backgroundColor: brand.limestoneBg,
          margin: 0,
          padding: 0,
          fontFamily: brand.fontBody,
          color: brand.textBody,
        }}
      >
        <Container style={styles.container}>
          <Header />
          <Section style={{ padding: "32px 24px" }}>{children}</Section>
          <Footer unsubscribeUrl={unsubscribeUrl} />
        </Container>
      </Body>
    </Html>
  );
}
```

Construiește similar: `Header` (logo pe fundal topo `#1e2a20`), `Footer` (semnătura + slot unsubscribe condiționat), `Button` (folosește `<Button href style={styles.button}>`), `DataTable` (primește `rows: {label:string; value:string}[]` și randează un `<table>` cu stilurile th/td), `AlertBox` (prop `variant`), `Divider`, `InfoParagraph` (H1 + paragraf).

## PASUL 3 — Template-uri (toate; cu props tipate + `PreviewProps`)

Pattern de referință — `emails/templates/rental-request-user.tsx` (replică design-ul #2 din `emai.html`):

```tsx
import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "../components/email-layout";
import { DataTable } from "../components/data-table";
import { AlertBox } from "../components/alert-box";
import { brand } from "../brand";

export type RentalRequestUserProps = {
  name: string;
  code: string; // ex. REQ-2024-0892
  machine: string;
  period?: string;
  accessRequirements?: string;
};

export function RentalRequestUserEmail({
  name,
  code,
  machine,
  period,
  accessRequirements,
}: RentalRequestUserProps) {
  return (
    <EmailLayout preheader={`Cererea ta pentru ${machine} a fost înregistrată`}>
      <Heading
        as="h1"
        style={{ fontSize: 20, color: brand.textStrong, margin: "0 0 16px" }}
      >
        Solicitare utilaj cu operator — confirmată
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: "24px", color: brand.textBody }}>
        Salut {name}, am înregistrat solicitarea ta. Logistica pentru utilaj a fost
        programată.
      </Text>
      <AlertBox variant="info">
        <b>Referință: #{code}</b>
      </AlertBox>
      <DataTable
        rows={[
          { label: "Utilaj", value: machine },
          { label: "Perioadă", value: period ?? "—" },
          { label: "Operator", value: "Inclus" },
          { label: "Cerințe acces", value: accessRequirements ?? "—" },
        ]}
      />
      <Text style={{ fontSize: 14, color: brand.textMuted }}>
        Te contactăm în următoarele 24 de ore lucrătoare pentru detalii.
      </Text>
    </EmailLayout>
  );
}

RentalRequestUserEmail.PreviewProps = {
  name: "Andrei",
  code: "REQ-2024-0892",
  machine: "Excavator CAT 320",
  period: "15–18 Nov 2024",
  accessRequirements: "Lățime poartă min. 3.5m",
} satisfies RentalRequestUserProps;

export default RentalRequestUserEmail;
```

Implementează toate template-urile, fiecare cu: tip props exportat, `PreviewProps` cu date realiste RO, `export default`. Mapare conținut:

| Fișier / key            | Audiență  | Conținut                                                                                                                                                                               |
| ----------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `service-request-user`  | client    | confirmare evaluare (design #1 din `emai.html`): titlu, intro, referință `#code`, data-table (tip lucrare/locație/serviciu/suprafață), „te contactăm în 24h", CTA „Detalii solicitare" |
| `service-request-admin` | admin     | „Lead nou — serviciu": data-table cu nume/telefon/email/serviciu/locație/suprafață/descriere + CTA către panou; `replyTo` = clientul (setat de stratul de trimitere)                   |
| `rental-request-user`   | client    | vezi exemplul de mai sus (design #2)                                                                                                                                                   |
| `rental-request-admin`  | admin     | „Lead nou — închiriere": nume/telefon/email/utilaj/perioadă/locație/mesaj + CTA panou                                                                                                  |
| `request-in-review`     | client    | „Un inginer analizează cazul tău (#code)"                                                                                                                                              |
| `request-quoted`        | client    | „Oferta ta e gata" + AlertBox + Button `offerUrl`                                                                                                                                      |
| `request-confirmed`     | client    | „Lucrarea e confirmată" + detalii programare                                                                                                                                           |
| `request-closed`        | client    | mulțumire + Button „Lasă o recenzie" (`reviewUrl`)                                                                                                                                     |
| `admin-daily-digest`    | admin     | listă cereri noi 24h (map → DataTable/Rows) + counts                                                                                                                                   |
| `newsletter-article`    | marketing | imagine articol (`Img` cu alt), titlu, excerpt, Button „Citește" (`url`); layout cu slot unsubscribe în footer                                                                         |
| `broadcast-generic`     | marketing | titlu + corp pe blocuri (paragrafe/CTA) parametrizabile; footer cu unsubscribe                                                                                                         |

Reguli de conținut: ton premium-sobru, RO cu diacritice, un singur CTA principal/email, preheader relevant. Email-urile **marketing** (`newsletter-article`, `broadcast-generic`) primesc `unsubscribeUrl` și îl trec în `EmailLayout`/`Footer`.

## PASUL 4 — Registry (`emails/registry.ts`)

Exportă un obiect `registry` tipat: cheie → `{ component, category: 'tranzactional'|'marketing'|'sistem', audience: 'user'|'admin'|'broadcast', subject: (props) => string, sampleProps }`. `subject` generează subiectul (ex. `rental_request_user` → `\`Confirmare cerere închiriere — ${p.machine}\``). Cheile sunt IDENTICE cu cele folosite în `PROMPT-SISTEM-EMAIL.md` (`service_request_user`, `rental_request_admin`, `request_quoted`, ...). Exportă și un tip `EmailTemplateKey`.

## PASUL 5 — Render (`emails/render.ts`)

```ts
import "server-only";
import { render } from "@react-email/components"; // sau @react-email/render
import { registry, type EmailTemplateKey } from "./registry";

export async function renderEmail<K extends EmailTemplateKey>(
  key: K,
  props: Parameters<(typeof registry)[K]["subject"]>[0],
) {
  const entry = registry[key];
  const el = entry.component(props as never);
  const [html, text] = await Promise.all([render(el), render(el, { plainText: true })]);
  return { subject: entry.subject(props as never), html, text };
}
```

Adaptează semnătura exactă la API-ul instalat (verifică dacă `render` e async și acceptă `plainText`). Întoarce mereu `{ subject, html, text }`.

## PASUL 6 — Preview desktop/mobile

- `npm run email` pornește serverul React Email pe `emails/`; folosește `PreviewProps` și comutatorul desktop/mobile încorporat pentru a verifica fiecare template.
- Asigură-te că fiecare template se randează fără erori în preview și că preheader-ul, CTA-urile și data-table arată corect pe 600px și pe lățime mică.
- (Stratul de admin din `PROMPT-SISTEM-EMAIL.md` va reutiliza `renderEmail` pentru preview în iframe + „trimite test" — expune doar `renderEmail`.)

## PASUL 7 — Compatibilitate clienți & dark mode

- Inline styles peste tot; fără CSS extern (cu excepția `<Head>` minimal pentru dark-mode meta + `color-scheme`).
- Outlook/MSO: layout pe `Section`/`Row`/`Column`, fără proprietăți nesuportate; testează butonul (bulletproof button).
- Dark mode: setează `meta name="color-scheme" content="light dark"` + culori care rămân lizibile; evită text negru pe transparent.
- `Img`: `alt` obligatoriu, `width`/`height` setate (anti-CLS în client), URL-uri absolute (din `NEXT_PUBLIC_SITE_URL`).

## PASUL 8 — Verificare

- `npx tsc --noEmit` + `npm run lint` curat.
- Toate template-urile randează în `npm run email` cu `PreviewProps`.
- `renderEmail(key, sample)` întoarce `{subject, html, text}` valide pentru fiecare cheie.
- (Opțional, recomandat) trimite-ți câte un test în Gmail + Outlook + Apple Mail și verifică vizual; rulează un scor pe mail-tester.com.

## CRITERII DE ACCEPTARE (Definition of Done)

- Director `emails/` complet, construit DOAR cu `@react-email/components`.
- Cele 2 design-uri din `emai.html` reproduse fidel (header topo, button amber, data-table, alert-box, footer).
- Toate tipurile din tabel implementate, tip-safe, cu `PreviewProps` realiste RO.
- `registry` + `renderEmail` expuse, cu chei identice cu `PROMPT-SISTEM-EMAIL.md`.
- HTML + text generate; preview desktop/mobile funcțional; email-safe + dark mode + AA.

═══ END PROMPT ═══

---

## Note pentru tine (Arsene)

- Acest prompt produce **doar template-urile**. Le „pune în mișcare" promptul `PROMPT-SISTEM-EMAIL.md` (trimitere, contacte, broadcast, webhooks). Cheile din `registry.ts` sunt punctul de legătură — sunt aceleași în ambele.
- Recomand să rulezi întâi acest prompt (vezi imediat email-urile în preview), apoi `PROMPT-SISTEM-EMAIL.md`.
- Când ai logo-ul (din `PROMPT-LOGO-MASTER.md`), înlocuiește logo-text din `Header` cu `Img`-ul real (URL absolut, `alt="PACA CONSTRUCT"`).

### Surse

- [React Email + Resend în Next.js (2026)](https://reactemailtemplates.com/blog/send-react-email-with-resend) · [Send emails in Next.js 2026](https://www.sequenzy.com/blog/send-emails-nextjs)
