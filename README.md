# MBA Travels Goa — Taxi Services landing page

Next.js rebuild of **https://mbatravelsgoa.com/taxi-services/** only, designed as a Google Search Ads landing page.
Every business fact on the page lives in [`lib/site-config.ts`](lib/site-config.ts); items still to be confirmed are marked `TODO(confirm)`.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000/taxi-services/
npm run build && npm start   # production
npm run lint                 # ESLint;  npx tsc --noEmit for types
```

The app uses `basePath: "/taxi-services"` and `trailingSlash: true`, so **everything (page, images, API) is served under `/taxi-services/`**. Nothing outside that path is touched.

## Deployment (important)

The live site is **WordPress** (Astra + Rank Math). This app replaces only the `/taxi-services/` URL. Options:

1. **Reverse proxy (recommended):** deploy this app (e.g. Vercel, Node host), then route `https://mbatravelsgoa.com/taxi-services/*` to it at the web server / CDN (Cloudflare Worker or rule, Nginx `location /taxi-services/ { proxy_pass … }`). The rest of the WordPress site keeps working unchanged. Unpublish or redirect the old WordPress page so it doesn't conflict.
2. **Subdomain:** host at e.g. `https://book.mbatravelsgoa.com/taxi-services/` and set `NEXT_PUBLIC_SITE_URL=https://book.mbatravelsgoa.com` so the canonical and OG URLs match.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origin only (default `https://mbatravelsgoa.com`). Canonical = origin + `/taxi-services/`. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` adds `noindex` (staging / ads-only hosts). |
| `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET` | Where enquiries are POSTed as JSON (server-only). |
| `RESEND_API_KEY`, `ENQUIRY_EMAIL_TO`, `ENQUIRY_EMAIL_FROM` | Optional e-mail notifications via Resend. |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container (preferred). |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_GADS_*_LABEL` | gtag.js fallback **only if GTM is not used**. |
| `NEXT_PUBLIC_CONSENT_DEFAULT` | `granted` (default) or `denied` (shows a consent banner, Consent Mode v2). |

## Enquiry form backend — must be connected before launch

`POST /taxi-services/api/enquiry/` validates the enquiry, applies spam checks (honeypot, minimum fill time, per-IP rate limit, same-origin check) and delivers it to **at least one** configured channel. It returns success **only when a channel accepted the enquiry**; otherwise the visitor sees an error with a pre-filled WhatsApp hand-off. With nothing configured it returns `503` — no fake successes.

