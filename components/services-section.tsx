import { ArrowRight, Clock3, MessageCircle, Phone, Plane, Route, Timer } from "lucide-react";
import { site, telLink, whatsappLink, type ServiceType } from "@/lib/site-config";
import { QuoteButton } from "./quote-button";

const services: { icon: typeof Plane; tag: string; title: string; body: string; points: string[]; service: ServiceType; cta: string }[] = [
  {
    icon: Plane,
    tag: "Dabolim & Mopa",
    title: "Airport pickup & drop",
    body: "Goa airport taxi to or from any hotel, villa or address in Goa.",
    points: ["Share your flight details", "Fare fixed before you travel"],
    service: "airport-transfer",
    cta: "Quote airport taxi",
  },
  {
    icon: Route,
    tag: "Point to point",
    title: "Local & hotel transfers",
    body: "Hotel to beach, market or restaurant — or right across Goa, North to South.",
    points: ["Private car, no sharing", "North & South Goa"],
    service: "point-to-point",
    cta: "Quote a local ride",
  },
  {
    icon: Timer,
    tag: "8 hrs / 80 km",
    title: "Full-day taxi hire",
    body: "A car and driver for the day — ideal for sightseeing at your own pace.",
    points: ["Stay as long as you like", "Dzire to Innova Crysta"],
    service: "full-day",
    cta: "Quote a full day",
  },
  {
    icon: Clock3,
    tag: "24×7",
    title: "Early & late-night rides",
    body: "Early flights, late arrivals and night-time returns to your hotel are covered.",
    points: ["Book any time of day", "WhatsApp support"],
    service: "point-to-point",
    cta: "Quote a ride",
  },
];

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-white py-20 sm:py-24" data-location="services">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-sand px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
            Taxi &amp; cab services in Goa
          </p>
          <h2 id="services-title" className="display mt-5 text-[2.1rem] leading-[1.08] text-ink sm:text-5xl">
            One local cab service for your whole trip
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Book a private taxi in Goa for a single transfer or the whole holiday. Every booking is a private car with a driver.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, tag, title, body, points, service, cta }) => (
            <li
              key={title}
              className="group relative flex flex-col rounded-3xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-marigold hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-marigold text-ink transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden className="size-7" strokeWidth={1.9} />
                </span>
                <span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-ink">{tag}</span>
              </div>

              <h3 className="mt-6 text-xl font-extrabold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{body}</p>

              <ul className="mb-6 mt-5 space-y-2 border-t border-line pt-5 text-sm font-semibold text-ink">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-marigold" />
                    {p}
                  </li>
                ))}
              </ul>

              <QuoteButton
                prefill={{ service }}
                label={`service-${title}`}
                className="btn mt-auto h-12 min-h-0 w-full border border-ink/15 bg-ivory text-sm text-ink transition-colors group-hover:border-marigold group-hover:bg-marigold"
              >
                {cta} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </QuoteButton>
            </li>
          ))}
        </ul>

        <div
          className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-ink p-6 text-white sm:p-8 lg:flex-row lg:items-center"
          data-location="services-help"
        >
          <div>
            <p className="text-xl font-extrabold tracking-tight sm:text-2xl">Not sure which service you need?</p>
            <p className="mt-1 text-white/70">Tell us your plan — we’ll suggest the right car and confirm the fare.</p>
          </div>
          <div className="flex w-full flex-wrap gap-3 lg:w-auto">
            <a href={telLink} className="btn btn-primary h-12 min-h-0 flex-1 px-5 lg:flex-none" data-label="services-call">
              <Phone aria-hidden className="size-4" fill="currentColor" strokeWidth={0} /> {site.phone.display}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener"
              className="btn btn-whatsapp h-12 min-h-0 flex-1 px-5 lg:flex-none"
              data-label="services-whatsapp"
            >
              <MessageCircle aria-hidden className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
