/**
 * Strat de date pentru marketing (dataLayer → GTM web).
 *
 * Singura cale prin care aplicația trimite semnal de tracking: împinge
 * evenimente `pc_*` în `window.dataLayer`. Pixelii de vendor (GA4, Google Ads,
 * TikTok, Meta) se configurează ÎN GTM și se declanșează din aceste evenimente.
 * NU există pixeli de vendor în cod, niciun endpoint server-side, niciun PII în
 * clar. Replică convențiile din medicalapp, cu prefix `pc_`.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type PacaMarketingEventName =
  | "pc_public_page_view"
  | "pc_view_service"
  | "pc_view_machine"
  | "pc_lead_submit"
  | "pc_newsletter_optin"
  | "pc_phone_click"
  | "pc_whatsapp_click"
  | "pc_email_click"
  | "pc_cta_click"
  | "pc_nav_click"
  | "pc_footer_link_click"
  | "pc_mobile_menu_open"
  | "pc_search"
  | "pc_scroll_depth";

export type PacaMarketingPayload = {
  event: PacaMarketingEventName;
  /** Poziția în pagină a elementului (ex: "navbar", "footer", "hero"). */
  placement?: string;
  /** Sursa logică a interacțiunii (ex: "float", "public_website"). */
  source?: string;
  /** Zona funcțională a paginii (ex: "contact", "produs"). */
  page_area?: string;
  /** Identificator stabil al linkului/butonului (ex: "cere_oferta"). */
  link_id?: string;
  /** Tipul de lead pentru conversii (ex: "serviciu" | "inchiriere"). */
  lead_type?: string;
  /** Numele articolului/serviciului/utilajului (slug sau titlu, fără PII). */
  item_name?: string;
  /** Valoarea estimată a conversiei (numerică, pentru Ads/Meta value-based). */
  value?: number;
  /** Moneda valorii (ex: "RON"). */
  currency?: string;
  /** Termenul de căutare (curățat, fără PII) pentru `pc_search`. */
  search_term?: string;
  /** Pragul de scroll atins (25 | 50 | 75 | 90) pentru `pc_scroll_depth`. */
  percent?: number;
};

/**
 * Prefixe de path unde tracking-ul NU rulează niciodată: zone private,
 * fluxuri cu PII, API și pagini tehnice. PACA nu are prefix de limbă în URL,
 * deci nu există `stripLocale` (spre deosebire de medicalapp).
 */
const BLOCKED_MARKETING_PATH_PREFIXES = [
  "/admin",
  "/login",
  "/auth",
  "/api",
  "/unsubscribe",
] as const;

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isBlockedMarketingPath(pathname?: string | null) {
  if (!pathname) {
    return true;
  }

  return BLOCKED_MARKETING_PATH_PREFIXES.some((prefix) =>
    matchesPathPrefix(pathname, prefix),
  );
}

export function isPublicMarketingPath(pathname?: string | null) {
  return !isBlockedMarketingPath(pathname);
}

/**
 * Normalizează valorile de string înainte de a le împinge în dataLayer:
 * lowercase, fără diacritice/caractere speciale, scurtate. Garantează că nu
 * scapă PII în clar prin câmpuri text libere și ține parametrii consistenți.
 */
function cleanMarketingValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_/-]/g, "_")
    .slice(0, 80);
}

function clean(value: string | undefined) {
  return value ? cleanMarketingValue(value) : undefined;
}

/**
 * Împinge un eveniment de marketing în `window.dataLayer`.
 *
 * - SSR-safe: `return null` pe server.
 * - Gating pe path: nu trimite nimic pe pagini non-publice.
 * - Generează `event_id` (crypto.randomUUID cu fallback) pentru deduplicare
 *   server-side / Enhanced Conversions / Meta CAPI matching în GTM.
 * - Curăță toate valorile text; valorile numerice (value/percent) trec direct.
 *
 * Returnează `event_id` sau `null` dacă nu s-a trimis nimic.
 */
export function pushMarketingEvent(payload: PacaMarketingPayload) {
  if (typeof window === "undefined") {
    return null;
  }

  const pathname = window.location.pathname;

  if (!isPublicMarketingPath(pathname)) {
    return null;
  }

  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: payload.event,
    event_id: eventId,

    page_path: pathname,
    page_host: window.location.hostname,
    page_type: "public_marketing",

    placement: clean(payload.placement),
    source: clean(payload.source),
    page_area: clean(payload.page_area),
    link_id: clean(payload.link_id),

    lead_type: clean(payload.lead_type),
    item_name: clean(payload.item_name),
    value: typeof payload.value === "number" ? payload.value : undefined,
    currency: clean(payload.currency),

    search_term: clean(payload.search_term),
    percent: typeof payload.percent === "number" ? payload.percent : undefined,
  });

  return eventId;
}
