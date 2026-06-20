import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { SiteNavbar } from "../../components/site-navbar";
import { ServicePageTemplate } from "../../components/service-page-template";
import { getServicePage, getServicePages, getServiceGroups } from "../../data/services";
import { JsonLd } from "@/app/components/json-ld";
import { ViewItemTracker } from "@/app/components/marketing/view-item-tracker";
import { breadcrumbSchema, qaFaqPageSchema, serviceSchema } from "@/app/lib/schema";
import { serviceFaq } from "@/app/lib/service-faq";

// Pagini pre-randate (ISR). Datele vin din cache-ul Upstash; revalidare la 1h,
// coerent cu profilul de cache al serviciilor.
export const revalidate = 3600;

/** Pre-randează slug-urile serviciilor publicate. Tolerant la DB indisponibil
 *  la build (paginile se randează atunci on-demand prin ISR). */
export async function generateStaticParams() {
  try {
    const services = await getServicePages();
    return services.map((service) => ({ slug: service.slug }));
  } catch {
    return [];
  }
}

type ServiceRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServicePage(slug);

  if (!service) {
    return {
      title: "Serviciu indisponibil",
    };
  }

  const canonical = `/servicii/${slug}`;
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${service.title} | PACA CONSTRUCT`,
      description: service.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | PACA CONSTRUCT`,
      description: service.description,
    },
  };
}

export default async function ServiceRoute({ params }: ServiceRouteProps) {
  const { slug } = await params;
  const [service, serviceGroups] = await Promise.all([
    getServicePage(slug),
    getServiceGroups(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <ViewItemTracker event="pc_view_service" itemName={slug} />
      <JsonLd data={serviceSchema(service)} id="service" />
      <JsonLd
        data={qaFaqPageSchema(
          service.faqs.length > 0 ? service.faqs : serviceFaq(service.title),
        )}
        id="faq"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Servicii", path: "/#servicii" },
          { name: service.title, path: `/servicii/${slug}` },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <ServicePageTemplate service={service} />
      <Footer />
    </div>
  );
}
