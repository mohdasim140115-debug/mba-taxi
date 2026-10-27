"use client";

import { useEffect } from "react";
import { captureAttribution, track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * One delegated listener instead of wrapping every CTA in a Client Component.
 * - tel: links          -> click_to_call
 * - wa.me links         -> click_whatsapp
 * - [data-track="..."]  -> that event
 * `data-location` on the link (or an ancestor) says where on the page it was.
 */
export function TrackingListener() {
  useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a, button");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const location = link.closest("[data-location]")?.getAttribute("data-location") ?? "unknown";
      const label = link.getAttribute("data-label") ?? undefined;

      let event: AnalyticsEvent | null = null;
      if (href.startsWith("tel:")) event = "click_to_call";
      else if (href.includes("wa.me/")) event = "click_whatsapp";
      else if (link.hasAttribute("data-track")) event = link.getAttribute("data-track") as AnalyticsEvent;

      if (event) track(event, { location, label });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
