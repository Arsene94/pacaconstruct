import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";
import { siteConfig, addressLine } from "@/app/lib/site-config";

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
export default function TermeniPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      breadcrumbLabel="Termeni"
      path="/termeni"
      updatedAt="iunie 2026"
    >
      <p>
        Acești termeni reglementează utilizarea site-ului operat de{" "}
        {siteConfig.legalName}, cu sediul în {addressLine()}, CUI{" "}
        {siteConfig.cui}. Prin accesarea site-ului ești de acord cu termenii de
        mai jos.
      </p>

      <h2>Serviciile noastre</h2>
      <p>
        Oferim servicii de terasamente, excavări, amenajări peisagistice și
        închirieri de utilaje cu operator. Informațiile de pe site (descrieri,
        prețuri orientative, specificații) au caracter informativ; oferta fermă
        se stabilește în urma evaluării proiectului.
      </p>

      <h2>Solicitări și oferte</h2>
      <p>
        Formularele de contact și de închiriere transmit o cerere, nu un
        contract. Prețurile afișate sunt estimative și pot varia în funcție de
        complexitatea lucrării, locație și durată.
      </p>

      <h2>Proprietate intelectuală</h2>
      <p>
        Conținutul site-ului (texte, imagini, identitate vizuală) aparține{" "}
        {siteConfig.legalName} și nu poate fi reprodus fără acord, cu excepția
        citării cu atribuire și link către sursă.
      </p>

      <h2>Limitarea răspunderii</h2>
      <p>
        Depunem eforturi rezonabile pentru acuratețea informațiilor, dar nu
        garantăm că site-ul este lipsit de erori sau permanent disponibil.{" "}
        {/* TODO: completează clauzele de răspundere conform consultanței juridice. */}
      </p>

      <h2>Lege aplicabilă</h2>
      <p>
        Acești termeni sunt guvernați de legislația română. Eventualele litigii
        se soluționează de instanțele competente de la sediul operatorului.
      </p>

      <h2>Contact</h2>
      <p>
        {siteConfig.legalName} ·{" "}
        <a href={`tel:${siteConfig.phone}`}>{siteConfig.phoneDisplay}</a> ·{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </LegalPage>
  );
}
