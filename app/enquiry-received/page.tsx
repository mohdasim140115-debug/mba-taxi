import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { site, telLink, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Enquiry received – MBA Travels Goa",
  robots: { index: false, follow: false },
};

/** Reached only by the no-JavaScript form fallback after a confirmed delivery. */
export default function EnquiryReceived() {
  return (
    <SimplePage title="Thank you. We’ve received your enquiry.">
      <p>Our team will contact you to confirm availability and your fare.</p>
      <p>
        For a faster reply, message us on <a href={whatsappLink()}>WhatsApp</a> or call <a href={telLink}>{site.phone.display}</a>.
      </p>
      <p>
        <Link href="/">Back to taxi services</Link>
      </p>
    </SimplePage>
  );
}
