import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { SiteNavbar } from "../../components/site-navbar";
import { SectionContainer } from "../../components/section-container";
import { getRentalMachine, getRentalMachines } from "../../data/rentals";
import { getServiceGroups } from "../../data/services";
import { RentalRequestForm } from "./rental-request-form";
import { JsonLd } from "@/app/components/json-ld";
import { ViewItemTracker } from "@/app/components/marketing/view-item-tracker";
import { breadcrumbSchema, productSchema } from "@/app/lib/schema";

// Pagini pre-randate (ISR). Datele vin din cache-ul Upstash; revalidare la 1h.
export const revalidate = 3600;

/** Pre-randează slug-urile utilajelor publicate. Tolerant la DB indisponibil
 *  la build (paginile se randează atunci on-demand prin ISR). */
export async function generateStaticParams() {
  try {
    const machines = await getRentalMachines();
    return machines.map((machine) => ({ slug: machine.slug }));
  } catch {
    return [];
  }
}

type RentalRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: RentalRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = await getRentalMachine(slug);

  // Slug inexistent → 404. Ruta de detaliu nu are `loading.tsx` (skeletonul
  // listei stă în route group-ul `(list)`), deci nu se face streaming și
  // `notFound()` setează status HTTP 404 real, nu soft-404 (200).
  // Vezi docs Next 16: loading#status-codes.
  if (!machine) {
    notFound();
  }

  const canonical = `/inchiriere-utilaje/${slug}`;
  const title = `${machine.title} - Închiriere utilaje cu operator`;
  return {
    title,
    description: machine.longDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${title} | PACA CONSTRUCT`,
      description: machine.longDescription,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | PACA CONSTRUCT`,
      description: machine.longDescription,
    },
  };
}

export default async function RentalProductPage({ params }: RentalRouteProps) {
  const { slug } = await params;
  const [machine, serviceGroups] = await Promise.all([
    getRentalMachine(slug),
    getServiceGroups(),
  ]);

  if (!machine) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <ViewItemTracker event="pc_view_machine" itemName={slug} />
      <JsonLd data={productSchema(machine)} id="product" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Închirieri utilaje", path: "/inchiriere-utilaje" },
          { name: machine.title, path: `/inchiriere-utilaje/${slug}` },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="bg-topo flex-grow">
        <SectionContainer className="py-10 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm font-medium text-stone"
          >
            <Link href="/" className="hover:text-amber">
              Acasă
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/inchiriere-utilaje" className="hover:text-amber">
              Închirieri utilaje
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-olive">{machine.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative mb-8 h-[420px] overflow-hidden border border-olive/10 bg-white shadow-xl shadow-carbon/5 md:h-[610px]">
                <Image
                  src={machine.imageSrc}
                  alt={machine.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/25 to-transparent" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
                Operator inclus
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="bg-olive px-3 py-1 text-xs font-bold uppercase text-white">
                  Tarif
                </span>
                <span className="font-serif-display text-2xl font-semibold text-olive">
                  {machine.price}
                </span>
              </div>
              <h1 className="mt-5 font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
                {machine.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">
                {machine.longDescription}
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <InfoPanel title="Lucrări potrivite" items={machine.uses} />
                <InfoPanel title="Cerințe de acces" items={machine.accessRequirements} />
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-32 border border-olive/10 bg-white p-6 shadow-xl shadow-carbon/5">
                <h2 className="font-serif-display text-3xl font-medium text-olive">
                  Cere utilajul
                </h2>
                <RentalRequestForm machineTitle={machine.title} />
              </div>
            </aside>
          </div>
        </SectionContainer>

        <section className="border-t border-olive/10 py-16 md:py-24">
          <SectionContainer>
            <div className="border border-olive/10 bg-[#f6f3ed] p-8">
              <h2 className="font-serif-display text-3xl font-medium text-olive">
                Ce influențează tariful
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  ["Complexitate", "Tipul de sol și adâncimea cerută."],
                  ["Durată", "Orele estimate pentru lucrare."],
                  ["Logistică", "Distanța, accesul și mobilizarea utilajului."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber">
                      {title}
                    </p>
                    <p className="mt-2 text-base leading-7 text-stone">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-olive/10 bg-white p-6 shadow-sm shadow-carbon/5">
      <h2 className="font-serif-display text-3xl font-medium text-olive">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-stone">
            <span className="h-2 w-2 bg-amber" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
