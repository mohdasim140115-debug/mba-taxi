import { asset } from "@/lib/base-path";
import Image from "next/image";
import { CarFront, Clock3, MapPinned, MessageCircle, Plane, ReceiptIndianRupee, Wallet } from "lucide-react";
import { site } from "@/lib/site-config";

/** Each point is backed by a statement on mbatravelsgoa.com. */
const reasons = [
  {
    icon: MapPinned,
    title: "Local drivers who know Goa",
    body: "Friendly, professional drivers who know Goa inside out — great for fitting several stops into one day.",
  },
  {
    icon: ReceiptIndianRupee,
    title: "The fare is agreed first",
    body: "Airport fares are fixed. Anything extra, like additional hours or kilometres, is explained before the trip.",
  },
  {
    icon: Plane,
    title: "Both airports, any hour",
    body: "Pickups and drops at Dabolim and Mopa, including early-morning arrivals and late-night departures.",
  },
  {
    icon: CarFront,
    title: "A car that fits your group",
    body: "Clean, air-conditioned cars from a 4-seat Dzire to a 7-seat Innova Crysta.",
  },
  {
    icon: MessageCircle,
    title: "Book the way you like",
    body: "Send the form, message us on WhatsApp or call. Pre-book before you arrive in Goa.",
  },
  {
    icon: Wallet,
    title: "Pay how you prefer",
    body: `${site.paymentMethods.slice(0, -1).join(", ")} or ${site.paymentMethods.at(-1)?.toLowerCase()}.`,
  },
];

export function WhyChoose() {
  return (
    <section id="why" aria-labelledby="why-title" className="bg-ivory py-20 sm:py-24" data-location="why">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={asset("/images/hero-mba-taxi.jpg")}
              alt="MBA Taxi Toyota Innova Crysta on a Goa coastal road at sunset"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[52%_70%]"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-sm font-semibold text-marigold">MBA Travels Goa</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight">Private taxis across North &amp; South Goa</p>
            </figcaption>
          </figure>

          <div className="absolute -right-3 top-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-lift sm:-right-6">
            <span className="grid size-11 place-items-center rounded-xl bg-marigold">
              <Clock3 aria-hidden className="size-5.5 text-ink" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold text-ink">Open 24×7</span>
              <span className="block text-xs text-muted">Early &amp; late flights</span>
            </span>
          </div>
          <div className="absolute -left-3 top-1/2 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-lift sm:-left-6">
            <span className="grid size-11 place-items-center rounded-xl bg-ink">
              <Plane aria-hidden className="size-5 text-marigold" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold text-ink">Dabolim &amp; Mopa</span>
              <span className="block text-xs text-muted">Airport pickup &amp; drop</span>
            </span>
          </div>
        </div>

        <div>
          <p className="inline-flex items-center rounded-full bg-sand px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
            Why {site.shortName}
          </p>
          <h2 id="why-title" className="display mt-5 text-[2.1rem] leading-[1.08] text-ink sm:text-5xl">
            A local Goa cab service, run with care
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="group rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-marigold hover:shadow-soft"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-sand text-ink transition-colors group-hover:bg-marigold">
                  <Icon aria-hidden className="size-5.5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
