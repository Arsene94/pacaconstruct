import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { ServicePageTemplate } from "../../components/service-page-template";
import {
  getServicePage,
  serviceGroups,
  servicePages,
} from "../../data/services";

type ServiceRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    return {
      title: "Serviciu indisponibil - PACA CONSTRUCT",
    };
  }

  return {
    title: `${service.title} - PACA CONSTRUCT`,
    description: service.description,
  };
}

export default async function ServiceRoute({ params }: ServiceRouteProps) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <Navbar serviceGroups={serviceGroups} />
      <ServicePageTemplate service={service} />
      <Footer />
    </div>
  );
}
