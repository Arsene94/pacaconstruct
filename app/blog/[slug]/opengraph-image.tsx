import { getBlogPost } from "@/app/data/blog";
import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `Articol blog ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return renderOgImage({
    eyebrow: post?.category ?? "Blog",
    title: post?.title ?? "Blog PACA CONSTRUCT",
  });
}
