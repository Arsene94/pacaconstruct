import { getServiceArea } from "@/app/data/service-areas";
import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `Zonă de serviciu ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  return renderOgImage({
    eyebrow: area ? `Zonă deservită · ${area.county}` : "Zone deservite",
    title: area
      ? `Terasamente și amenajări ${area.locative}`
      : "Zone deservite",
  });
}
