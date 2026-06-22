import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { SiteNavbar } from "../../components/site-navbar";
import { SectionContainer } from "../../components/section-container";
import { getServiceGroups, getServicePages } from "../../data/services";
import { getServiceArea, serviceAreas } from "../../data/service-areas";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/app/lib/schema";
import { getSiteSettings } from "../../data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";

// Navbar + lista de servicii vin din DB (cache Upstash) → randare dinamică, ca
// în restul aplicației. Conținutul rămâne server-rendered (SEO ok).
export const revalidate = 3600; // ISR: shell static + reîmprospătare; datele vin din unstable_cache (cookie-free)

type ZonaRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ZonaRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return { title: "Zonă indisponibilă" };

  const canonical = `/zona/${slug}`;
  const title = `Terasamente, excavări și amenajări ${area.locative}`;
  return {
    title,
    description: area.intro,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${title} | PACA CONSTRUCT`,
      description: area.intro,
      url: canonical,
    },
  };
}

export default async function ZonaPage({ params }: ZonaRouteProps) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();

  const [serviceGroups, services, settings] = await Promise.all([
    getServiceGroups(),
    getServicePages(),
    getSiteSettings(),
  ]);
  const phone = getPrimaryPhone(settings);

  const mapQuery = encodeURIComponent(`${area.name}, ${area.county}, România`);

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: `Zona ${area.name}`, path: `/zona/${slug}` },
        ])}
        id="breadcrumb"
      />
      {services.length > 0 ? (
        <JsonLd
          data={itemListSchema(
            `Servicii ${area.locative}`,
            services.map((s) => ({
              name: s.title,
              path: `/servicii/${s.slug}`,
            })),
          )}
          id="itemlist"
        />
      ) : null}
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
              <span className="font-bold text-olive">Zona {area.name}</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-strong">
              Zonă deservită · {area.county}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif-display text-4xl font-semibold leading-[1.08] text-olive md:text-6xl">
              Terasamente, excavări și amenajări {area.locative}
            </h1>
            {/* Answer-first: răspunde direct la „ce faceți în {zonă}". */}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">{area.intro}</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone">
              {area.localNote}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact#form-section"
                className="inline-flex bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
              >
                Cere o evaluare {area.locative}
              </Link>
              {phone ? (
                <a
                  href={telLink(phone)}
                  className="inline-flex border border-olive/25 px-8 py-4 text-sm font-bold uppercase text-olive transition hover:border-olive hover:bg-white"
                >
                  {phone.display}
                </a>
              ) : null}
            </div>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 py-16 md:py-24">
          <SectionContainer>
            <h2 className="font-serif-display text-3xl font-semibold text-olive md:text-4xl">
              Servicii disponibile {area.locative}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicii/${service.slug}`}
                  className="group border border-olive/15 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-carbon/10"
                >
                  <h3 className="font-serif-display text-2xl font-medium text-olive group-hover:text-amber-strong">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-flex text-xs font-bold uppercase text-olive group-hover:text-amber-strong">
                    Vezi serviciul →
                  </span>
                </Link>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 py-16 md:py-24">
          <SectionContainer>
            <h2 className="font-serif-display text-3xl font-semibold text-olive md:text-4xl">
              Unde lucrăm {area.locative}
            </h2>
            <div className="mt-8 overflow-hidden border border-olive/15">
              <iframe
                title={`Hartă zonă de serviciu ${area.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[360px] w-full"
              />
            </div>
            <p className="mt-6 text-sm text-stone">
              Deservim și celelalte zone:{" "}
              {serviceAreas
                .filter((a) => a.slug !== area.slug)
                .map((a, i, arr) => (
                  <span key={a.slug}>
                    <Link
                      href={`/zona/${a.slug}`}
                      className="text-amber-strong underline underline-offset-2 hover:text-olive"
                    >
                      {a.name}
                    </Link>
                    {i < arr.length - 1 ? ", " : "."}
                  </span>
                ))}
            </p>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
