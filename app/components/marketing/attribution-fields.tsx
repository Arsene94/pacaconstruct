"use client";

import { useEffect, useRef } from "react";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_PARAMS,
  CONSENT_ADS_COOKIE,
  type AttributionParam,
} from "@/app/lib/marketing/attribution";

type AttributionState = Partial<Record<AttributionParam | "landing_page", string>>;

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 zile

function readCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Captează atribuirea (click-IDs + UTM + landing page) și o injectează ca
 * `<input type="hidden">` în formularele de intake.
 *
 * Strategie first-touch: la prima aterizare dintr-o reclamă, parametrii din URL
 * sunt persistați într-un cookie first-party (90 zile). Pe pagina formularului
 * (unde URL-ul nu mai are parametrii) îi recuperăm din cookie. Astfel un lead
 * trimis după câteva pagini păstrează sursa campaniei → import offline corect.
 *
 * Inputurile sunt necontrolate: SSR randează valori goale, iar după montare
 * (client-only) le scriem direct în DOM prin refs — fără setState (evităm
 * hydration mismatch și re-randări inutile). Dacă JS nu rulează, formularul
 * funcționează normal, doar fără atribuire.
 */
export function AttributionFields() {
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const stored: AttributionState = (() => {
      try {
        const raw = readCookie(ATTRIBUTION_COOKIE);
        return raw ? (JSON.parse(raw) as AttributionState) : {};
      } catch {
        return {};
      }
    })();

    const url = new URLSearchParams(window.location.search);
    const merged: AttributionState = { ...stored };

    for (const key of ATTRIBUTION_PARAMS) {
      const fromUrl = url.get(key);
      if (fromUrl) merged[key] = fromUrl;
    }

    // landing_page: prima pagină de aterizare (first-touch); nu se suprascrie.
    if (!merged.landing_page) {
      merged.landing_page = window.location.pathname + window.location.search;
    }

    document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(
      JSON.stringify(merged),
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    for (const key of ATTRIBUTION_PARAMS) {
      const el = refs.current[key];
      if (el) el.value = merged[key] ?? "";
    }
    if (refs.current.landing_page) {
      refs.current.landing_page.value = merged.landing_page ?? "";
    }
    if (refs.current.consent_ads) {
      refs.current.consent_ads.value =
        readCookie(CONSENT_ADS_COOKIE) === "true" ? "1" : "0";
    }
  }, []);

  return (
    <>
      {ATTRIBUTION_PARAMS.map((key) => (
        <input
          key={key}
          ref={(el) => {
            refs.current[key] = el;
          }}
          type="hidden"
          name={key}
          defaultValue=""
        />
      ))}
      <input
        ref={(el) => {
          refs.current.landing_page = el;
        }}
        type="hidden"
        name="landing_page"
        defaultValue=""
      />
      <input
        ref={(el) => {
          refs.current.consent_ads = el;
        }}
        type="hidden"
        name="consent_ads"
        defaultValue="0"
      />
    </>
  );
}
