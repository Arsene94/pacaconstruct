import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";
import { siteConfig, addressLine } from "@/app/lib/site-config";
import { getSiteSettings } from "../data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";

// Navbar-ul citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a site-ului PACA CONSTRUCT SRL și cadrul general al serviciilor de terasamente, excavări și amenajări.",
  alternates: { canonical: "/termeni" },
  robots: { index: true, follow: true },
};

// TODO: text-cadru — trebuie revizuit de un consultant juridic înainte de lansare.
// Datele de identificare (CUI, nr. Reg. Com., sediu, email, telefon) vin din
// `siteConfig` și trebuie completate acolo cu valorile reale.
export default async function TermeniPage() {
  // Telefonul și emailul vin din DB (site_settings), nu din config.
  const settings = await getSiteSettings();
  const phone = getPrimaryPhone(settings);
  const email = settings.contact.emailPrimary;

  return (
    <LegalPage
      title="Termeni și condiții"
      breadcrumbLabel="Termeni"
      path="/termeni"
      updatedAt="iunie 2026"
    >
      <h2>1. Cine suntem și ce reglementează acești termeni</h2>
      <p>
        Site-ul este operat de {siteConfig.legalName}, cu sediul în {addressLine()},
        înregistrată la Registrul Comerțului sub nr. {siteConfig.registrationNumber}, cod
        unic de înregistrare {siteConfig.cui}, email{" "}
        <a href={`mailto:${email}`}>{email}</a>
        {phone ? (
          <>
            , telefon <a href={telLink(phone)}>{phone.display}</a>
          </>
        ) : null}{" "}
        (denumită în continuare „PACA CONSTRUCT” sau „noi”).
      </p>
      <p>
        Acești termeni guvernează accesul și utilizarea site-ului. Prin folosirea
        site-ului, confirmi că i-ai citit și că ești de acord cu ei. Dacă nu ești de
        acord, te rugăm să nu folosești site-ul.
      </p>

      <h2>2. Ce oferă site-ul</h2>
      <p>
        Site-ul prezintă serviciile noastre de terasamente, excavări, amenajări exterioare
        și închirieri de utilaje cu operator, și îți permite să ne transmiți o cerere de
        evaluare sau de ofertă. Informațiile și descrierile au caracter de prezentare. Ele
        constituie o invitație de a ne contacta, nu o ofertă fermă, iar prețurile sau
        estimările menționate sunt orientative până la transmiterea unei oferte scrise.
      </p>

      <h2>3. Cererile transmise prin site</h2>
      <p>
        Completarea și trimiterea unui formular reprezintă o solicitare de evaluare sau de
        ofertă și <strong>nu încheie un contract</strong>. Evaluarea și oferta sunt
        gratuite și nu te obligă. Un contract de prestări servicii ia naștere numai
        ulterior, prin acceptarea unei oferte scrise sau prin semnarea unui contract
        separat, care va cuprinde prețul, termenele și condițiile concrete ale lucrării.
      </p>
      <p>
        Te rugăm să furnizezi informații corecte și complete, ca să putem evalua corect
        cererea. Nu răspundem pentru estimări întocmite pe baza unor date inexacte
        furnizate de tine.
      </p>

      <h2>4. Obligațiile tale de utilizare</h2>
      <p>
        Te angajezi să folosești site-ul cu bună-credință și conform legii. Îți este
        interzis, fără a ne limita la acestea:
      </p>
      <ul>
        <li>
          să transmiți prin formulare date false, conținut ilegal sau mesaje nesolicitate;
        </li>
        <li>
          să încerci accesarea neautorizată, perturbarea sau testarea securității
          site-ului;
        </li>
        <li>
          să extragi automat conținut (scraping) sau să reproduci site-ul în scop
          comercial fără acordul nostru scris.
        </li>
      </ul>

      <h2>5. Proprietate intelectuală</h2>
      <p>
        Conținutul site-ului, inclusiv textele, imaginile, articolele de blog, elementele
        grafice, logo-ul și denumirea PACA CONSTRUCT, este protejat de Legea nr. 8/1996 și
        aparține {siteConfig.legalName} sau partenerilor săi. Poți consulta și folosi
        conținutul pentru uz personal și necomercial. Orice altă utilizare (copiere,
        distribuire, modificare, publicare) necesită acordul nostru prealabil scris.
      </p>

      <h2>6. Disponibilitatea site-ului</h2>
      <p>
        Depunem eforturi rezonabile pentru ca site-ul să fie disponibil și actualizat, dar
        nu garantăm funcționarea neîntreruptă sau lipsa erorilor. Putem suspenda temporar
        accesul pentru mentenanță, actualizări sau din motive de securitate, fără
        notificare prealabilă.
      </p>

      <h2>7. Limitarea răspunderii</h2>
      <p>
        Informațiile de pe site sunt furnizate cu titlu orientativ. Nu răspundem pentru
        deciziile luate exclusiv pe baza acestor informații înainte de primirea unei
        oferte sau a unui contract scris. În limitele permise de lege, răspunderea noastră
        pentru utilizarea site-ului este limitată la daunele directe și previzibile. Nimic
        din acești termeni nu limitează răspunderea care, potrivit legii, nu poate fi
        limitată sau exclusă, inclusiv pentru daune cauzate cu intenție ori din culpă
        gravă sau pentru vătămarea persoanei.
      </p>

      <h2>8. Linkuri către site-uri terțe</h2>
      <p>
        Site-ul poate conține linkuri către pagini ale unor terți (de exemplu rețele
        sociale, WhatsApp). Nu controlăm și nu răspundem pentru conținutul ori practicile
        acelor site-uri. Accesarea lor se face pe răspunderea ta și sub termenii lor.
      </p>

      <h2>9. Date cu caracter personal</h2>
      <p>
        Prelucrăm datele tale conform{" "}
        <Link href="/confidentialitate">Politicii de confidențialitate</Link> și folosim
        cookie-uri conform <Link href="/cookies">Politicii de cookie-uri</Link>. Te rugăm
        să le consulți pentru a înțelege ce date colectăm, în ce scop și care îți sunt
        drepturile.
      </p>

      <h2>10. Protecția consumatorilor și soluționarea litigiilor</h2>
      <p>
        Dacă ești consumator, beneficiezi de drepturile prevăzute de legislația din
        domeniu. Pentru contractele de servicii încheiate ulterior la distanță sau în
        afara spațiilor noastre comerciale, drepturile tale, inclusiv, după caz, dreptul
        de retragere în 14 zile și excepțiile aplicabile lucrărilor începute cu acordul
        tău expres, sunt reglementate de OUG nr. 34/2014 și se regăsesc în contractul
        specific.
      </p>
      <p>
        Orice reclamație ne-o poți adresa direct, la datele de contact din secțiunea 1, și
        o vom soluționa cu bună-credință. De asemenea, te poți adresa Autorității
        Naționale pentru Protecția Consumatorilor (ANPC,{" "}
        <a href="https://www.anpc.ro" target="_blank" rel="noopener noreferrer">
          www.anpc.ro
        </a>
        ) și poți recurge la mecanismele de soluționare alternativă a litigiilor (SAL)
        prevăzute de OG nr. 38/2015. Platforma europeană de soluționare online a
        litigiilor (ODR) a fost desființată în anul 2025 și nu mai este disponibilă.
      </p>

      <h2>11. Forța majoră</h2>
      <p>
        Nu răspundem pentru neexecutarea sau executarea cu întârziere a obligațiilor
        atunci când aceasta se datorează unor cauze independente de voința noastră (forță
        majoră sau caz fortuit), în condițiile legii.
      </p>

      <h2>12. Modificarea termenilor</h2>
      <p>
        Putem actualiza acești termeni periodic. Versiunea în vigoare și data ultimei
        actualizări sunt afișate în partea de sus a paginii. Utilizarea site-ului după
        publicarea modificărilor înseamnă acceptarea lor.
      </p>

      <h2>13. Legea aplicabilă și instanțele competente</h2>
      <p>
        Acești termeni sunt guvernați de legea română. Eventualele litigii se soluționează
        de instanțele competente potrivit legii. Dacă ești consumator, beneficiezi de
        normele de competență care îți sunt mai favorabile, prevăzute de lege.
      </p>

      <h2>14. Contact</h2>
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
