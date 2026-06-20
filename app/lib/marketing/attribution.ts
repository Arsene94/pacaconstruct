/**
 * Atribuire pentru conversii offline (Faza 7).
 *
 * Captăm la submit identificatorii de click (gclid/fbclid/…) și UTM-urile, ca
 * să putem importa manual conversiile câștigate în Google Ads / Meta. Fără
 * server-side: doar stocăm. Identificatorii ajung din URL/cookie în câmpuri
 * hidden (vezi `AttributionFields`) și se citesc aici din `FormData`.
 */

import { sanitizeText } from "@/app/lib/validation";

/** Identificatori de click pe platformă (din URL la aterizarea din reclamă). */
export const CLICK_ID_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

/** Parametri UTM standard de campanie. */
export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Toți parametrii de atribuire stocați în cookie + câmpuri hidden. */
export const ATTRIBUTION_PARAMS = [...CLICK_ID_PARAMS, ...UTM_PARAMS] as const;

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];

/** Numele cookie-ului first-party care păstrează atribuirea primei vizite. */
export const ATTRIBUTION_COOKIE = "paca_attr";

/** Cookie setat de un eventual banner de consimțământ (Faza 6). */
export const CONSENT_ADS_COOKIE = "paca_consent_ads";

const MAX_VALUE_LENGTH = 512;

/** Curăță o valoare de atribuire: text fără control chars, lungime limitată. */
function cleanAttributionValue(value: unknown): string | null {
  const cleaned = sanitizeText(value).slice(0, MAX_VALUE_LENGTH);
  return cleaned.length ? cleaned : null;
}

/**
 * Extrage atribuirea din `FormData` (câmpuri hidden) în forma coloanelor DB.
 * Toate câmpurile sunt opționale; lipsa lor → `null`.
 */
export function readAttribution(form: FormData) {
  const row: Record<string, string | boolean | null> = {};

  for (const key of ATTRIBUTION_PARAMS) {
    row[key] = cleanAttributionValue(form.get(key));
  }

  row.landing_page = cleanAttributionValue(form.get("landing_page"));

  const consent = String(form.get("consent_ads") ?? "").toLowerCase();
  row.consent_ads = consent === "on" || consent === "true" || consent === "1";

  return row as {
    gclid: string | null;
    gbraid: string | null;
    wbraid: string | null;
    fbclid: string | null;
    ttclid: string | null;
    msclkid: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    landing_page: string | null;
    consent_ads: boolean;
  };
}
