import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/lib/site-config";

// Favicon / icon generat (monogram „PC" pe fundal brand). 512×512 pentru a
// servi și ca sursă pentru schema `logo` și pentru manifest (inclusiv maskable).
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.colors.olive,
          color: siteConfig.colors.amber,
          fontSize: 280,
          fontWeight: 700,
          letterSpacing: -16,
        }}
      >
        PC
      </div>
    ),
    { ...size },
  );
}
