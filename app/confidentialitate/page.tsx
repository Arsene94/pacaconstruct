import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";
import { siteConfig, addressLine } from "@/app/lib/site-config";
import { getSiteSettings } from "../data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";

// Navbar-ul citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const revalidate = 86400; // ISR: conținut care se schimbă rar

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectează, folosește și protejează PACA CONSTRUCT SRL datele cu caracter personal, conform GDPR (Regulamentul UE 2016/679).",
  alternates: { canonical: "/confidentialitate" },
  robots: { index: true, follow: true },
};

// TODO: text-cadru GDPR — trebuie revizuit de un consultant juridic / DPO
// înainte de lansare. Datele de identificare (CUI, nr. Reg. Com., sediu, email,
// telefon) vin din `siteConfig` și trebuie completate acolo cu valorile reale.
export default async function ConfidentialitatePage() {
  // Telefonul și emailul vin din DB (site_settings), nu din config.
  const settings = await getSiteSettings();
  const phone = getPrimaryPhone(settings);
  const email = settings.contact.emailPrimary;

  return (
    <LegalPage
      title="Politica de confidențialitate"
      breadcrumbLabel="Confidențialitate"
      path="/confidentialitate"
      updatedAt="iunie 2026"
    >
      <h2>1. Operatorul de date</h2>
      <p>
        Prezenta politică descrie modul în care {siteConfig.legalName}, persoană juridică
        română cu sediul în {addressLine()}, înregistrată la Registrul Comerțului sub nr.{" "}
        {siteConfig.registrationNumber}, cod unic de înregistrare {siteConfig.cui}{" "}
        (denumită în continuare „PACA CONSTRUCT”, „noi” sau „operatorul”), colectează și
        prelucrează datele cu caracter personal ale persoanelor care îi vizitează site-ul
        sau îi solicită serviciile.
      </p>
      <p>
        Prelucrarea se realizează în conformitate cu Regulamentul (UE) 2016/679 (GDPR),
        Legea nr. 190/2018 și Legea nr. 506/2004.
      </p>
      <p>
        Pentru orice întrebare privind protecția datelor sau pentru exercitarea
        drepturilor, ne puteți contacta la <a href={`mailto:${email}`}>{email}</a>
        {phone ? (
          <>
            {" "}
            sau la <a href={telLink(phone)}>{phone.display}</a>
          </>
        ) : null}
        .
      </p>

      <h2>2. Ce date colectăm</h2>
      <p>Colectăm numai datele necesare scopurilor de mai jos:</p>
      <ul>
        <li>
          <strong>Date furnizate prin formulare</strong> (cerere de serviciu sau de
          închiriere utilaj): numele, numărul de telefon, adresa de email (opțională),
          localitatea, suprafața aproximativă și descrierea lucrării.
        </li>
        <li>
          <strong>Date de abonare la comunicări comerciale</strong>: adresa de email și,
          dacă le furnizați, numele și telefonul, atunci când bifați acordul pentru
          newsletter.
        </li>
        <li>
          <strong>Date tehnice și de utilizare</strong>: adresa IP, tipul de dispozitiv și
          de browser, paginile vizitate, sursa traficului și identificatorii de campanie
          (de exemplu gclid, fbclid, parametri UTM), colectate prin cookie-uri și
          tehnologii similare, în condițiile secțiunii 6.
        </li>
      </ul>
      <p>
        Nu colectăm date din categorii speciale (privind sănătatea, opiniile, originea
        etc.) și nu adresăm serviciile noastre minorilor.
      </p>

      <h2>3. În ce scopuri și în ce temei prelucrăm datele</h2>
      <ul>
        <li>
          <strong>Pentru a răspunde solicitărilor și a ofertare</strong>: prelucrarea este
          necesară pentru demersuri precontractuale făcute la cererea dumneavoastră (art.
          6 alin. (1) lit. b GDPR).
        </li>
        <li>
          <strong>Pentru a vă contacta</strong> în legătură cu cererea: în temeiul
          interesului nostru legitim de a gestiona relația cu solicitantul (art. 6 alin.
          (1) lit. f).
        </li>
        <li>
          <strong>Pentru newsletter și oferte</strong>: numai cu consimțământul
          dumneavoastră (art. 6 alin. (1) lit. a). Vă puteți dezabona oricând.
        </li>
        <li>
          <strong>Pentru statistici și măsurarea reclamelor</strong>: numai pe baza
          consimțământului pentru cookie-uri (art. 6 alin. (1) lit. a și Legea 506/2004).
        </li>
        <li>
          <strong>Pentru securitatea site-ului</strong> și prevenirea abuzului asupra
          formularelor: în temeiul interesului legitim (art. 6 alin. (1) lit. f), cu
          păstrarea datelor pe perioade scurte.
        </li>
        <li>
          <strong>Pentru obligații legale</strong> de facturare și arhivare, atunci când
          contractăm: în temeiul obligației legale (art. 6 alin. (1) lit. c).
        </li>
      </ul>
      <p>
        Nu luăm decizii automate care să producă efecte juridice asupra dumneavoastră.
      </p>

      <h2>4. Cât timp păstrăm datele</h2>
      <ul>
        <li>
          <strong>Solicitările și ofertele</strong>: pe durata relației și până la 3 ani
          de la ultimul contact, pentru a putea relua discuția.
        </li>
        <li>
          <strong>Documentele financiar-contabile</strong>: pe termenele prevăzute de
          legislația contabilă și fiscală (registrele contabile, 10 ani).
        </li>
        <li>
          <strong>Datele de newsletter</strong>: până la dezabonare sau la retragerea
          consimțământului.
        </li>
        <li>
          <strong>Datele tehnice din cookie-uri</strong>: pe durata fiecărui cookie,
          conform Politicii de cookie-uri.
        </li>
      </ul>
      <p>La expirarea termenelor, datele se șterg sau se anonimizează.</p>

      <h2>5. Cui dezvăluim datele</h2>
      <p>
        Nu vindem datele dumneavoastră. Le dezvăluim numai furnizorilor care ne ajută să
        operăm site-ul și serviciile, pe bază de contract de prelucrare (art. 28 GDPR) și
        strict în limita necesară:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> (găzduirea bazei de date și autentificare);
        </li>
        <li>
          <strong>Vercel</strong> (găzduirea și livrarea site-ului);
        </li>
        <li>
          <strong>Upstash</strong> (cache, limitarea abuzului, cozi de procesare,
          căutare);
        </li>
        <li>
          <strong>Resend</strong> (trimiterea emailurilor de confirmare și de newsletter);
        </li>
        <li>
          <strong>Google, Meta, TikTok</strong> (analiză și publicitate), numai pe baza
          consimțământului pentru cookie-uri.
        </li>
      </ul>
      <p>Putem dezvălui date și autorităților publice, atunci când legea ne obligă.</p>

      <h2>6. Cookie-uri și tehnologii de urmărire</h2>
      <p>
        Folosim cookie-uri strict necesare pentru funcționarea site-ului și, numai cu
        acordul dumneavoastră, cookie-uri de analiză și de publicitate. Instrumentele
        Google, Meta și TikTok sunt încărcate prin Google Tag Manager, cu{" "}
        <strong>Google Consent Mode v2</strong> setat implicit pe „refuzat”: niciun cookie
        de analiză sau de marketing nu se plasează înainte de acordul dumneavoastră. Vă
        puteți modifica oricând alegerea din bannerul de consimțământ sau din link-ul
        „Modifică preferințele de cookie-uri” din subsolul site-ului. Detaliile complete
        (lista cookie-urilor, durata, furnizorul) se află în{" "}
        <Link href="/cookies">Politica de cookie-uri</Link>.
      </p>

      <h2>7. Transferuri în afara Spațiului Economic European</h2>
      <p>
        O parte dintre furnizorii noștri pot prelucra date în afara SEE, inclusiv în
        Statele Unite. În aceste cazuri, transferul se întemeiază pe:
      </p>
      <ul>
        <li>
          decizia de adecvare a Comisiei Europene privind Cadrul UE-SUA de
          confidențialitate a datelor (EU-U.S. Data Privacy Framework), pentru furnizorii
          certificați; și/sau
        </li>
        <li>
          Clauzele Contractuale Standard ale Comisiei Europene, însoțite de măsuri
          suplimentare acolo unde este necesar.
        </li>
      </ul>
      <p>
        Puteți obține o copie a garanțiilor aplicabile scriindu-ne la adresa de contact
        din secțiunea 1.
      </p>

      <h2>8. Securitatea datelor</h2>
      <p>
        Aplicăm măsuri tehnice și organizatorice adecvate pentru a proteja datele
        împotriva accesului neautorizat, pierderii sau divulgării: criptare în tranzit,
        control al accesului pe bază de roluri, limitarea automată a abuzului și separarea
        mediilor. Niciun sistem nu este complet sigur, însă urmărim un nivel de protecție
        corespunzător riscului (art. 32 GDPR).
      </p>

      <h2>9. Drepturile dumneavoastră</h2>
      <p>În calitate de persoană vizată, aveți dreptul:</p>
      <ul>
        <li>de acces la date și de a obține o copie;</li>
        <li>de rectificare a datelor inexacte;</li>
        <li>de ștergere („dreptul de a fi uitat”);</li>
        <li>de restricționare a prelucrării;</li>
        <li>
          de opoziție, inclusiv opoziția la marketing direct, care se respectă
          necondiționat;
        </li>
        <li>de portabilitate a datelor;</li>
        <li>
          de a vă retrage consimțământul oricând, fără a afecta legalitatea prelucrării
          anterioare.
        </li>
      </ul>
      <p>
        Vă puteți exercita drepturile scriindu-ne la{" "}
        <a href={`mailto:${email}`}>{email}</a>. Răspundem în cel mult o lună de la
        cerere, termen care poate fi prelungit cu două luni în cazuri complexe, situație
        în care vă vom informa.
      </p>
      <p>
        De asemenea, aveți dreptul de a depune o plângere la Autoritatea Națională de
        Supraveghere a Prelucrării Datelor cu Caracter Personal: B-dul G-ral Gheorghe
        Magheru nr. 28-30, Sector 1, cod poștal 010336, București; telefon{" "}
        <a href="tel:+40318059211">+40 318 059 211</a>; email{" "}
        <a href="mailto:anspdcp@dataprotection.ro">anspdcp@dataprotection.ro</a>; web{" "}
        <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
          www.dataprotection.ro
        </a>
        .
      </p>

      <h2>10. Modificări ale acestei politici</h2>
      <p>
        Putem actualiza periodic această politică. Versiunea în vigoare și data ultimei
        actualizări sunt afișate în partea de sus a paginii. Modificările semnificative
        vor fi semnalate pe site.
      </p>

      <h2>11. Contact</h2>
      <p>
        {siteConfig.legalName} · {addressLine()}
        {phone ? (
          <>
            {" · "}
            <a href={telLink(phone)}>{phone.display}</a>
          </>
        ) : null}{" "}
        · <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
