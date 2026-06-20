"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  isPublicMarketingPath,
  pushMarketingEvent,
} from "@/app/lib/marketing/data-layer";

const SCROLL_THRESHOLDS = [25, 50, 75, 90] as const;

/**
 * Montat global în layout. La fiecare navigare publică împinge
 * `pc_public_page_view` și (re)pornește urmărirea adâncimii de scroll, trimițând
 * `pc_scroll_depth` o singură dată per prag și per pagină. Se auto-dezactivează
 * pe zonele non-publice (gating pe path), deci nu rulează pe /admin, /login etc.
 */
export function MarketingPageViewTracker() {
  const pathname = usePathname();
  const firedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!pathname || !isPublicMarketingPath(pathname)) {
      return;
    }

    pushMarketingEvent({
      event: "pc_public_page_view",
      source: "public_website",
    });

    firedThresholds.current = new Set();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;

      const percent = (window.scrollY / scrollable) * 100;

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !firedThresholds.current.has(threshold)) {
          firedThresholds.current.add(threshold);
          pushMarketingEvent({ event: "pc_scroll_depth", percent: threshold });
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
