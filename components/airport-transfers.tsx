import Image from "next/image";
import { ArrowRight, BadgeCheck, MessageCircle, PlaneLanding, ReceiptIndianRupee } from "lucide-react";
import { airports, fleet, formatINR, showPublishedFares } from "@/lib/site-config";
import { SectionHeading } from "./section-heading";
import { QuoteButton } from "./quote-button";

const steps = [
  {
    title: "Share your flight and destination",
    body: "Use the form or WhatsApp. Include your flight details, pickup time, destination and number of passengers.",
  },
  {
    title: "Get your fixed fare",
    body: "We confirm the vehicle and the airport transfer fare before you book. Any extra hours or kilometres are explained before the trip.",
  },
  {
    title: "Arrive and ride",
    body: "Confirm the pickup point with us before you fly. Early-morning or late-night, your car is arranged in advance.",
  },
];

/**
 * As published on /taxi-services/ ("Flight Tracking – We monitor delays & arrivals",
 * "Fixed Pricing – No hidden charges", "Professional Drivers – Verified local
 * chauffeurs", "24×7 Support – WhatsApp assistance anytime").
 * TODO(confirm): flight tracking is a service promise; keep only if it is done for every booking.
 */
const promises = [
  { icon: PlaneLanding, title: "Flight tracking", body: "We monitor delays and arrivals." },
  { icon: ReceiptIndianRupee, title: "Fixed pricing", body: "No hidden charges." },
  { icon: BadgeCheck, title: "Professional drivers", body: "Verified local chauffeurs." },
  { icon: MessageCircle, title: "24×7 support", body: "WhatsApp assistance anytime." },
];

export function AirportTransfers() {
  const lowestAirportFare = Math.min(...fleet.map((v) => v.fares.airportPickup));

  return (
    <section id="airport" aria-labelledby="airport-title" className="bg-ink py-20 text-ivory sm:py-28" data-location="airport">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            id="airport-title"
            tone="dark"
            eyebrow="Goa airport taxi · 24×7 pickup & drop"
            title="Your airport transfer, arranged before you land"
            intro="Hassle-free pickups and drops at Dabolim and Mopa airports, to and from any destination in Goa — whether you land early in the morning or late at night."
          />
          {showPublishedFares && (
            <p className="text-sm text-ivory/70 lg:pb-2 lg:text-right">
              Airport pickup fares from
              <span className="display block text-4xl text-marigold">{formatINR(lowestAirportFare)}</span>
              <a href="#fleet" className="font-semibold text-ivory underline underline-offset-4">
                See fares by vehicle
              </a>
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {airports.map((a) => (
            <article key={a.id} className="group overflow-hidden rounded-card bg-ink-2 ring-1 ring-white/10">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={a.image}
                  alt={a.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold tracking-[0.14em] text-marigold backdrop-blur">
                  {a.code}
                </span>
              </div>
              <div className="flex flex-col items-start gap-5 p-6">
                <div>
                  <h3 className="display text-2xl text-white">{a.name}</h3>
                  <p className="mt-1 text-sm text-ivory/70">{a.note}</p>
                </div>
                <QuoteButton
                  prefill={{ service: "airport-transfer", pickup: a.name }}
                  label={`airport-${a.id}`}
                  className="btn btn-primary h-11 min-h-0 px-4 text-sm"
                >
                  Quote a {a.code} pickup <ArrowRight aria-hidden className="size-4" />
                </QuoteButton>
              </div>
            </article>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-white/10 py-8 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-marigold" strokeWidth={1.6} />
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-0.5 text-sm text-ivory/70">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-xs font-bold uppercase tracking-[0.16em] text-marigold">How to book your airport taxi</h3>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-card bg-white/10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-ink p-6 sm:p-7">
              <span className="display text-3xl text-marigold" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
