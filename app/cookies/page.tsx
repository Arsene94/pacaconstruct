import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";
import { getSiteSettings } from "../data/settings";

// Navbar-ul citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const revalidate = 86400; // ISR: conținut care se schimbă rar

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
  description:
    "Ce cookie-uri și tehnologii similare folosește PACA CONSTRUCT SRL, în ce scop, pe ce temei și cum îți poți gestiona consimțământul (Google Consent Mode v2).",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

// TODO: text-cadru — trebuie revizuit de un consultant juridic / DPO. Lista de
// cookie-uri (secțiunea 4) reflectă instrumentele din GTM; verific-o cu un
// scanner de cookie-uri și completează duratele reale înainte de lansare.
export default async function CookiesPage() {
  // Emailul de contact vine din DB (site_settings), nu din config.
  const settings = await getSiteSettings();
  const email = settings.contact.emailPrimary;

  return (
    <LegalPage
      title="Politica de cookie-uri"
      breadcrumbLabel="Cookie-uri"
      path="/cookies"
      updatedAt="iunie 2026"
    >
      <h2>1. Ce sunt cookie-urile</h2>
      <p>
        Cookie-urile sunt fișiere mici text pe care un site le stochează în browserul tău.
        Ele permit site-ului să funcționeze, să rețină preferințe și, dacă ești de acord,
        să măsoare audiența și eficiența reclamelor. Folosim și tehnologii similare
        (pixeli, stocare locală), pe care le numim generic „cookie-uri” în această
        politică.
      </p>

      <h2>2. Temeiul legal</h2>
      <p>
        Cookie-urile strict necesare le folosim fără acord, fiind indispensabile
        funcționării site-ului (art. 4 alin. (5) din Legea nr. 506/2004). Pentru
        cookie-urile de analiză și de marketing îți cerem consimțământul prealabil (art. 6
        alin. (1) lit. a din GDPR coroborat cu Legea nr. 506/2004). Nu le activăm înainte
        de acordul tău.
      </p>

      <h2>3. Cum gestionăm consimțământul</h2>
      <p>
        La prima vizită îți afișăm un banner prin care poți accepta sau refuza categoriile
        neesențiale. Folosim <strong>Google Consent Mode v2</strong>, setat implicit pe
        „refuzat”: până când nu alegi, instrumentele de analiză și de publicitate nu
        plasează cookie-uri și nu citesc identificatori. Îți poți schimba oricând alegerea
        din link-ul „Modifică preferințele de cookie-uri” aflat în subsolul site-ului, sau
        direct din setările browserului.
      </p>

      <h2>4. Ce cookie-uri folosim</h2>
      <p>Le grupăm în trei categorii.</p>

      <h3>a) Strict necesare (fără consimțământ)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Furnizor</th>
            <th>Scop</th>
            <th>Durată</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              preferință de consimțământ (ex. <code>pc_consent</code>)
            </td>
            <td>PACA CONSTRUCT</td>
            <td>reține alegerea ta privind cookie-urile</td>
            <td>până la 12 luni</td>
          </tr>
          <tr>
            <td>cookie-uri de securitate și de echilibrare a încărcării</td>
            <td>Vercel</td>
            <td>livrarea și stabilitatea site-ului</td>
            <td>sesiune / scurtă durată</td>
          </tr>
        </tbody>
      </table>

      <h3>b) De analiză (cu consimțământ)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Furnizor</th>
            <th>Scop</th>
            <th>Durată</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>_ga</code>, <code>_ga_*</code>
            </td>
            <td>Google Analytics 4</td>
            <td>statistici de audiență, vizitatori unici</td>
            <td>până la 13 luni</td>
          </tr>
        </tbody>
      </table>

      <h3>c) De marketing și publicitate (cu consimțământ)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Furnizor</th>
            <th>Scop</th>
            <th>Durată</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>_gcl_au</code>
            </td>
            <td>Google Ads</td>
            <td>atribuirea conversiilor din reclame</td>
            <td>până la 90 de zile</td>
          </tr>
          <tr>
            <td>
              <code>_fbp</code>
            </td>
            <td>Meta</td>
            <td>măsurarea și optimizarea reclamelor</td>
            <td>până la 90 de zile</td>
          </tr>
          <tr>
            <td>
              <code>_ttp</code>
            </td>
            <td>TikTok</td>
            <td>măsurarea reclamelor</td>
            <td>până la 13 luni</td>
          </tr>
        </tbody>
      </table>
      <p>
        Google Tag Manager, prin care încărcăm aceste instrumente, nu plasează el însuși
        cookie-uri. Lista poate varia în funcție de instrumentele active și se
        actualizează la nevoie.
      </p>

      <h2>5. Cookie-uri ale terților și transferuri</h2>
      <p>
        Cookie-urile de analiză și de marketing sunt setate de furnizori terți (Google,
        Meta, TikTok), care le pot prelucra în afara Spațiului Economic European. Aceste
        transferuri sunt acoperite de Cadrul UE-SUA de confidențialitate a datelor și/sau
        de Clauzele Contractuale Standard. Detalii în{" "}
        <Link href="/confidentialitate">Politica de confidențialitate</Link>.
      </p>

      <h2>6. Cum dezactivezi cookie-urile din browser</h2>
      <p>
        Poți bloca sau șterge cookie-urile din setările browserului. Dacă blochezi
        cookie-urile strict necesare, unele funcții ale site-ului pot să nu mai meargă
        corect. Instrucțiuni găsești în secțiunile de ajutor ale Chrome, Safari, Firefox
        și Edge.
      </p>

      <h2>7. Drepturile tale și contact</h2>
      <p>
        Drepturile tale privind datele cu caracter personal și datele de contact sunt
        descrise în <Link href="/confidentialitate">Politica de confidențialitate</Link>.
        Pentru întrebări despre cookie-uri, scrie-ne la{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>8. Modificări</h2>
      <p>
        Putem actualiza această politică odată cu schimbarea instrumentelor folosite. Data
        ultimei actualizări este afișată în partea de sus.
      </p>
    </LegalPage>
  );
}
