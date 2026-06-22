import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../components/footer";
import { SiteNavbar } from "../components/site-navbar";
import { SectionContainer } from "../components/section-container";
import { getServiceGroups } from "../data/services";
import { getSiteSettings } from "../data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema } from "@/app/lib/schema";
import { siteConfig } from "@/app/lib/site-config";
import { serviceAreas } from "../data/service-areas";

// Navbar-ul citește grupurile de servicii din DB (cache Upstash) → randare
// dinamică, ca în restul aplicației. Conținutul rămâne server-rendered (SEO ok).
export const revalidate = 86400; // ISR: conținut care se schimbă rar

export const metadata: Metadata = {
  title: "Despre noi",
  description:
    "PACA CONSTRUCT SRL — terasamente, excavări și infrastructură de teren, cu utilaje proprii și operatori calificați. Pregătim terenul pe care se construiește, plantează sau circulă.",
  alternates: { canonical: "/despre" },
  openGraph: {
    type: "website",
    title: "Despre PACA CONSTRUCT SRL",
    description:
      "Terasamente, excavări și infrastructură de teren, cu utilaje proprii și operatori calificați. Pregătim terenul pe care vine restul.",
    url: "/despre",
  },
};

// Cele trei principii de lucru (COPY-DESPRE.md, secțiunea „Cum lucrăm").
const workBlocks = [
  {
    title: "O singură echipă pentru tot",
    text: "Cele mai multe probleme apar la mijloc, între meseriași: cel care a săpat dă vina pe cel care toarnă, cel cu drenajul pe cel cu aleea. Noi ducem partea de teren de la excavare până la predare, așa că ai un singur om cu care vorbești și o singură răspundere.",
  },
  {
    title: "Începem cu terenul, nu cu oferta",
    text: "Mergem pe teren, ne uităm la acces, la diferențele de nivel și la sol, și abia apoi spunem un cost. Lucrăm la cotele din proiect, compactăm în straturi și ducem apa unde trebuie, fiindcă acolo se strică lucrările, nu la finisaj. Preferăm un „nu se poate” clar în loc de o promisiune nerealistă.",
  },
  {
    title: "Spunem din start unde ne oprim",
    text: "Facem partea mecanizată: pregătire teren, terasamente, infrastructură. Nu facem plantări, gazon, irigații sau întreținere de spații verzi. Îți spunem asta de la prima discuție, ca să știi exact ce intră în ofertă și să nu plătești de două ori pentru același lucru.",
  },
];

