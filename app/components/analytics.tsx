import Script from "next/script";

/**
 * Google Analytics 4, încărcat doar dacă `NEXT_PUBLIC_GA_ID` e setat — altfel
 * nu se randează nimic (zero impact în dev / fără consimțământ configurat).
 *
 * `strategy="afterInteractive"` ține scriptul în afara căii critice de
 * randare (bun pentru Core Web Vitals). Pentru conformitate GDPR completă,
 * integrează un banner de consimțământ care setează GA `consent` înainte de
 * `config`. // TODO: adaugă management de consimțământ dacă e necesar.
 *
 * Alternativă Vercel-native: `@vercel/analytics` + `@vercel/speed-insights`
 * (necesită instalarea pachetelor) — vezi raportul.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
