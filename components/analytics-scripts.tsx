import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics";

/**
 * Loads Consent Mode defaults, then either GTM (preferred) or gtag.js (fallback).
 * Renders nothing when no IDs are configured.
 */
export function AnalyticsScripts() {
  const { gtmId, ga4Id, adsId, consentDefault } = analyticsConfig;
  const useGtag = !gtmId && Boolean(ga4Id || adsId);
  if (!gtmId && !useGtag) return null;

  const consent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'${consentDefault}',ad_user_data:'${consentDefault}',ad_personalization:'${consentDefault}',analytics_storage:'${consentDefault}',wait_for_update:500});
try{var c=localStorage.getItem('mba_consent');if(c==='granted'||c==='denied'){gtag('consent','update',{ad_storage:c,ad_user_data:c,ad_personalization:c,analytics_storage:c});}}catch(e){}`;

  return (
    <>
      {/* Plain inline script: runs during HTML parsing, before GTM/gtag load. */}
      <script id="consent-default" dangerouslySetInnerHTML={{ __html: consent }} />
      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id || adsId}`} strategy="afterInteractive" />
          <Script id="gtag-config" strategy="afterInteractive">
            {`gtag('js',new Date());${ga4Id ? `gtag('config','${ga4Id}');` : ""}${adsId ? `gtag('config','${adsId}');` : ""}`}
          </Script>
        </>
      )}
    </>
  );
}

export function GtmNoScript() {
  const { gtmId } = analyticsConfig;
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