export default async function DesprePage() {
  const [serviceGroups, settings] = await Promise.all([
    getServiceGroups(),
    getSiteSettings(),
  ]);
  const phone = getPrimaryPhone(settings);

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Despre noi", path: "/despre" },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="bg-topo">
        <section className="py-20 md:py-28">
          <SectionContainer>
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm font-medium text-stone"
            >
              <Link href="/" className="hover:text-amber-strong">
                Acasă
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-olive">Despre noi</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-strong">
              Despre {siteConfig.legalName}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
              Pregătim terenul. Restul stă pe ce facem noi.
            </h1>
            {/* Answer-first: primul paragraf răspunde direct la „cine sunteți". */}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">
              {siteConfig.legalName} lucrează în terasamente și excavări, între lucrările
              de pregătire a terenului pentru amenajări exterioare și cele pentru
              instalații și construcții civile. Pe scurt: aducem terenul în starea în care
              se poate construi, planta sau circula pe el, cu utilaje proprii și operatori
              care fac asta zi de zi.
            </p>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 py-20 md:py-28">
          <SectionContainer className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                Două lucruri pe care le facem bine, restul în jurul lor
              </h2>
              <p className="mt-6 text-lg leading-8 text-stone">
                Avem două direcții principale. Prima e amenajarea mecanizată a spațiilor
                exterioare: pregătim și modelăm terenul curților și grădinilor, facem
                alei, platforme și drenaj. A doua e partea grea de infrastructură:
                terasamente și excavări pentru fundații, instalații de apă și canalizare,
                fose septice, pivnițe și subsoluri. În jurul acestor două direcții punem
                serviciile complementare de care are nevoie o lucrare de pregătire a
                terenului: nivelare, drumuri de acces, drenaje, lucrări industriale și
                închirieri de utilaje cu operator.
              </p>

              <h3 className="mt-10 font-serif-display text-3xl font-medium text-olive">
                Tehnicitate în armonie cu natura
              </h3>
              <p className="mt-5 text-lg leading-8 text-stone">
                Lucrăm cu utilaje grele, dar pe terenul cuiva. Asta înseamnă acces gândit,
                pământ evacuat și o curte lăsată curată, nu un șantier abandonat. Alegem
                utilajul după lucrare și după acces, de la miniexcavator pentru curți
                strâmte până la excavator și buldoexcavator pentru volume mari, cu
                autobasculante pentru transport și evacuare.
              </p>
            </div>

            <div className="lg:col-span-5">
              <h2 className="font-serif-display text-3xl font-medium text-olive">
                Zona în care lucrăm
              </h2>
              <p className="mt-5 text-base leading-7 text-stone">
                Ne deplasăm cu utilaje proprii, ceea ce ne permite să ajungem eficient la
                lucrare, în funcție de distanță, acces și volumul proiectului. Zona exactă
                de intervenție o stabilim după o evaluare inițială. Lucrăm pentru
                proprietăți rezidențiale și comerciale, în{" "}
                {siteConfig.address.addressLocality} și zonele din jur.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/zona/${area.slug}`}
                      className="inline-flex border border-olive/20 bg-white/70 px-3 py-1 text-sm font-semibold text-olive transition hover:border-amber hover:text-amber-strong"
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-serif-display text-3xl font-medium text-olive">
                Date firmă
              </h2>
              <dl className="mt-5 space-y-2 text-sm text-stone">
                <div className="flex justify-between gap-4 border-b border-olive/10 pb-2">
                  <dt className="font-bold uppercase text-muted">Denumire</dt>
                  <dd className="text-right text-olive">{siteConfig.legalName}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-olive/10 pb-2">
                  <dt className="font-bold uppercase text-muted">CUI</dt>
                  <dd className="text-right text-olive">{siteConfig.cui}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-olive/10 pb-2">
                  <dt className="font-bold uppercase text-muted">Reg. Com.</dt>
                  <dd className="text-right text-olive">
                    {siteConfig.registrationNumber}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-olive/10 pb-2">
                  <dt className="font-bold uppercase text-muted">Telefon</dt>
                  <dd className="text-right text-olive">
                    {phone ? (
                      <a href={telLink(phone)} className="hover:text-amber-strong">
                        {phone.display}
                      </a>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 py-20 md:py-28">
          <SectionContainer>
            <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
              Cum lucrăm
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {workBlocks.map((block) => (
                <div
                  key={block.title}
                  className="border border-olive/15 bg-white p-6 shadow-sm shadow-carbon/5"
                >
                  <h3 className="font-serif-display text-2xl font-medium text-olive">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-stone">{block.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 border-l-4 border-amber bg-olive p-8 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
              <div className="max-w-2xl">
                <h2 className="font-serif-display text-3xl font-semibold md:text-4xl">
                  Ai un teren de pregătit? Hai să ne uităm la el.
                </h2>
                <p className="mt-3 text-base leading-7 text-white/80">
                  Spune-ne ce ai de făcut și unde. Venim, evaluăm și îți zicem cinstit cum
                  stă treaba și cât costă.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 md:mt-0 md:shrink-0">
                <Link
                  href="/contact#form-section"
                  className="inline-flex justify-center bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
                >
                  Cere o evaluare
                </Link>
                {phone ? (
                  <a
                    href={telLink(phone)}
                    className="inline-flex justify-center border border-white/30 px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-white/10"
                  >
                    Sună la {phone.display}
                  </a>
                ) : null}
              </div>
            </div>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
