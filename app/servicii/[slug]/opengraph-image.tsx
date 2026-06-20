import { getServicePage } from "@/app/data/services";
import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `Serviciu ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServicePage(slug);
  return renderOgImage({
    eyebrow: service?.eyebrow ?? "Servicii",
    title: service?.title ?? "Servicii PACA CONSTRUCT",
  });
}
