import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { siteConfig } from "@/app/lib/site-config";
import { JsonLd } from "@/app/components/json-ld";
import { Analytics } from "@/app/components/analytics";
import { organizationSchema, websiteSchema } from "@/app/lib/schema";

// display: "swap" + adjustFontFallback (implicit) + fallback explicit țin CLS la
// zero: textul e vizibil imediat cu un fallback metric-compatibil, apoi se schimbă.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Georgia", "ui-serif", "serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.legalName} — Terasamente, excavări și amenajări peisagistice`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.siteUrl }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [...siteConfig.keywords],
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.siteUrl,
    title: `${siteConfig.legalName} — Terasamente, excavări și amenajări peisagistice`,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.legalName} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.legalName} — Terasamente, excavări și amenajări peisagistice`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Valorile vin din env (// TODO: completează în producție). Lipsa lor =
    // niciun tag generat, deci nu strică build-ul.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.colors.olive,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${manrope.variable} ${sourceSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip-to-content: primul element focusabil, vizibil doar la focus. */}
        <a
          href="#main"
          className="sr-only z-[100] bg-amber px-4 py-2 text-sm font-bold uppercase text-carbon focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Sari la conținut
        </a>
        {/* Date structurate globale: prezente pe toate paginile (server-rendered). */}
        <JsonLd data={organizationSchema()} id="organization" />
        <JsonLd data={websiteSchema()} id="website" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
