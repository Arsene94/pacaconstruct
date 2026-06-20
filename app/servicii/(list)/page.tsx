import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { SiteNavbar } from "@/app/components/site-navbar";
import { SectionContainer } from "@/app/components/section-container";
import { ContactCta } from "@/app/components/home-sections";
import { getServicePages, getServiceGroups } from "@/app/data/services";
import type { ServicePage } from "@/app/data/services";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/app/lib/schema";

// Conținut din DB, randare dinamică; datele vin din cache-ul Upstash.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicii de excavații și amenajări teren",
  description:
    "Servicii complete de excavații, nivelări, fundații, drenaje și amenajări exterioare, executate cu utilaje și operatori calificați.",
  alternates: { canonical: "/servicii" },
  openGraph: {
    type: "website",
    title: "Servicii | PACA CONSTRUCT",
    description:
      "Servicii complete de excavații, nivelări, fundații, drenaje și amenajări exterioare, executate cu utilaje și operatori calificați.",
    url: "/servicii",
  },
};

const reassuranceItems = [
  "Operatori calificati",
  "Evaluare teren inclusa",
  "Utilaj potrivit lucrarii",
  "Lucrari finalizate la cota",
];

/** Extrage slug-ul dintr-un href `/servicii/<slug>`. */
function slugFromHref(href: string): string {
  return href.replace(/^\/servicii\//, "");
}

export default async function ServicesListingPage() {
  const [serviceGroups, servicePages] = await Promise.all([
    getServiceGroups(),
    getServicePages(),
  ]);

  // Index pentru a îmbogăți itemele din grupuri cu imagine + sumar.
  const pagesBySlug = new Map<string, ServicePage>(
    servicePages.map((page) => [page.slug, page]),
  );

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Servicii", path: "/servicii" },
        ])}
        id="breadcrumb"
      />
      <JsonLd
        data={itemListSchema(
          "Servicii PACA CONSTRUCT",
          servicePages.map((service) => ({
            name: service.title,
            path: `/servicii/${service.slug}`,
          })),
        )}
        id="itemlist"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="flex flex-col">
        <section className="relative isolate overflow-hidden bg-topo">
          <div className="absolute inset-0 -z-10 bg-limestone/80" />
          <SectionContainer className="grid min-h-[560px] items-center gap-10 py-20 md:grid-cols-12 lg:py-28">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-amber">
                <span className="h-px w-10 bg-amber" />
                Servicii complete
              </p>
              <h1 className="mt-6 max-w-2xl font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
                De la teren brut la lucrare finalizata
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone">
                Excavatii, nivelari, fundatii, drenaje si amenajari exterioare — gandite
                ca etape coerente ale aceleiasi lucrari, executate cu utilaje potrivite si
                operatori calificati.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
                >
                  Cere o estimare
                </Link>
                <Link
                  href="/inchiriere-utilaje"
                  className="inline-flex items-center justify-center border border-olive/25 px-8 py-4 text-sm font-bold uppercase text-olive transition hover:border-olive hover:bg-white"
                >
                  Inchiriere utilaje
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] md:col-span-5 md:min-h-[420px]">
              <div className="absolute inset-0 overflow-hidden border border-olive/10 bg-white shadow-2xl shadow-carbon/10">
                <Image
                  src="/hero.png"
                  alt="Utilaj de excavatii pe un teren pregatit pentru lucrari de amenajare."
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-36 w-36 border-b border-r border-olive/25" />
            </div>
          </SectionContainer>
        </section>

        <section className="border-y border-olive/10 bg-[#f6f3ed] py-10">
          <SectionContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reassuranceItems.map((item, index) => (
              <div
                key={item}
                className="border border-olive/10 bg-white p-5 text-center shadow-sm shadow-carbon/5"
              >
                <span className="block font-mono text-xs font-bold uppercase text-amber">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-bold uppercase text-olive">{item}</p>
              </div>
            ))}
          </SectionContainer>
        </section>

        {serviceGroups.map((group) => (
          <section
            key={group.href}
            className="py-16 md:py-24 [&:nth-of-type(even)]:bg-topo"
          >
            <SectionContainer>
              <div className="mb-10 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
                  Categorie servicii
                </p>
                <h2 className="mt-3 font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                  {group.title}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const page = pagesBySlug.get(slugFromHref(item.href));

                  return (
                    <article
                      key={item.href}
                      className="group flex flex-col border border-olive/10 bg-white shadow-sm shadow-carbon/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-carbon/10"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#f6f3ed]">
                        <Image
                          src={page?.imageSrc ?? "/hero.png"}
                          alt={page?.imageAlt ?? item.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-7">
                        {page?.eyebrow ? (
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                            {page.eyebrow}
                          </p>
                        ) : null}
                        <h3 className="mt-2 font-serif-display text-2xl font-medium text-olive">
                          {item.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-7 text-stone">
                          {page?.summary ?? page?.description ?? ""}
                        </p>
                        <Link
                          href={item.href}
                          className="mt-6 inline-flex w-fit items-center gap-2 border-b border-olive pb-1 text-sm font-bold uppercase text-olive transition hover:border-amber hover:text-amber"
                        >
                          Vezi serviciul
                          <span aria-hidden="true">-&gt;</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </SectionContainer>
          </section>
        ))}

        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
