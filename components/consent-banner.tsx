"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { analyticsConfig, updateConsent } from "@/lib/analytics";

const STORAGE_KEY = "mba_consent";
const noopSubscribe = () => () => {};
const readStoredChoice = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "none";
  } catch {
    return "none";
  }
};

const trackingConfigured = Boolean(analyticsConfig.gtmId || analyticsConfig.ga4Id || analyticsConfig.adsId);

/** Shown only when NEXT_PUBLIC_CONSENT_DEFAULT=denied and the visitor hasn't chosen yet. */
export function ConsentBanner() {
  // "server" during SSR, so the banner never renders into the static HTML.
  const stored = useSyncExternalStore(noopSubscribe, readStoredChoice, () => "server");
  const [dismissed, setDismissed] = useState(false);

  const open = analyticsConfig.consentDefault === "denied" && trackingConfigured && stored === "none" && !dismissed;
  if (!open) return null;

  const choose = (state: "granted" | "denied") => {
    try {
      localStorage.setItem(STORAGE_KEY, state);
    } catch {
      // Choice still applies for this page view.
    }
    updateConsent(state);
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 text-sm shadow-lift lg:bottom-6"
    >
      <p className="text-ink">
        We use cookies to measure how visitors find us through Google. You can accept or decline analytics and advertising
        cookies.{" "}
        <Link href="/privacy" className="font-semibold underline underline-offset-2">
          Privacy notice
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="btn btn-primary h-10 min-h-0 px-4 text-sm">
          Accept
        </button>
        <button type="button" onClick={() => choose("denied")} className="btn btn-ghost h-10 min-h-0 px-4 text-sm">
          Decline
        </button>
      </div>
    </div>
  );
}
