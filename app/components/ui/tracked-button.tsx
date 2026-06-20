"use client";

import type { ComponentProps } from "react";
import {
  pushMarketingEvent,
  type PacaMarketingEventName,
} from "@/app/lib/marketing/data-layer";

type TrackedButtonProps = Omit<ComponentProps<"button">, "onClick"> & {
  trackingEvent: PacaMarketingEventName;
  trackingPlacement: string;
  trackingSource: string;
  trackingPageArea?: string;
  trackingLinkId?: string;
  trackingDisabled?: boolean;
  onClick?: ComponentProps<"button">["onClick"];
};

/**
 * Buton nativ (`<button>`) care împinge un eveniment în dataLayer la click.
 * PACA nu folosește shadcn — wrapper-ul stă peste `<button>` direct, deci
 * `className`/`type`/restul prop-urilor curg ca de obicei.
 */
export function TrackedButton({
  trackingEvent,
  trackingPlacement,
  trackingSource,
  trackingPageArea,
  trackingLinkId,
  trackingDisabled = false,
  onClick,
  type = "button",
  ...props
}: TrackedButtonProps) {
  return (
    <button
      {...props}
      type={type}
      onClick={(event) => {
        if (!trackingDisabled) {
          pushMarketingEvent({
            event: trackingEvent,
            placement: trackingPlacement,
            source: trackingSource,
            page_area: trackingPageArea,
            link_id: trackingLinkId,
          });
        }

        onClick?.(event);
      }}
    />
  );
}
