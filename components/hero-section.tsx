import { asset } from "@/lib/base-path";
import Image from "next/image";
import { ArrowRight, CalendarDays, CarFront, MapPin, Palmtree, Phone, Plane, Timer } from "lucide-react";
import { site, telLink, type ServiceType } from "@/lib/site-config";
import { BookingForm } from "./booking-form";
import { QuoteButton } from "./quote-button";

const tiles: { icon: typeof Plane; label: string; service: ServiceType }[] = [
  { icon: Plane, label: "Airport Transfers", service: "airport-transfer" },
  { icon: Palmtree, label: "Goa Sightseeing", service: "full-day" },
  { icon: CarFront, label: "Local & City Rides", service: "point-to-point" },
  { icon: Timer, label: "Full-Day Hire", service: "full-day" },
];

/**
 * Layout follows the owner's reference: on xl screens the photo fills the hero,
 * with text on the left, the car in the centre and the booking card on the right.
 * Below xl the parts stack (text → photo → form).
 */
export function HeroSection() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white xl:min-h-[560px] xl:aspect-[2.4/1] xl:max-h-[760px]" data-location="hero">
      <div className="mx-auto grid w-full max-w-[110rem] gap-0 px-4 md:gap-6 pb-8 pt-6 sm:px-6 xl:h-full xl:grid-cols-[minmax(0,34%)_1fr_minmax(0,29rem)] xl:items-center xl:gap-0 xl:px-[3%] xl:py-6">
        {/* On phones this wrapper is `display: contents`: the badge, heading and intro sit on top of the photo (rows 1–4), tiles and buttons follow. */}
        <div className="contents md:relative md:z-10 md:block md:animate-rise">
          <p className="col-start-1 row-start-1 inline-flex w-fit items-center gap-2.5 rounded-full bg-white/90 py-1.5 pl-1.5 pr-4 text-[0.95rem] font-semibold text-ink shadow-soft">
            <span className="grid size-8 place-items-center rounded-full bg-marigold">
              <MapPin aria-hidden className="size-4" strokeWidth={2.2} />
            </span>
            Taxi Service in Goa · Open 24×7
          </p>

          <h1 className="display col-start-1 row-start-2 mt-4 text-[2.45rem] leading-[1.02] text-ink min-[400px]:text-[2.7rem] sm:text-[3.9rem] xl:text-[clamp(2.6rem,3.5vw,4.4rem)]">
            <span className="block whitespace-nowrap">Goa Taxi Service</span>
            <span className="relative mt-1 block w-fit text-marigold">
              Your Way
              <svg aria-hidden viewBox="0 0 300 18" className="absolute -bottom-3 left-0 h-3 w-[85%] text-marigold" preserveAspectRatio="none">
                <path d="M3 13C70 4 170 2 297 7" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="col-start-1 row-start-3 mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink/75 sm:text-lg">
            Safe, comfortable and affordable <strong className="font-semibold text-ink">taxi service in Goa</strong>:{" "}
            <strong className="font-semibold text-ink">Goa airport taxi</strong> pickups and drops at Dabolim &amp; Mopa,{" "}
            <strong className="font-semibold text-ink">local cab</strong> rides, sightseeing and full-day{" "}
            <strong className="font-semibold text-ink">taxi rental</strong> across North &amp; South Goa.
          </p>

          {/* Phones: leaves the car visible below the text. */}
          <div aria-hidden className="col-start-1 row-start-4 h-40 md:hidden" />

          {/* Phones: dark panel behind the service tiles and buttons, continuing from the photo. */}
          <div aria-hidden className="-z-10 col-start-1 row-span-2 row-start-5 -mx-4 -mb-8 bg-ink sm:-mx-6 md:hidden" />

          <ul className="relative z-10 col-start-1 row-start-5 -mt-12 grid md:mt-5 max-w-xl grid-cols-4 gap-2.5">
            {tiles.map(({ icon: Icon, label, service }) => (
              <li key={label}>
                <QuoteButton
                  prefill={{ service }}
                  label={`hero-tile-${label}`}
                  className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white/95 px-1.5 py-3 text-center text-[0.78rem] font-semibold leading-tight text-ink shadow-soft transition-transform hover:-translate-y-0.5 sm:text-sm"
                >
                  <Icon aria-hidden className="size-7 text-ink" strokeWidth={1.8} />
                  {label}
                </QuoteButton>
              </li>
            ))}
          </ul>

          <div className="col-start-1 row-start-6 mt-4 flex md:mt-5 flex-nowrap gap-2 sm:gap-3">
            <a href="#book" className="btn btn-primary h-14 min-w-0 flex-1 px-3 text-[0.9rem] sm:flex-none sm:px-5 sm:text-base" data-track="cta_click" data-label="hero-book">
              <CarFront aria-hidden className="hidden size-5 shrink-0 min-[400px]:block" /> Book Your Taxi Now <ArrowRight aria-hidden className="hidden size-5 shrink-0 sm:block" />
            </a>
            <a href={telLink} className="btn h-14 shrink-0 gap-2 border border-line bg-white px-3 text-left text-ink shadow-soft hover:border-ink/30 sm:px-5" data-label="hero-call">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Phone aria-hidden className="size-4" fill="currentColor" strokeWidth={0} />
              </span>
              <span className="leading-tight">
                <span className="block">Call Now</span>
                <span className="block text-xs font-medium text-muted">{site.phone.display}</span>
              </span>
            </a>
          </div>
        </div>

        {/* One image element: background behind the text on phones, a banner on tablets, the full-bleed background on xl. */}
        <figure className="relative -z-10 col-start-1 row-span-4 row-start-1 -mx-4 -mt-6 overflow-hidden sm:-mx-6 md:z-auto md:col-auto md:row-auto md:mx-0 md:mt-0 md:aspect-[2/1] md:rounded-3xl xl:absolute xl:inset-0 xl:-z-10 xl:m-0 xl:aspect-auto xl:rounded-none">
          <Image
            src={asset("/images/hero-mba-taxi.jpg")}
            alt="White MBA Taxi Toyota Innova on a coastal road in Goa at sunset, with palm trees and a hilltop church"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[50%_78%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.92)_52%,rgb(255_255_255/0.6)_64%,rgb(255_255_255/0)_76%)] md:hidden"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-ink md:hidden" />
          <div
            aria-hidden
            className="absolute inset-0 hidden xl:block xl:bg-[linear-gradient(90deg,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.9)_22%,rgb(255_255_255/0.55)_32%,rgb(255_255_255/0)_41%)]"
          />
        </figure>

        {/* On phones the form opens as a bottom sheet instead (see BookingSheet). */}
        <div id="book" className="relative z-10 hidden scroll-mt-24 rounded-3xl md:block border border-line bg-white p-5 shadow-lift sm:p-6 xl:col-start-3">
          <div className="mb-4 flex items-center gap-3.5">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-sand text-ink">
              <CalendarDays aria-hidden className="size-6" strokeWidth={2} />
            </span>
            <div>
              <h2 className="display text-[1.7rem] leading-tight">Book Your Ride</h2>
              <p className="text-sm text-muted">Leave your details — we’ll call you with the fare</p>
            </div>
          </div>
          <BookingForm location="hero-form" listenForPrefill />
        </div>
      </div>
    </section>
  );
}
