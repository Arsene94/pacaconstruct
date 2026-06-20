"use client";

import { useEffect } from "react";
import {
  pushMarketingEvent,
  type PacaMarketingEventName,
} from "@/app/lib/marketing/data-layer";

/**
 * Împinge un eveniment de tip „view item" o singură dată la montare (pe
 * paginile de serviciu/utilaj). Nu randează nimic. `item_name` e curățat în
 * dataLayer, deci poate fi slug sau titlu — fără PII.
 */
export function ViewItemTracker({
  event,
  itemName,
}: {
  event: Extract<PacaMarketingEventName, "pc_view_service" | "pc_view_machine">;
  itemName: string;
}) {
  useEffect(() => {
    pushMarketingEvent({ event, item_name: itemName });
  }, [event, itemName]);

  return null;
}
