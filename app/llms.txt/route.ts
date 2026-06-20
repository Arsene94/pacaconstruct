import { siteConfig, siteUrl, addressLine } from "@/app/lib/site-config";
import { getServicePages } from "@/app/data/services";
import { getBlogPosts } from "@/app/data/blog";
import { getRentalMachines } from "@/app/data/rentals";
import { serviceAreas } from "@/app/data/service-areas";

/**
 * `/llms.txt` — index Markdown al paginilor cheie, pentru tooling/LLM-uri.
 *
 * Notă onestă (2026): Google a confirmat că `llms.txt` NU influențează AI
 * Overviews și niciun LLM major nu îl citește în producție. E adăugat doar
 * pentru completitudine — citarea reală vine din conținut + date structurate
 * (vezi app/lib/schema.ts), nu de aici.
 */
export const revalidate = 3600;

export async function GET() {
  const [services, posts, machines] = await Promise.all([
    getServicePages().catch(() => []),
    getBlogPosts().catch(() => []),
    getRentalMachines().catch(() => []),
  ]);

  const lines: string[] = [
    `# ${siteConfig.legalName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `- Zone deservite: ${siteConfig.areaServed.join(", ")}`,
    `- Contact: ${siteConfig.phoneDisplay} · ${siteConfig.email}`,
    `- Sediu: ${addressLine()}`,
    "",
    "## Pagini principale",
    `- [Acasă](${siteUrl}/)`,
    `- [Despre noi](${siteUrl}/despre)`,
    `- [Proiecte](${siteUrl}/proiecte)`,
    `- [Închirieri utilaje](${siteUrl}/inchiriere-utilaje)`,
    `- [Întrebări frecvente](${siteUrl}/faq)`,
    `- [Blog](${siteUrl}/blog)`,
    `- [Contact](${siteUrl}/contact)`,
    "",
    "## Zone deservite",
    ...serviceAreas.map(
      (a) => `- [${a.name}](${siteUrl}/zona/${a.slug})`,
    ),
  ];

  if (services.length) {
    lines.push("", "## Servicii");
    for (const s of services) {
      lines.push(`- [${s.title}](${siteUrl}/servicii/${s.slug})`);
    }
  }

  if (machines.length) {
    lines.push("", "## Utilaje de închiriat");
    for (const m of machines) {
      lines.push(`- [${m.title}](${siteUrl}/inchiriere-utilaje/${m.slug})`);
    }
  }

  if (posts.length) {
    lines.push("", "## Articole blog");
    for (const p of posts) {
      lines.push(`- [${p.title}](${siteUrl}/blog/${p.slug})`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
