"use client";

import { useEffect } from "react";
import { pushMarketingEvent } from "@/app/lib/marketing/data-layer";

/**
 * Împinge `pc_search` o singură dată per termen, când pagina de blog e
 * randată cu o căutare activă. Termenul e curățat în dataLayer (fără PII).
 */
export function SearchTracker({ term }: { term: string }) {
  useEffect(() => {
    if (!term) return;
    pushMarketingEvent({ event: "pc_search", search_term: term });
  }, [term]);

  return null;
}
