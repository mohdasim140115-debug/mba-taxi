import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-config";
import { asset, basePath } from "@/lib/base-path";
import { AnalyticsScripts, GtmNoScript } from "@/components/analytics-scripts";
import { TrackingListener } from "@/components/tracking-listener";
import { ConsentBanner } from "@/components/consent-banner";

// One variable font for headings and body keeps the download small on mobile.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const title = "Goa Taxi Service | Airport Transfers & Cab Booking – MBA Travels Goa";
const description =
  "Book a private Goa taxi with MBA Travels Goa: Dabolim and Mopa airport pickups and drops, local rides across North and South Goa, and full-day cab hire. Dzire to Innova Crysta. Get a fare quote on WhatsApp.";

const ogImage = asset("/images/og-goa-taxi.jpg");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  // Production URL of the page this app replaces.
  alternates: { canonical: `${basePath}/` },
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${basePath}/`,
    siteName: site.name,
    title,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "MBA Taxi Innova on a Goa coastal road at sunset – MBA Travels Goa taxi service" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  robots:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "false"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.mainSiteUrl}/#organization`,
  name: site.name,
  url: site.mainSiteUrl,
  logo: `${site.url}${site.logo.src}`,
  image: `${site.url}${ogImage}`,
  telephone: site.phone.e164,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  areaServed: { "@type": "State", name: "Goa" },
  paymentAccepted: site.paymentMethods.join(", "),
  sameAs: [site.social.facebook],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh">
        <AnalyticsScripts />
        <GtmNoScript />
        {children}
        <TrackingListener />
        <ConsentBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
