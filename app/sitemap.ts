import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/lib/site-config";
import { createPublicClient } from "@/app/lib/supabase/public";
import { serviceAreas } from "@/app/data/service-areas";

/**
 * Sitemap dinamic. Rutele statice sunt fixe; rutele dinamice (servicii, blog,
 * utilaje) vin din Supabase prin clientul public anon — RLS returnează doar
 * rândurile publicate, deci nicio rută privată/draft nu ajunge aici.
 *
 * `lastModified` folosește `updated_at` real din DB. La scalare mare se poate
 * trece la `generateSitemaps` (sharding la 50.000 URL-uri).
 */
// Trebuie să fie un literal (cerință a config-ului de segment Next.js).
export const revalidate = 3600;

type SlugRow = { slug: string; updated_at: string };
type SlugTable = "services" | "blog_posts" | "rental_machines";

async function fetchSlugs(table: SlugTable): Promise<SlugRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from(table)
      .select("slug, updated_at")
      .order("sort_order")
      .returns<SlugRow[]>();
    if (error) {
      console.error(`[sitemap] ${table}: ${error.message}`);
      return [];
    }
    return data ?? [];
  } catch (err) {
    // Sitemap-ul nu trebuie să dărâme build-ul dacă DB-ul e indisponibil.
    console.error(`[sitemap] ${table}:`, err);
    return [];
  }
}

/** Proiectele publicate cu slug (au pagină de detaliu /proiecte/[slug]). */
async function fetchPublishedProjectSlugs(): Promise<SlugRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("is_published", true)
      .not("slug", "is", null)
      .order("sort_order")
      .returns<SlugRow[]>();
    if (error) {
      console.error(`[sitemap] projects: ${error.message}`);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[sitemap] projects:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, machines, projects] = await Promise.all([
    fetchSlugs("services"),
    fetchSlugs("blog_posts"),
    fetchSlugs("rental_machines"),
    fetchPublishedProjectSlugs(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/inchiriere-utilaje`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/despre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/proiecte`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/termeni`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/confidentialitate`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Pagini de zonă (SEO local) — listă statică din service-areas.
  const zonaRoutes: MetadataRoute.Sitemap = serviceAreas.map((area) => ({
    url: `${siteUrl}/zona/${area.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/servicii/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const machineRoutes: MetadataRoute.Sitemap = machines.map((m) => ({
    url: `${siteUrl}/inchiriere-utilaje/${m.slug}`,
    lastModified: new Date(m.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/proiecte/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...zonaRoutes,
    ...serviceRoutes,
    ...postRoutes,
    ...machineRoutes,
    ...projectRoutes,
  ];
}
