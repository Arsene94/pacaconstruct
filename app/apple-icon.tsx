import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/lib/site-config";

// Icon pentru ecranul de start iOS (180×180), cu padding ca să arate bine rotunjit.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -6,
        }}
      >
        PC
      </div>
    ),
    { ...size },
  );
}
