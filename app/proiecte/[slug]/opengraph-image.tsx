import { getPublishedProject } from "@/app/data/projects";
import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `Proiect ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  return renderOgImage({
    eyebrow: project ? `Proiect · ${project.type}` : "Proiecte",
    title: project?.name ?? "Proiecte PACA CONSTRUCT",
  });
}
