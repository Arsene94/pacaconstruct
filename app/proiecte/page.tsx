import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "../components/footer";
import { SiteNavbar } from "../components/site-navbar";
import { SectionContainer } from "../components/section-container";
import { getServiceGroups } from "../data/services";
import { getPublishedProjects, type PublicProject } from "../data/projects";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/app/lib/schema";

// Navbar citește din DB (cache Upstash) → randare dinamică, ca în restul app.
export const revalidate = 3600; // ISR: shell static + reîmprospătare; datele vin din unstable_cache (cookie-free)

export const metadata: Metadata = {
  title: "Proiecte și lucrări realizate",
  description:
    "Portofoliu PACA CONSTRUCT: studii de caz cu lucrări de terasamente, excavări și amenajări peisagistice — tip lucrare, locație și rezultat.",
  alternates: { canonical: "/proiecte" },
  openGraph: {
    type: "website",
    title: "Proiecte și lucrări realizate | PACA CONSTRUCT",
    description:
      "Studii de caz cu lucrări de terasamente, excavări și amenajări peisagistice.",
    url: "/proiecte",
  },
};

// Exemple-rezervă afișate cât timp nu există proiecte publicate din admin.
// Adminul adaugă proiecte reale din /admin/proiecte (bifând „Publicat").
const fallbackProjects: PublicProject[] = [
  {
    slug: null,
    name: "Sistematizare teren și fundații — ansamblu rezidențial",
    type: "Terasamente",
    location: "Ilfov",
    summary:
      "Defrișare ușoară, nivelare și săpături pentru fundații pe un teren de mari dimensiuni, predat pregătit pentru construcție.",
    imageSrc: null,
    imageAlt: null,
    imageBeforeSrc: null,
    imageBeforeAlt: null,
  },
  {
    slug: null,
    name: "Excavări utilități și drenaj — proiect comercial",
    type: "Excavări",
    location: "București",
    summary:
      "Săpături pentru rețele de utilități și sistem de drenaj, cu gestionarea accesului pe un șantier urban cu spațiu limitat.",
    imageSrc: null,
    imageAlt: null,
    imageBeforeSrc: null,
    imageBeforeAlt: null,
  },
  {
    slug: null,
    name: "Amenajare peisagistică curte rezidențială",
    type: "Amenajări",
    location: "Prahova",
    summary:
      "Modelare teren, sistem de irigații și amenajarea completă a spațiului verde, de la teren brut la grădină finisată.",
    imageSrc: null,
    imageAlt: null,
    imageBeforeSrc: null,
    imageBeforeAlt: null,
  },
];

export default async function ProiectePage() {
  const [serviceGroups, published] = await Promise.all([
    getServiceGroups(),
    getPublishedProjects(),
  ]);
  const projects = published.length > 0 ? published : fallbackProjects;

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Proiecte", path: "/proiecte" },
        ])}
        id="breadcrumb"
      />
      <JsonLd
        data={itemListSchema(
          "Proiecte și lucrări realizate",
          projects.map((p) => ({ name: p.name, path: "/proiecte" })),
        )}
        id="itemlist"
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
              <span className="font-bold text-olive">Proiecte</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">
              Portofoliu
            </p>
            <h1 className="mt-5 max-w-4xl font-serif-display text-4xl font-semibold leading-[1.08] text-olive md:text-6xl">
              Proiecte și lucrări realizate
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">
              Selecție de lucrări de terasamente, excavări și amenajări peisagistice
              executate de echipa PACA CONSTRUCT. Fiecare proiect pornește de la o
              evaluare la fața locului și se încheie cu un teren pregătit sau amenajat.
            </p>
          </SectionContainer>
        </section>

        <section className="border-t border-olive/10 pb-20 pt-12 md:pb-28">
          <SectionContainer className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => {
              const card = (
                <>
                  {project.imageSrc ? (
                    <div className="relative h-48 bg-[#f6f3ed]">
                      <Image
                        src={project.imageSrc}
                        alt={project.imageAlt || project.name}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em]">
                      <span className="bg-olive px-2 py-1 text-white">
                        {project.type}
                      </span>
                      <span className="text-stone">{project.location}</span>
                    </div>
                    <h2 className="mt-4 font-serif-display text-2xl font-medium text-olive">
                      {project.name}
                    </h2>
                    <p className="mt-3 flex-1 text-base leading-7 text-stone">
                      {project.summary}
                    </p>
                    {project.slug ? (
                      <span className="mt-4 inline-flex text-xs font-bold uppercase text-olive group-hover:text-amber">
                        Vezi proiectul →
                      </span>
                    ) : null}
                  </div>
                </>
              );
              const key = `${project.name}-${project.location}`;
              const className =
                "group flex flex-col overflow-hidden border border-olive/15 bg-white shadow-sm shadow-carbon/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-carbon/10";
              return project.slug ? (
                <Link key={key} href={`/proiecte/${project.slug}`} className={className}>
                  {card}
                </Link>
              ) : (
                <article key={key} className={className}>
                  {card}
                </article>
              );
            })}
          </SectionContainer>
        </section>

        <section className="bg-olive py-16 text-white md:py-24">
          <SectionContainer className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <h2 className="max-w-2xl font-serif-display text-3xl font-semibold md:text-4xl">
              Vrei un rezultat similar pe terenul tău?
            </h2>
            <Link
              href="/contact#form-section"
              className="inline-flex justify-center bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
            >
              Cere o evaluare
            </Link>
          </SectionContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
