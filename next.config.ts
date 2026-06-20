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

// CSP livrat în Report-Only: monitorizăm violările fără să blocăm. Comutarea pe
// enforce se face dintr-un singur loc (afectează și header-ul, și directivele
// care n-au efect în Report-Only, ex. `upgrade-insecure-requests`).
const CSP_REPORT_ONLY = true;

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
// Origini terțe pentru tracking & consimțământ. Tot ce încarcă pe paginile
// publice trece prin GTM (container) + GA4 (tag-uri) + cookie-script (CMP/banner
// de cookie-uri, încărcat din GTM). Le declarăm explicit ca CSP-ul să nu mai
// raporteze violări pentru resursele legitime. Vezi [[paca-tracking]].
const GTM = "https://www.googletagmanager.com";
const GA =
  "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";
const COOKIE_SCRIPT = "https://cdn.cookie-script.com https://*.cookie-script.com";

function contentSecurityPolicy(): string {
  const supabase = supabaseOrigin();
  const supabaseWs = supabase.replace(/^http/, "ws");
  const directives = [
    `default-src 'self'`,
    // 'unsafe-inline' rămâne necesar pentru scripturile de bootstrap RSC
    // injectate inline de Next în shell-ul static (nu pot purta nonce sub PPR).
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${GTM} ${COOKIE_SCRIPT}`,
    `style-src 'self' 'unsafe-inline' ${COOKIE_SCRIPT}`,
    `img-src 'self' blob: data: ${supabase} ${GTM} ${GA} ${COOKIE_SCRIPT}`,
    `font-src 'self' ${COOKIE_SCRIPT}`,
    `connect-src 'self' ${supabase} ${supabaseWs} ${GTM} ${GA} ${COOKIE_SCRIPT}`,
    `frame-src 'self' ${GTM}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ];
  // `upgrade-insecure-requests` e ignorat în politicile Report-Only (per spec) și
  // doar produce un warning în consolă — îl adăugăm doar când CSP-ul e enforced.
  if (!CSP_REPORT_ONLY) directives.push(`upgrade-insecure-requests`);
  return directives.join("; ");
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
  // Report-Only cât timp monitorizăm violările; comută pe enforce din CSP_REPORT_ONLY.
  {
    key: CSP_REPORT_ONLY
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy",
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
  // `cacheHandler` e referit prin `require.resolve` in config, nu importat din
  // codul rutelor — asa ca @vercel/nft nu il vede ca dependinta si nu-l copiaza
  // in bundle-ul serverless (Lambda). Fortam includerea fisierului pentru toate
  // rutele, altfel la runtime crapa cu ERR_MODULE_NOT_FOUND:
  // /var/task/cache-handlers/upstash-incremental.js.
  // Includerea prin glob NU re-analizeaza require-urile fisierului, deci trebuie
  // sa adaugam manual si dependintele handler-ului: @upstash/redis -> uncrypto.
  outputFileTracingIncludes: {
    "/**/*": [
      "./cache-handlers/**/*",
      "./node_modules/@upstash/redis/**/*",
      "./node_modules/uncrypto/**/*",
    ],
  },
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
