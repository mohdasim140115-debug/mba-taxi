import { Plus } from "lucide-react";
import { fleet, formatINR, showPublishedFares, site } from "@/lib/site-config";
import { SectionHeading } from "./section-heading";

const airportFares = fleet.map((v) => `${v.shortName} ${formatINR(v.fares.airportPickup)}`).join(", ");

/** Every answer is based on information published on mbatravelsgoa.com. */
const faqs = [
  {
    q: "How do I book a taxi in Goa with MBA Travels Goa?",
    a: `Send the fare quote form on this page, message us on WhatsApp or call ${site.phone.display}. Share your travel date, pickup location, destination, number of passengers and preferred pickup time. We’ll discuss availability and the fare with you before you confirm.`,
  },
  {
    q: "Which airports do you cover for pickups and drops?",
    a: "Both of Goa’s airports: Dabolim Airport (GOI) and Manohar International Airport at Mopa (GOX). Transfers run to and from any destination in Goa.",
  },
  {
    q: "How much is a Goa airport taxi?",
    a: showPublishedFares
      ? `Our published airport pickup fares are: ${airportFares}. Share your airport and destination and we’ll confirm the fixed fare for your trip before you book. Any extra charges, such as additional hours or kilometres, are explained before the journey begins.`
      : "Share your airport and destination and we’ll confirm the fixed fare for your trip before you book. Any extra charges, such as additional hours or kilometres, are explained before the journey begins.",
  },
  {
    q: "Can I get a taxi from Goa airport to Calangute or Baga?",
    a: "Yes. Calangute, Baga, Candolim, Anjuna and Vagator are all part of our North Goa coverage. Use the form or WhatsApp with your flight details and hotel name to get a fare.",
  },
  {
    q: "Can I pre-book my taxi before arriving in Goa?",
    a: "Yes. You can pre-book through WhatsApp or this form. For airport pickups, include your flight details, and let us know as soon as possible if your flight changes.",
  },
  {
    q: "Can I hire a taxi for a full day of sightseeing?",
    a: "Yes. Full-day taxi hire covers 8 hours / 80 km with a car and driver, so you can visit beaches and attractions at your own pace. Share your planned stops when you enquire.",
  },
  {
    q: "Do you provide taxis in both North Goa and South Goa?",
    a: "Yes. We arrange airport transfers, hotel pickups, full-day hire and local travel across North Goa and South Goa.",
  },
  {
    q: "Is your taxi service available 24×7?",
    a: "Yes. Airport transfers and taxi bookings are available round the clock, including early-morning and late-night pickups.",
  },
  {
    q: "Which payment methods do you accept?",
    a: `${site.paymentMethods.slice(0, -1).join(", ")} and ${site.paymentMethods.at(-1)?.toLowerCase()}.`,
  },
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper py-20 sm:py-28" data-location="faq">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="Goa taxi booking questions"
          intro={
            <>
              Can’t see your question?{" "}
              <a href="#book" className="font-semibold text-ink underline underline-offset-4" data-track="cta_click" data-label="faq-ask">
                Send us an enquiry
              </a>{" "}
              and we’ll get back to you.
            </>
          }
        />
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-bold text-ink">
                <h3>{f.q}</h3>
                <Plus aria-hidden className="size-5 shrink-0 text-sea transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
