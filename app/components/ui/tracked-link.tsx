"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import {
  pushMarketingEvent,
  type PacaMarketingEventName,
} from "@/app/lib/marketing/data-layer";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  trackingEvent?: PacaMarketingEventName;
  trackingPlacement: string;
  trackingSource: string;
  trackingPageArea?: string;
  trackingLinkId: string;
};

/**
 * Wrapper peste `next/link` care împinge un eveniment în dataLayer la click,
 * apoi delegă către `onClick`-ul original — fără a rupe navigarea.
 */
export function TrackedLink({
  trackingEvent = "pc_nav_click",
  trackingPlacement,
  trackingSource,
  trackingPageArea,
  trackingLinkId,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        pushMarketingEvent({
          event: trackingEvent,
          placement: trackingPlacement,
          source: trackingSource,
          page_area: trackingPageArea,
          link_id: trackingLinkId,
        });

        onClick?.(event);
      }}
    />
  );
}

type TrackedAnchorProps = ComponentProps<"a"> & {
  trackingEvent: PacaMarketingEventName;
  trackingPlacement: string;
  trackingSource: string;
  trackingPageArea?: string;
  trackingLinkId?: string;
};

/**
 * Wrapper peste `<a>` nativ pentru linkuri de protocol (tel:, mailto:, wa.me)
 * — pe care `next/link` nu le acoperă. Folosibil și în Server Components
 * (ex: footer), unde un `onClick` direct nu e posibil.
 */
export function TrackedAnchor({
  trackingEvent,
  trackingPlacement,
  trackingSource,
  trackingPageArea,
  trackingLinkId,
  onClick,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        pushMarketingEvent({
          event: trackingEvent,
          placement: trackingPlacement,
          source: trackingSource,
          page_area: trackingPageArea,
          link_id: trackingLinkId,
        });

        onClick?.(event);
      }}
    />
  );
}
