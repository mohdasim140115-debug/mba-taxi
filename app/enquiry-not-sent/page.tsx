import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { site, telLink, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Enquiry not sent – MBA Travels Goa",
  robots: { index: false, follow: false },
};

/** Reached only by the no-JavaScript form fallback when the enquiry was not delivered. */
export default function EnquiryNotSent() {
  return (
    <SimplePage title="Sorry, your enquiry wasn’t sent">
      <p>Please check that you filled in your name and a valid phone number, then try again.</p>
      <p>
        You can also reach us straight away on <a href={whatsappLink()}>WhatsApp</a> or by calling{" "}
        <a href={telLink}>{site.phone.display}</a>.
      </p>
      <p>
        <Link href="/#book">Back to the booking form</Link>
      </p>
    </SimplePage>
  );
}
