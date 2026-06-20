import { getRentalMachine } from "@/app/data/rentals";
import { siteConfig } from "@/app/lib/site-config";
import { renderOgImage } from "@/app/lib/og-image";

export const alt = `Închiriere utilaj ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const machine = await getRentalMachine(slug);
  return renderOgImage({
    eyebrow: machine?.category ?? "Închiriere utilaje",
    title: machine?.title ?? "Închiriere utilaje cu operator",
  });
}
