import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.legalName} — Terasamente și amenajări`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.colors.olive,
    theme_color: siteConfig.colors.olive,
    lang: siteConfig.lang,
    categories: ["business", "construction", "landscaping"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
