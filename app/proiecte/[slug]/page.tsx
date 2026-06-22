import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { SiteNavbar } from "../../components/site-navbar";
import { SectionContainer } from "../../components/section-container";
import { getServiceGroups } from "../../data/services";
import { getPublishedProject } from "../../data/projects";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema, projectSchema } from "@/app/lib/schema";

// Navbar + proiectul vin din DB (cache Upstash) → randare dinamică, ca în restul
// aplicației. Conținutul rămâne server-rendered (SEO ok).
export const revalidate = 3600; // ISR: shell static + reîmprospătare; datele vin din unstable_cache (cookie-free)

type ProiectRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProiectRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Proiect indisponibil" };

  const canonical = `/proiecte/${slug}`;
  const description = project.summary || `${project.type} — ${project.location}`;
  return {
    title: project.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${project.name} | PACA CONSTRUCT`,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | PACA CONSTRUCT`,
      description,
    },
  };
}

export default async function ProiectDetailPage({ params }: ProiectRouteProps) {
  const { slug } = await params;
  const [serviceGroups, project] = await Promise.all([
    getServiceGroups(),
    getPublishedProject(slug),
  ]);

  if (!project) notFound();

  const hasBefore = Boolean(project.imageBeforeSrc);
  const hasAfter = Boolean(project.imageSrc);
  const hasGallery = hasBefore || hasAfter;
  // Galerie comparativă doar dacă există AMBELE imagini; altfel o singură imagine.
  const isBeforeAfter = hasBefore && hasAfter;

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd data={projectSchema(project)} id="project" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Proiecte", path: "/proiecte" },
          { name: project.name, path: `/proiecte/${slug}` },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="bg-topo">
        <section className="py-16 md:py-24">
          <SectionContainer>
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm font-medium text-stone"
            >
              <Link href="/" className="hover:text-amber-strong">
                Acasă
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/proiecte" className="hover:text-amber-strong">
                Proiecte
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-olive">{project.name}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em]">
              <span className="bg-olive px-2 py-1 text-white">{project.type}</span>
              {project.location ? (
                <span className="text-stone">{project.location}</span>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-4xl font-serif-display text-4xl font-semibold leading-[1.08] text-olive md:text-6xl">
              {project.name}
            </h1>
            {project.summary ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">
                {project.summary}
              </p>
            ) : null}
          </SectionContainer>
        </section>

        {hasGallery ? (
          <section className="pb-16 md:pb-24">
            <SectionContainer>
              {isBeforeAfter ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <GalleryImage
                    label="Înainte"
                    src={project.imageBeforeSrc as string}
                    alt={project.imageBeforeAlt || `${project.name} — înainte`}
                  />
                  <GalleryImage
                    label="După"
                    src={project.imageSrc as string}
                    alt={project.imageAlt || `${project.name} — după`}
                  />
                </div>
              ) : (
                <GalleryImage
                  label={hasAfter ? "După" : "Înainte"}
                  src={(project.imageSrc || project.imageBeforeSrc) as string}
                  alt={
                    (hasAfter ? project.imageAlt : project.imageBeforeAlt) || project.name
                  }
                  wide
                />
              )}
            </SectionContainer>
          </section>
        ) : null}

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

function GalleryImage({
  label,
  src,
  alt,
  wide,
}: {
  label: string;
  src: string;
  alt: string;
  wide?: boolean;
}) {
  return (
    <figure className="overflow-hidden border border-olive/15 bg-white">
      <div className={`relative ${wide ? "aspect-[16/9]" : "aspect-[4/3]"} bg-[#f6f3ed]`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover"
        />
        <figcaption className="absolute left-0 top-0 bg-olive px-3 py-1 text-xs font-bold uppercase text-white">
          {label}
        </figcaption>
      </div>
    </figure>
  );
}
