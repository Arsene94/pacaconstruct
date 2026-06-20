import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Rulează `npm run analyze` (ANALYZE=true) pentru rapoarte de bundle.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Derivă originea Supabase (din NEXT_PUBLIC_SUPABASE_URL) sub două forme:
 *  - `hostname` pentru `images.remotePatterns` (next/image optimizează Storage)
 *  - `origin` (protocol//host:port) pentru directivele CSP `connect-src`/`img-src`
 * Dacă variabila lipsește la build, cădem pe wildcard-ul `*.supabase.co`.
 */
function supabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  try {
    if (url) return new URL(url).hostname;
  } catch {
    // ignore — folosim fallback-ul de mai jos
  }
  return "*.supabase.co";
}

function supabaseOrigin(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  try {
    if (url) return new URL(url).origin;
  } catch {
    // ignore
  }
  return "https://*.supabase.co";
}

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy. Pornește în Report-Only (vezi `headers()` mai jos):
 * raportează violările fără să blocheze, ca să nu regresăm nimic la activare.
 *
 * Notă de arhitectură: nu folosim nonce. CSP cu nonce forțează randare 100%
 * dinamică și este INCOMPATIBIL cu Partial Prerendering / `cacheComponents`
 * (vezi ghidul Next.js). Cum obiectivul principal sunt Core Web Vitals (shell
 * static + streaming), păstrăm PPR și folosim o politică statică, compatibilă
 * cu shell-ul prerandate. Fonturile sunt self-hosted (next/font) → `'self'`.
 */
function contentSecurityPolicy(): string {
  const supabase = supabaseOrigin();
  const supabaseWs = supabase.replace(/^http/, "ws");
  return [
    `default-src 'self'`,
    // 'unsafe-inline' rămâne necesar pentru scripturile de bootstrap RSC
    // injectate inline de Next în shell-ul static (nu pot purta nonce sub PPR).
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: ${supabase}`,
    `font-src 'self'`,
    `connect-src 'self' ${supabase} ${supabaseWs}`,
    `frame-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Report-Only: monitorizăm violările înainte de a comuta pe enforce.
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy(),
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // Cache-ul de date al Next (unstable_cache / ISR / route handlers) e mutat
  // pe Upstash Redis, partajat intre toate instantele. Degradeaza la in-memory
  // daca UPSTASH_REDIS_REST_* lipsesc (vezi handler).
  cacheHandler: require.resolve("./cache-handlers/upstash-incremental.js"),
  cacheMaxMemorySize: 0, // dezactiveaza cache-ul implicit in-memory (folosim Redis)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
