import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";
import { siteConfig, addressLine } from "@/app/lib/site-config";

// Navbar-ul citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectează, folosește și protejează PACA CONSTRUCT SRL datele cu caracter personal, conform GDPR (Regulamentul UE 2016/679).",
  alternates: { canonical: "/confidentialitate" },
  robots: { index: true, follow: true },
};

// TODO: text-cadru GDPR — trebuie revizuit de un consultant juridic / DPO
// înainte de lansare și completat cu detaliile reale de prelucrare.
export default function ConfidentialitatePage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      breadcrumbLabel="Confidențialitate"
      path="/confidentialitate"
      updatedAt="iunie 2026"
    >
      <p>
        {siteConfig.legalName} (în continuare „noi” / „operatorul”), cu sediul în{" "}
        {addressLine()}, CUI {siteConfig.cui}, prelucrează datele cu caracter personal în
        conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația națională
        aplicabilă. Această politică explică ce date colectăm, de ce și care sunt
        drepturile tale.
      </p>

      <h2>Ce date colectăm</h2>
      <ul>
        <li>
          <strong>Date din formulare</strong> — nume, telefon, adresă de email (opțional),
          locația și detaliile proiectului descris, prin formularele de contact și de
          solicitare închiriere utilaj.
        </li>
        <li>
          <strong>Date de abonare la newsletter</strong> — adresa de email și, dacă le
          furnizezi, numele și telefonul, atunci când bifezi acordul pentru comunicări de
          marketing.
        </li>
        <li>
          <strong>Date tehnice și de utilizare</strong> — adresă IP, tip de dispozitiv și
          browser, pagini vizitate, sursa traficului și identificatorii de campanie (ex.
          gclid, fbclid, parametri UTM), colectate prin cookie-uri și tehnologii similare.
        </li>
      </ul>

      <h2>Scopul și temeiul prelucrării</h2>
      <ul>
        <li>
          <strong>Răspuns la solicitări</strong> — pentru a evalua proiectul și a-ți
          transmite o ofertă (temei: demersuri precontractuale, art. 6(1)(b) GDPR).
        </li>
        <li>
          <strong>Comunicare</strong> — pentru a te contacta legat de cererea ta (temei:
          interesul nostru legitim, art. 6(1)(f)).
        </li>
        <li>
          <strong>Newsletter și marketing</strong> — pentru a-ți trimite noutăți și
          oferte, doar dacă ți-ai dat acordul (temei: consimțământ, art. 6(1)(a)). Te poți
          dezabona oricând.
        </li>
        <li>
          <strong>Analiză și publicitate</strong> — pentru statistici de trafic și
          măsurarea eficienței reclamelor, doar pe baza consimțământului pentru cookie-uri
          (temei: consimțământ, art. 6(1)(a)).
        </li>
        <li>
          <strong>Obligații legale</strong> — facturare și arhivare, unde se aplică
          (temei: obligație legală, art. 6(1)(c)).
        </li>
        <li>
          <strong>Securitate</strong> — prevenirea abuzurilor și protejarea site-ului
          (temei: interes legitim, art. 6(1)(f)).
        </li>
      </ul>

      <h2>Cookie-uri și tehnologii de urmărire</h2>
      <p>
        Folosim cookie-uri și tehnologii similare pentru funcționarea site-ului,
        statistici și marketing. Instrumentele de analiză și publicitate (Google, Meta,
        TikTok) sunt încărcate prin Google Tag Manager, cu{" "}
        <strong>Google Consent Mode v2</strong> setat implicit pe „refuzat”, deci nu
        rulează cu cookie-uri fără acordul tău. Detalii complete și modul de gestionare a
        consimțământului în <Link href="/cookies">Politica de cookie-uri</Link>.
      </p>

      <h2>Cât timp păstrăm datele</h2>
      <ul>
        <li>
          <strong>Solicitări și oferte</strong> — pe durata relației și până la 3 ani de
          la ultimul contact, pentru a putea relua discuția.
        </li>
        <li>
          <strong>Documente financiar-contabile</strong> — 10 ani, conform legislației
          contabile.
        </li>
        <li>
          <strong>Date de newsletter</strong> — până la dezabonare sau retragerea
          consimțământului.
        </li>
        <li>
          <strong>Date din cookie-uri</strong> — pe durata fiecărui cookie (vezi Politica
          de cookie-uri).
        </li>
      </ul>

      <h2>Cui dezvăluim datele</h2>
      <p>
        Nu vindem datele tale. Le putem dezvălui doar furnizorilor (împuterniciți) care ne
        ajută să operăm site-ul și serviciile, pe bază de contract și doar în limita
        necesară:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — găzduirea bazei de date și autentificare;
        </li>
        <li>
          <strong>Resend</strong> — trimiterea emailurilor (confirmări, newsletter);
        </li>
        <li>
          <strong>Upstash</strong> — caching, limitarea abuzurilor, cozi de procesare și
          căutare;
        </li>
        <li>
          <strong>Vercel</strong> — găzduirea și livrarea site-ului;
        </li>
        <li>
          <strong>Google, Meta, TikTok</strong> — analiză și publicitate, doar pe baza
          consimțământului pentru cookie-uri.
        </li>
      </ul>

      <h2>Transferuri internaționale</h2>
      <p>
        Unii furnizori pot prelucra date în afara Spațiului Economic European. În aceste
        cazuri, transferul se bazează pe garanții adecvate (de regulă Clauzele
        Contractuale Standard ale Comisiei Europene) și/sau pe decizii de adecvare.
      </p>

      <h2>Securitatea datelor</h2>
      <p>
        Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele
        împotriva accesului neautorizat, pierderii sau divulgării (criptare în tranzit,
        control al accesului, limitarea abuzurilor).
      </p>

      <h2>Drepturile tale</h2>
      <p>
        Ai dreptul de acces, rectificare, ștergere, restricționare, opoziție și
        portabilitate, dreptul de a-ți retrage consimțământul oricând (fără a afecta
        prelucrările anterioare) și dreptul de a depune o plângere la Autoritatea
        Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP,{" "}
        <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
          dataprotection.ro
        </a>
        ). Pentru exercitarea drepturilor, scrie-ne la{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Modificări ale acestei politici</h2>
      <p>
        Putem actualiza periodic această politică. Versiunea curentă și data ultimei
        actualizări sunt afișate în capul paginii.
      </p>

      <h2>Contact</h2>
      <p>
        {siteConfig.legalName} · {addressLine()} ·{" "}
        <a href={`tel:${siteConfig.phone}`}>{siteConfig.phoneDisplay}</a> ·{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </LegalPage>
  );
}
