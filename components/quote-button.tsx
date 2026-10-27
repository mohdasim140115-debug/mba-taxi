"use client";

import type { ReactNode } from "react";
import { PREFILL_EVENT, type PrefillDetail } from "./booking-form";
import { track } from "@/lib/analytics";
import { openBooking } from "@/lib/booking-ui";

/**
 * Pre-fills the enquiry form and opens it (bottom sheet on phones, hero card
 * elsewhere). Works as a plain #book anchor before hydration / without JavaScript.
 */
export function QuoteButton({
  prefill,
  label,
  className,
  children,
}: {
  prefill: PrefillDetail;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#book"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: prefill }));
        openBooking();
        const location = e.currentTarget.closest("[data-location]")?.getAttribute("data-location") ?? "unknown";
        track("request_quote", { location, label, service_type: prefill.service });
      }}
    >
      {children}
    </a>
  );
}
