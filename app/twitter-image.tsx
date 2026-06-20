import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `${siteConfig.legalName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Terasamente · Excavări · Amenajări",
    title: "Terasamente, excavări și amenajări peisagistice",
  });
}
