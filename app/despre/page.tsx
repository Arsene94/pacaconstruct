import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../components/footer";
import { SiteNavbar } from "../components/site-navbar";
import { SectionContainer } from "../components/section-container";
import { getServiceGroups } from "../data/services";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema } from "@/app/lib/schema";
import { siteConfig } from "@/app/lib/site-config";
import { serviceAreas } from "../data/service-areas";

// Navbar-ul citește grupurile de servicii din DB (cache Upstash) → randare
// dinamică, ca în restul aplicației. Conținutul rămâne server-rendered (SEO ok).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Despre noi",
  description:
    "PACA CONSTRUCT SRL — echipă cu experiență în terasamente, excavări și amenajări peisagistice. Aflați povestea, valorile, flota și zonele în care lucrăm.",
  alternates: { canonical: "/despre" },
  openGraph: {
    type: "website",
    title: "Despre PACA CONSTRUCT SRL",
    description:
      "Echipă cu experiență în terasamente, excavări și amenajări peisagistice. Povestea, valorile și flota noastră.",
    url: "/despre",
  },
};

// Date pentru E-E-A-T (experiență de primă mână). // TODO: înlocuiește cu cifre reale.
const stats = [
  { value: "10+", label: "ani de experiență" }, // TODO: ani reali
  { value: "250+", label: "proiecte finalizate" }, // TODO: număr real
  { value: "15+", label: "utilaje în flotă" }, // TODO: număr real
];

const values = [
  {
    title: "Experiență tehnică reală",
    text: "Fiecare lucrare e condusă de operatori calificați, cu zeci de șantiere în spate — nu subcontractăm la întâmplare.",
  },
  {
    title: "Evaluare onestă",
    text: "Mergem la teren, măsurăm și dăm un deviz corect. Preferăm un „nu se poate” clar în loc de o promisiune nerealistă.",
  },
  {
    title: "Respect pentru teren",
    text: "Lucrăm curat, refacem accesul și predăm terenul pregătit pentru etapa următoare a proiectului.",
  },
];

export default async function DesprePage() {
  const serviceGroups = await getServiceGroups();

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
              <Link href="/" className="hover:text-amber">
                Acasă
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-olive">Despre noi</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">
              {siteConfig.legalName}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
              Construim de la teren brut la spațiu viu
            </h1>
            {/* Answer-first: primul paragraf răspunde direct la „cine sunteți". */}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">
              {siteConfig.legalName} este o firmă românească specializată în terasamente,
              excavări, amenajări peisagistice și închirieri de utilaje cu operator.
              Lucrăm pentru proiecte rezidențiale, comerciale și industriale în{" "}
              {siteConfig.address.addressLocality} și zonele învecinate, ducând terenul de
              la stadiul brut până la o suprafață pregătită sau amenajată.
            </p>
          </SectionContainer>
        </section>

        <section className="border-y border-olive/10 bg-[#f6f3ed] py-12">
          <SectionContainer className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif-display text-5xl font-semibold text-olive">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-stone">
                  {stat.label}
                </p>
              </div>
            ))}
          </SectionContainer>
        </section>

        <section className="py-20 md:py-28">
          <SectionContainer className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                Povestea noastră
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-stone">
                {/* TODO: înlocuiește cu povestea reală a firmei (an înființare,
                    fondatori, evoluție, proiecte de referință). */}
                <p>
                  Am pornit de la lucrări de excavare și pregătire a terenului, iar de-a
                  lungul anilor am extins serviciile către amenajări peisagistice complete
                  și închirieri de utilaje cu operator.
                </p>
                <p>
                  Astăzi acoperim întregul flux: săpături și fundații, nivelări și
                  sistematizare verticală, transport pământ și agregate, precum și
                  amenajarea finală a spațiilor verzi.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <h2 className="font-serif-display text-3xl font-medium text-olive">
                Zone deservite
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/zona/${area.slug}`}
                      className="inline-flex border border-olive/20 bg-white/70 px-3 py-1 text-sm font-semibold text-olive transition hover:border-amber hover:text-amber"
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
              </dl>
            </div>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 py-20 md:py-28">
          <SectionContainer>
            <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
              De ce ne poți crede
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="border border-olive/15 bg-white p-6 shadow-sm shadow-carbon/5"
                >
                  <h3 className="font-serif-display text-2xl font-medium text-olive">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-stone">{value.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link
                href="/contact#form-section"
                className="inline-flex bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
              >
                Cere o evaluare
              </Link>
            </div>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
