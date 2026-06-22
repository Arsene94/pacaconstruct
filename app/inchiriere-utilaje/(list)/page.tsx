import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { SiteNavbar } from "@/app/components/site-navbar";
import { SectionContainer } from "@/app/components/section-container";
import { getServiceGroups } from "@/app/data/services";
import { getRentalMachines } from "@/app/data/rentals";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/app/lib/schema";

// Conținut din DB, randare dinamică; datele vin din cache-ul Upstash.
export const revalidate = 3600; // ISR: shell static + reîmprospătare; datele vin din unstable_cache (cookie-free)

export const metadata: Metadata = {
  title: "Închirieri utilaje cu operator",
  description:
    "Închiriere utilaje cu operator pentru excavații, nivelări, transport pământ și agregate.",
  alternates: { canonical: "/inchiriere-utilaje" },
  openGraph: {
    type: "website",
    title: "Închirieri utilaje cu operator | PACA CONSTRUCT",
    description:
      "Închiriere utilaje cu operator pentru excavații, nivelări, transport pământ și agregate.",
    url: "/inchiriere-utilaje",
  },
};

const reassuranceItems = [
  "Operator inclus",
  "Utilaj ales după lucrare",
  "Verificăm accesul",
  "Transport stabilit separat",
];

const comparisonRows = [
  ["Fundații adânci", "Excelent", "Limitat", "-"],
  ["Săpare șanțuri utilități", "Da", "Excelent", "-"],
  ["Nivelare teren, suprafețe mari", "Limitat", "Da", "Excelent"],
  ["Spații înguste / acces dificil", "Excelent (mini)", "Limitat", "-"],
  ["Încărcare camioane", "Da", "Da", "Excelent"],
];

export default async function RentalListingPage() {
  const [serviceGroups, rentalMachines] = await Promise.all([
    getServiceGroups(),
    getRentalMachines(),
  ]);
  const featuredMachine = rentalMachines[0];

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Închirieri utilaje", path: "/inchiriere-utilaje" },
        ])}
        id="breadcrumb"
      />
      <JsonLd
        data={itemListSchema(
          "Flotă utilaje de închiriat",
          rentalMachines.map((m) => ({
            name: m.title,
            path: `/inchiriere-utilaje/${m.slug}`,
          })),
        )}
        id="itemlist"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="flex flex-col">
        <section className="relative isolate overflow-hidden bg-topo">
          <div className="absolute inset-0 -z-10 bg-limestone/80" />
          <SectionContainer className="grid min-h-[680px] items-center gap-10 py-20 md:grid-cols-12 lg:py-28">
            <div className="md:col-span-5">
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-amber">
                <span className="h-px w-10 bg-amber" />
                Divizia închirieri utilaje
              </p>
              <h1 className="mt-6 max-w-2xl font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
                Utilajul potrivit, cu operator, când îți trebuie
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone">
                Spune-ne lucrarea și accesul. Aducem excavatorul, buldoexcavatorul,
                încărcătorul sau basculanta, cu om care le știe. Plătești pe ce ai nevoie,
                fără să cumperi sau să întreții echipament.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#flota"
                  className="inline-flex items-center justify-center bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
                >
                  Explorează flota
                </Link>
                <Link
                  href={`/inchiriere-utilaje/${featuredMachine.slug}`}
                  className="inline-flex items-center justify-center border border-olive/25 px-8 py-4 text-sm font-bold uppercase text-olive transition hover:border-olive hover:bg-white"
                >
                  Închiriază utilaj
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px] md:col-span-7 md:min-h-[520px]">
              <div className="absolute inset-0 overflow-hidden border border-olive/10 bg-white shadow-2xl shadow-carbon/10">
                <Image
                  src="/hero.png"
                  alt="Excavator pe teren pregătit pentru lucrări de amenajare."
                  fill
                  priority
                  sizes="(min-width: 1024px) 54vw, 100vw"
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

        <section className="py-20 md:py-28">
          <SectionContainer>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
                Utilaj recomandat
              </p>
              <h2 className="mt-3 font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                Performanță pentru lucrări complexe
              </h2>
            </div>

            <article className="grid overflow-hidden border border-olive/10 bg-white shadow-xl shadow-carbon/5 md:grid-cols-2">
              <div className="relative min-h-[320px] bg-[#f6f3ed]">
                <Image
                  src={featuredMachine.imageSrc}
                  alt={featuredMachine.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
                  {featuredMachine.category}
                </p>
                <h3 className="mt-4 font-serif-display text-4xl font-semibold text-olive">
                  {featuredMachine.title}
                </h3>
                <p className="mt-5 border-b border-olive/10 pb-8 text-base leading-7 text-stone">
                  {featuredMachine.shortDescription}
                </p>
                <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                  {featuredMachine.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 font-mono text-sm font-semibold text-olive">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={`/inchiriere-utilaje/${featuredMachine.slug}`}
                  className="mt-10 inline-flex w-fit bg-olive px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-carbon"
                >
                  Închiriază utilaj
                </Link>
              </div>
            </article>
          </SectionContainer>
        </section>

        <section id="flota" className="bg-topo py-20 md:py-28">
          <SectionContainer>
            <div className="mb-12 text-center">
              <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                Flotă tehnologică
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone">
                Prețurile sunt informative și variază în funcție de complexitatea
                lucrării, locație și durată.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {rentalMachines.slice(1).map((machine) => (
                <article
                  key={machine.slug}
                  className="group flex flex-col border border-olive/10 bg-white shadow-sm shadow-carbon/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-carbon/10"
                >
                  <div className="relative h-64 overflow-hidden bg-[#f6f3ed]">
                    <Image
                      src={machine.imageSrc}
                      alt={machine.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <p className="w-fit bg-olive px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {machine.category}
                    </p>
                    <p className="mt-4 font-mono text-sm font-bold text-amber">
                      {machine.price}
                    </p>
                    <h3 className="mt-3 font-serif-display text-3xl font-medium text-olive">
                      {machine.title}
                    </h3>
                    <p className="mt-3 flex-1 text-base leading-7 text-stone">
                      {machine.shortDescription}
                    </p>
                    <ul className="my-7 space-y-2 border-y border-olive/10 py-4">
                      {machine.uses.map((use) => (
                        <li
                          key={use}
                          className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.08em] text-stone"
                        >
                          <span className="h-1.5 w-1.5 bg-amber" />
                          {use}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/inchiriere-utilaje/${machine.slug}`}
                      className="inline-flex w-fit items-center gap-2 border-b border-olive pb-1 text-sm font-bold uppercase text-olive transition hover:border-amber hover:text-amber"
                    >
                      Închiriază utilaj
                      <span aria-hidden="true">-&gt;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section className="py-20 md:py-28">
          <SectionContainer>
            <h2 className="mb-8 font-serif-display text-4xl font-semibold text-olive">
              Ce utilaj se potrivește lucrării tale?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-olive">
                    <th className="py-4 pr-6 text-xs font-bold uppercase text-muted">
                      Tip lucrare
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-olive">
                      Excavator
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-olive">
                      Buldoexcavator
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-olive">
                      Încărcător frontal
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  {comparisonRows.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-olive/10 transition hover:bg-white/70"
                    >
                      {row.map((cell, index) => (
                        <td
                          // Indexul coloanei, nu valoarea: celule cu același text
                          // (ex. „Da", „Da") ar produce chei duplicate pe același rând.
                          key={`${row[0]}-${index}`}
                          className={`py-5 ${index === 0 ? "pr-6 font-semibold text-olive" : "px-6 text-stone"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
