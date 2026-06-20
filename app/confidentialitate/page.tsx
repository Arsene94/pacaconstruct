import type { Metadata } from "next";
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
        {addressLine()}, CUI {siteConfig.cui}, prelucrează datele cu caracter
        personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și
        legislația națională aplicabilă. Această politică explică ce date
        colectăm, de ce și care sunt drepturile tale.
      </p>

      <h2>Ce date colectăm</h2>
      <p>
        Colectăm datele pe care ni le furnizezi direct prin formularele de
        contact și de solicitare ofertă: nume, telefon, adresă de email și
        detaliile proiectului descris. Colectăm și date tehnice minime de
        navigare (necesare funcționării site-ului și securității).
      </p>

      <h2>Scopul și temeiul prelucrării</h2>
      <ul>
        <li>
          <strong>Răspuns la solicitări</strong> — pentru a evalua proiectul și
          a-ți transmite o ofertă (temei: demersuri precontractuale).
        </li>
        <li>
          <strong>Comunicare</strong> — pentru a te contacta legat de cererea ta
          (temei: interesul nostru legitim / consimțământ).
        </li>
        <li>
          <strong>Obligații legale</strong> — facturare și arhivare, unde se
          aplică (temei: obligație legală).
        </li>
      </ul>

      <h2>Cât timp păstrăm datele</h2>
      <p>
        Păstrăm datele doar atât cât este necesar scopurilor de mai sus sau cât
        impune legea. {/* TODO: precizează termenele reale de retenție. */}
      </p>

      <h2>Cui dezvăluim datele</h2>
      <p>
        Nu vindem datele tale. Le putem dezvălui doar furnizorilor care ne ajută
        să operăm site-ul și să comunicăm (de ex. găzduire, email), pe bază de
        contract și doar în limita necesară. {/* TODO: listează împuterniciții
        reali (Supabase, Resend, Vercel, Upstash etc.). */}
      </p>

      <h2>Drepturile tale</h2>
      <p>
        Ai dreptul de acces, rectificare, ștergere, restricționare, opoziție și
        portabilitate, precum și dreptul de a depune o plângere la Autoritatea
        Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
        (ANSPDCP). Pentru exercitarea drepturilor, scrie-ne la{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
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