Quickest setup — Google Sheet via Apps Script:
1. Create a Sheet → Extensions → Apps Script, paste:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSheet().appendRow([d.receivedAt, d.leadId, d.name, d.phone, d.serviceLabel, d.pickup, d.drop, d.date, d.time, d.passengers, d.attribution.gclid || "", d.attribution.utm_campaign || ""]);
     MailApp.sendEmail("mbatravels12@gmail.com", "New taxi enquiry " + d.leadId, JSON.stringify(d, null, 2));
     return ContentService.createTextOutput("ok");
   }
   ```
2. Deploy → Web app → access "Anyone" → copy the URL into `ENQUIRY_WEBHOOK_URL`.

Each lead carries `gclid` / `gbraid` / `wbraid` / UTM values, so you can later import **offline conversions** (confirmed bookings) into Google Ads.

Pages without JavaScript fall back to a normal form POST → `/taxi-services/enquiry-received/` or `/enquiry-not-sent/`.

## Tracking (GTM / GA4 / Google Ads)

No IDs are hard-coded. With `NEXT_PUBLIC_GTM_ID` set, the page pushes these `dataLayer` events (and loads nothing else):

| Event | When | Use as |
| --- | --- | --- |
| `generate_lead` | Server confirmed the enquiry (`lead_id`, `service_type`, `location`) | **Primary** Ads conversion |
| `click_to_call` | Tap on any `tel:` link (`location`, `label`) | Secondary conversion (intent, not a booking) |
| `click_whatsapp` | Tap on any WhatsApp link | Secondary conversion (intent, not a booking) |
| `begin_enquiry` | First focus in a form | GA4 funnel only |
| `request_quote` | "Request fare" on a route/service/airport | GA4 only |
| `cta_click` | Other booking CTAs | GA4 only |

GTM setup:
1. Tags → **Google tag** (GA4 measurement ID) on All Pages; **Conversion Linker** on All Pages.
2. Triggers → Custom Event `generate_lead`, `click_to_call`, `click_whatsapp`. Data Layer Variables `lead_id`, `service_type`, `location`.
3. Tags → **Google Ads Conversion Tracking** "Enquiry" on `generate_lead`, with **Transaction ID = {{DLV lead_id}}** (de-duplication). Optional separate secondary conversions for call/WhatsApp clicks — set them to *Secondary* in Google Ads so bidding optimises for real enquiries.
4. GA4 event tags for the same events; mark `generate_lead` as a key event.
5. For phone calls from ads, use **call assets with Google forwarding numbers** — click events can't confirm a call happened.

## Keyword strategy (from `Keyword Stats 2026-10-26 at 21_51_59.csv`, 999 keywords)

| Cluster | Keywords / monthly volume* | Where it's answered | Ads notes |
| --- | --- | --- | --- |
| Core Goa taxi / cab | 98 kw / ~145k (taxi service goa, cab service goa, taxi goa, taxi in goa) | Title, H1, intro, services | Main ad group; this page's primary intent |
| Airport (Dabolim/Mopa) | 291 kw / ~44k (goa airport taxi service, cabs in goa airport) | Airport section, airport fares, FAQ | Highest bids (up to ₹90 top-of-page); separate ad group pointing to `#airport` |
| Full-day / hire / rental | 61 kw / ~12k (goa taxi rental, rent a cab goa, hire taxi in goa) | Full-day hire service, fleet fares | Own ad group |
| Local areas (Calangute, Baga, Candolim…) | 108 kw / ~14k | Popular routes, coverage | Use route-level ad copy; same page |
| North / South Goa | 18 kw / ~3.6k | Coverage section, FAQ | Fits core ad group |
| Fares / rates research | 120 kw / ~12.5k | Published fares + "fare confirmed before you travel" | Lower intent; bid down |
| Margao / Madgaon | 119 kw / ~38k | **Not targeted yet** | Coverage not stated on the live site — confirm first (`margaoCoverage` in config) |
| Competitors / apps (Ola, Uber, GoaMiles, Pilot…) | 86 kw / ~26k | — | Add as negatives |
| Bike taxi, self-drive, outstation/intercity | ~98 kw / ~19k | — | Not offered on this page → negatives |

*Keyword Planner volume ranges (50 / 500 / 5,000 / 50,000) summed; indicative only, not a conversion forecast.

**Future landing-page opportunities (not built):** Goa airport taxi (Dabolim & Mopa) page; Margao/Madgaon taxi page once coverage is confirmed; a full-day taxi hire page.

## Verified from the live site (26 Oct 2026)

Brand and logo; phone/WhatsApp **+91 93220 73068** (site schema, contact page "verified business WhatsApp", 36 call links); e-mail mbatravels12@gmail.com; address Mollembhat, Saligao, Goa 403511; open 24×7; Facebook page; Dabolim & Mopa airport pickup/drop; fleet Dzire (4), Ertiga (6), Innova (7), Innova Crysta (7) with published airport-pickup, 8 hrs/80 km, per-hour and per-km fares and features; payment by cash, UPI, Google Pay, PhonePe, bank transfer; North/South Goa coverage and places named on the site.

## Still to confirm before launch

- **Phone number.** The live taxi page sends its fleet WhatsApp buttons to the placeholder `+91 90000 00000` and airport buttons to `+91 90020 70068`; the About page uses `+91 93220 72068`. This page uses `+91 93220 73068` everywhere.
- Whether "₹/hour" and "₹/km" are charges beyond the 8 hrs / 80 km package.
- "Flight tracking" and Innova "airport meet & greet" (published on the live page) are done for every booking.
- Margao/Madgaon pickups (high-volume keywords).
- Real customer reviews (the six on the home page can't be verified, so the reviews section is hidden: `testimonials.enabled`).
- A real photo of an MBA vehicle (the Ertiga image from the live site appears to be generated).
- Owner review of the privacy notice (`/taxi-services/privacy/`).

## Image credits

Hero: MBA Taxi image supplied by the owner. Airports, beaches: Wikimedia Commons (CC BY-SA / FAL) — authors and licences are listed in `imageCredits` and shown in the page footer. Logo and Ertiga image: mbatravelsgoa.com.
