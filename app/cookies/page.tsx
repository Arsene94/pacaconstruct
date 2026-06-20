import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";
import { siteConfig } from "@/app/lib/site-config";

// Navbar-ul citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
  description:
    "Ce cookie-uri și tehnologii similare folosește PACA CONSTRUCT SRL, în ce scop, pe ce temei și cum îți poți gestiona consimțământul (Google Consent Mode v2).",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

// TODO: text-cadru — trebuie revizuit de un consultant juridic / DPO și
// completat cu inventarul real de cookie-uri din GTM înainte de lansare.
export default function CookiesPage() {
  return (
    <LegalPage
      title="Politica de cookie-uri"
      breadcrumbLabel="Cookie-uri"
      path="/cookies"
      updatedAt="iunie 2026"
    >
      <p>
        Această politică explică ce sunt cookie-urile și tehnologiile similare, cum și de
        ce le folosește {siteConfig.legalName} pe acest site și cum îți poți controla
        consimțământul. Este parte din{" "}
        <Link href="/confidentialitate">Politica de confidențialitate</Link>.
      </p>

      <h2>Ce sunt cookie-urile</h2>
      <p>
        Cookie-urile sunt fișiere text mici stocate de browser pe dispozitivul tău când
        vizitezi un site. Pot fi <strong>de sesiune</strong> (se șterg la închiderea
        browserului) sau <strong>persistente</strong> (rămân o perioadă), respectiv{" "}
        <strong>first-party</strong> (setate de site-ul nostru) sau{" "}
        <strong>third-party</strong> (setate de furnizori terți, ex. Google, Meta).
        Folosim și tehnologii similare (pixeli, stocare locală).
      </p>

      <h2>Consimțământ și Google Consent Mode v2</h2>
      <p>
        Înainte de a încărca instrumentele de măsurare, site-ul setează{" "}
        <strong>Google Consent Mode v2</strong> cu toate categoriile pe <em>refuzat</em>{" "}
        („denied”), cu excepția celor strict necesare securității. Cu alte cuvinte, în mod
        implicit{" "}
        <strong>
          nu se activează cookie-uri de analiză sau de marketing fără consimțământul tău
        </strong>
        ; instrumentele rulează doar în mod „modelare” fără cookie-uri (cookieless),
        pentru statistici agregate și anonime.
      </p>
      <p>
        Cookie-urile strict necesare nu pot fi dezactivate, deoarece fără ele site-ul nu
        funcționează corect (securitate, sesiune, preferința ta de consimțământ).
      </p>

      <h2>Categoriile de cookie-uri pe care le folosim</h2>

      <h3>Strict necesare</h3>
      <p>
        Asigură funcționarea de bază și securitatea site-ului, autentificarea în zona de
        administrare și reținerea opțiunilor de consimțământ. Temei:{" "}
        <strong>interes legitim</strong> (funcționarea serviciului).
      </p>

      <h3>Funcționale și de atribuire</h3>
      <p>
        Rețin sursa campaniei prin care ai ajuns pe site (identificatori de click și
        parametri UTM), ca să putem măsura eficiența reclamelor și să atribuim corect
        solicitările. Temei: <strong>consimțământ</strong>.
      </p>

      <h3>Analitice</h3>
      <p>
        Ne ajută să înțelegem cum este folosit site-ul (pagini vizitate, durată, sursă de
        trafic), prin Google Analytics 4. Temei: <strong>consimțământ</strong>.
      </p>

      <h3>Marketing</h3>
      <p>
        Permit măsurarea conversiilor și afișarea de reclame relevante prin Google Ads,
        Meta (Facebook/Instagram) și TikTok. Temei: <strong>consimțământ</strong>.
      </p>

      <h2>Cookie-urile folosite</h2>
      <p>
        Lista de mai jos descrie cookie-urile principale. Cookie-urile terților se
        activează doar după acordarea consimțământului pentru categoria respectivă și sunt
        gestionate prin Google Tag Manager.
      </p>

      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Categorie</th>
            <th>Furnizor</th>
            <th>Scop</th>
            <th>Durată</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>paca_attr</code>
            </td>
            <td>Funcțional / atribuire</td>
            <td>PACA CONSTRUCT (first-party)</td>
            <td>
              Reține sursa campaniei (gclid, fbclid, ttclid, UTM, pagina de aterizare)
              pentru atribuirea solicitărilor.
            </td>
            <td>90 de zile</td>
          </tr>
          <tr>
            <td>
              <code>paca_consent_ads</code>
            </td>
            <td>Strict necesar</td>
            <td>PACA CONSTRUCT (first-party)</td>
            <td>Reține opțiunea ta de consimțământ pentru marketing.</td>
            <td>1 an</td>
          </tr>
          <tr>
            <td>
              <code>sb-*</code>
            </td>
            <td>Strict necesar</td>
            <td>Supabase</td>
            <td>Sesiune de autentificare (doar în zona de administrare).</td>
            <td>Sesiune / până la delogare</td>
          </tr>
          <tr>
            <td>
              <code>_ga</code>, <code>_ga_*</code>
            </td>
            <td>Analitic</td>
            <td>Google Analytics 4</td>
            <td>Distinge utilizatorii și sesiunile pentru statistici de trafic.</td>
            <td>până la 2 ani</td>
          </tr>
          <tr>
            <td>
              <code>_gcl_*</code>
            </td>
            <td>Marketing</td>
            <td>Google Ads</td>
            <td>Măsurarea conversiilor din campaniile Google Ads.</td>
            <td>până la 90 de zile</td>
          </tr>
          <tr>
            <td>
              <code>_fbp</code>
            </td>
            <td>Marketing</td>
            <td>Meta (Facebook/Instagram)</td>
            <td>Măsurarea conversiilor și remarketing prin Meta Pixel.</td>
            <td>până la 3 luni</td>
          </tr>
          <tr>
            <td>
              <code>_ttp</code>
            </td>
            <td>Marketing</td>
            <td>TikTok</td>
            <td>Măsurarea conversiilor și optimizarea reclamelor TikTok.</td>
            <td>până la 13 luni</td>
          </tr>
        </tbody>
      </table>
      <p>
        Numele și duratele cookie-urilor terților pot varia în funcție de furnizor;
        valorile de mai sus sunt orientative.
      </p>

      <h2>Furnizori terți și politicile lor</h2>
      <ul>
        <li>
          Google (Analytics, Ads, Tag Manager) —{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            politica de confidențialitate
          </a>
        </li>
        <li>
          Meta Platforms —{" "}
          <a
            href="https://www.facebook.com/policy.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            politica privind datele
          </a>
        </li>
        <li>
          TikTok —{" "}
          <a
            href="https://www.tiktok.com/legal/page/row/privacy-policy/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            politica de confidențialitate
          </a>
        </li>
      </ul>

      <h2>Cum îți gestionezi consimțământul</h2>
      <p>
        Îți poți retrage sau modifica oricând consimțământul. Întrucât setarea implicită
        este „refuzat”, cookie-urile de analiză și marketing nu se activează decât dacă
        îți exprimi acordul. În plus, poți:
      </p>
      <ul>
        <li>
          să ștergi cookie-urile și să blochezi cookie-urile terților din setările
          browserului;
        </li>
        <li>
          să folosești paginile de dezactivare ale furnizorilor (vezi linkurile de mai
          sus), inclusiv{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            setările de reclame Google
          </a>
          ;
        </li>
        <li>
          să folosești instrucțiunile browserului tău:{" "}
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome
          </a>
          ,{" "}
          <a
            href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          ,{" "}
          <a
            href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
          ,{" "}
          <a
            href="https://support.microsoft.com/help/4027947"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edge
          </a>
          .
        </li>
      </ul>
      <p>
        Reține că blocarea cookie-urilor strict necesare poate afecta funcționarea
        site-ului.
      </p>

      <h2>Modificări ale acestei politici</h2>
      <p>
        Putem actualiza această politică pe măsură ce adăugăm sau eliminăm instrumente.
        Versiunea curentă și data ultimei actualizări sunt afișate în capul paginii.
      </p>

      <h2>Contact</h2>
      <p>
        Pentru întrebări despre cookie-uri și prelucrarea datelor, scrie-ne la{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Vezi și{" "}
        <Link href="/confidentialitate">Politica de confidențialitate</Link>.
      </p>
    </LegalPage>
  );
}
