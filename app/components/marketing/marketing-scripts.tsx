"use client";

import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { isPublicMarketingPath } from "@/app/lib/marketing/data-layer";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Încarcă GTM (container web) o singură dată, DOAR pe paginile publice.
 *
 * Înainte de GTM setează Consent Mode v2 default = `denied` pentru toate
 * categoriile (cu excepția `security_storage`). Astfel, fără consimțământ, GTM
 * și tag-urile rulează în mod „modelare" (cookieless), conform GDPR. Un eventual
 * banner (vezi consent-banner) face apoi `gtag('consent','update',...)`.
 *
 * Dacă `NEXT_PUBLIC_GTM_ID` lipsește sau pagina nu e publică → nu randează nimic.
 */
export function MarketingScripts() {
  const pathname = usePathname();

  if (!gtmId || !isPublicMarketingPath(pathname)) {
    return null;
  }

  return (
    <>
      <Script
        id="paca-consent-mode-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
          `.trim(),
        }}
      />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}
