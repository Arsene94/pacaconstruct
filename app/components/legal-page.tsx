import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "./footer";
import { SiteNavbar } from "./site-navbar";
import { SectionContainer } from "./section-container";
import { getServiceGroups } from "../data/services";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbSchema } from "@/app/lib/schema";

/**
 * Cadru comun pentru paginile legale (confidențialitate, termeni): Navbar +
 * breadcrumb + titlu + dată „ultima actualizare" + conținut prose, în paleta
 * site-ului. Conținutul juridic concret e furnizat de pagina apelantă.
 */
export async function LegalPage({
  title,
  breadcrumbLabel,
  path,
  updatedAt,
  children,
}: {
  title: string;
  breadcrumbLabel: string;
  path: string;
  updatedAt: string;
  children: ReactNode;
}) {
  const serviceGroups = await getServiceGroups();

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: breadcrumbLabel, path },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="bg-topo py-20 md:py-28">
        <SectionContainer>
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm font-medium text-stone"
          >
            <Link href="/" className="hover:text-amber-strong">
              Acasă
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-olive">{breadcrumbLabel}</span>
          </nav>
          <h1 className="max-w-4xl font-serif-display text-4xl font-semibold leading-tight text-olive md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-muted">Ultima actualizare: {updatedAt}</p>
          <div
            className={[
              "mt-10 max-w-3xl text-base leading-7 text-stone",
              "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-olive",
              "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-[0.08em] [&_h3]:text-sm [&_h3]:text-amber-strong",
              "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:grid [&_ul]:gap-2 [&_ul>li]:ml-5 [&_ul>li]:list-disc",
              "[&_a]:text-amber-strong [&_a]:underline [&_a]:underline-offset-2",
              "[&_strong]:font-bold [&_strong]:text-olive",
              "[&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:leading-6",
              "[&_th]:border [&_th]:border-olive/15 [&_th]:bg-white [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_th]:font-bold [&_th]:text-olive",
              "[&_td]:border [&_td]:border-olive/15 [&_td]:p-3 [&_td]:align-top",
            ].join(" ")}
          >
            {children}
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </div>
  );
}
