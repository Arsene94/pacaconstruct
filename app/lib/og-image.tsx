import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/lib/site-config";

/** Dimensiunea standard OG/Twitter (1200×630). Reutilizată în fișierele OG. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Randează imaginea OG comună brandului: fundal olive, accent amber, eyebrow +
 * titlu + brand. Folosită de toate rutele `opengraph-image`/`twitter-image`.
 */
export function renderOgImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: siteConfig.colors.olive,
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: siteConfig.colors.amber,
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 76,
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(255,255,255,0.15)",
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)" }}>
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
