import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { imageCredits, site } from "@/lib/site-config";
import { basePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Privacy notice – MBA Travels Goa",
  description: "How MBA Travels Goa uses the details you share when you request a taxi fare quote.",
  alternates: { canonical: `${basePath}/privacy/` },
};

// TODO(confirm): have the business owner review this notice before launch.
export default function Privacy() {
  return (
    <SimplePage title="Privacy notice">
      <p>
        This notice explains how {site.name} (&ldquo;we&rdquo;) uses the information you share on this page.
      </p>

      <h2>What we collect</h2>
      <p>
        When you request a fare quote we receive your name, e-mail, phone or WhatsApp number, number of passengers and, if you chose a route or service on the page, that trip
        detail. We also record which advert or link brought you here (for
        example a Google Ads click ID or UTM tags) and your browser type.
      </p>

      <h2>How we use it</h2>
      <p>
        Only to respond to your enquiry, arrange your journey, and understand which of our adverts work. We do not sell your
        details.
      </p>

      <h2>Cookies and measurement</h2>
      <p>
        This page may use Google Tag Manager, Google Analytics and Google Ads conversion tracking to measure enquiries, calls and
        WhatsApp clicks. These tools may set cookies. Where a cookie banner is shown, they only run with your consent.
      </p>

      <h2>Your choices</h2>
      <p>
        To access, correct or delete the details you sent us, e-mail <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        {site.phone.display}.
      </p>

      {/* Required attribution for the Creative Commons photos used on the taxi page. */}
      <h2 id="photo-credits">Photo credits</h2>
      <ul className="list-disc space-y-1 pl-5 text-base">
        {imageCredits.map((c) => (
          <li key={c.what}>
            {c.what}: {c.author},{" "}
            <a href={c.url} target="_blank" rel="noopener">
              {c.license}
            </a>
          </li>
        ))}
        <li>Car photos are representative images of each model.</li>
      </ul>

      <p>
        <Link href="/">Back to taxi services</Link>
      </p>
    </SimplePage>
  );
}
