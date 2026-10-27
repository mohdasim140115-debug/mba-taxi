/**
 * Tracking architecture
 * ---------------------
 * Preferred: Google Tag Manager (NEXT_PUBLIC_GTM_ID). Every event below is pushed
 * to `window.dataLayer`; GA4 and Google Ads tags are configured inside GTM.
 *
 * Fallback (no GTM): if NEXT_PUBLIC_GA4_ID and/or NEXT_PUBLIC_GADS_ID are set,
 * gtag.js is loaded directly and events are sent with gtag(). Only one path is
 * ever active, so conversions are not double counted.
 *
 * Event semantics
 *  - generate_lead   : enquiry stored by /api/enquiry (server confirmed). The only
 *                      event that should be a *primary* Ads conversion.
 *  - click_to_call   : tap on a tel: link (intent, not a confirmed booking).
 *  - click_whatsapp  : tap on a wa.me link (intent, not a confirmed booking).
 *  - begin_enquiry   : first interaction with an enquiry form.
 *  - request_quote   : "Request fare" on a route / service / airport (pre-fills form).
 *  - cta_click       : other booking CTAs (e.g. "Get a fare quote" scroll links).
 */

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  adsId: process.env.NEXT_PUBLIC_GADS_ID ?? "",
  /** Only used in the gtag fallback; in GTM, configure conversions there. */
  adsLeadLabel: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL ?? "",
  adsCallLabel: process.env.NEXT_PUBLIC_GADS_CALL_LABEL ?? "",
  adsWhatsappLabel: process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL ?? "",
  /** "granted" (default) or "denied". "denied" also shows the consent banner. */
  consentDefault: process.env.NEXT_PUBLIC_CONSENT_DEFAULT === "denied" ? "denied" : "granted",
} as const;

export type AnalyticsEvent =
  | "generate_lead"
  | "click_to_call"
  | "click_whatsapp"
  | "begin_enquiry"
  | "request_quote"
  | "cta_click";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const { gtmId, adsId, adsLeadLabel, adsCallLabel, adsWhatsappLabel } = analyticsConfig;

  if (gtmId) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...params });
    return;
  }

  if (!window.gtag) return;
  window.gtag("event", event, params);

  if (!adsId) return;
  const label =
    event === "generate_lead" ? adsLeadLabel : event === "click_to_call" ? adsCallLabel : event === "click_whatsapp" ? adsWhatsappLabel : "";
  if (label) {
    window.gtag("event", "conversion", {
      send_to: `${adsId}/${label}`,
      // Google Ads de-duplicates conversions that share a transaction_id.
      ...(params.lead_id ? { transaction_id: params.lead_id } : {}),
    });
  }
}

export function updateConsent(state: "granted" | "denied") {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

/* -------------------------------------------------------------------------- */
/* Click attribution (gclid / UTM) — stored for this browser session only.    */
/* -------------------------------------------------------------------------- */

const ATTRIBUTION_KEY = "mba_attribution";
const ATTRIBUTION_PARAMS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const found: Record<string, string> = {};
    for (const key of ATTRIBUTION_PARAMS) {
      const v = url.searchParams.get(key);
      if (v) found[key] = v.slice(0, 200);
    }
    if (Object.keys(found).length === 0 && sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    found.landing_page = (url.pathname + url.search).slice(0, 300);
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
  } catch {
    // Storage can be unavailable (private mode); attribution is best-effort.
  }
}

export function readAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}");
  } catch {
    return {};
  }
}
