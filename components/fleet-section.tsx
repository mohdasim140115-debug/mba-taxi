import Image from "next/image";
import { ArrowRight, MessageCircle, UsersRound } from "lucide-react";
import { fleet, formatINR, showPublishedFares, whatsappLink } from "@/lib/site-config";
import { QuoteButton } from "./quote-button";

/** Compact fleet strip shown right below the hero (owner's request). */
export function FleetSection() {
  return (
    <section id="fleet" aria-labelledby="fleet-title" className="bg-ivory py-12 sm:py-14" data-location="fleet">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sea">Our fleet &amp; fares</p>
            <h2 id="fleet-title" className="display mt-1.5 text-[1.7rem] leading-tight text-ink sm:text-[2.1rem]">
              Choose your taxi
            </h2>
          </div>
          <p className="text-sm text-muted">
            AC cars for 4 to 7 passengers · fares as published
            <span className="block text-xs font-semibold text-ink sm:hidden">Swipe to see all cars →</span>
          </p>
        </div>

        <ul className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-1 sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
          {fleet.map((v) => (
            <li
              key={v.id}
              className="group relative flex w-[84%] shrink-0 snap-center flex-col rounded-[1.4rem] bg-white p-2.5 shadow-soft sm:w-auto ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-2 hover:ring-marigold sm:p-2.5"
            >
              {/* Showroom panel: a warm spotlight behind the car and a soft shadow under it. */}
              <figure className="relative h-40 overflow-hidden rounded-[1.1rem] bg-[radial-gradient(120%_85%_at_50%_100%,#fff3c4_0%,#ffffff_58%,#f4f3ee_100%)] sm:h-44">
                <span aria-hidden className="absolute bottom-3 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md sm:bottom-4" />
                <Image
                  src={v.image.src}
                  alt={v.image.alt}
                  fill
                  sizes="(min-width: 1280px) 20vw, 46vw"
                  className="object-contain px-2 pb-1.5 pt-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-marigold px-2 py-0.5 text-[0.68rem] font-bold text-ink shadow-soft">
                  <UsersRound aria-hidden className="size-3" /> {v.seats} seats
                </span>
                <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[0.68rem] font-bold text-ink ring-1 ring-line">
                  {v.type}
                </span>
              </figure>

              <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-4 sm:px-3 sm:pb-3 sm:pt-5">
                <h3 className="truncate text-xl font-extrabold tracking-tight text-ink">{v.shortName}</h3>

                {showPublishedFares ? (
                  <>
                    <dl className="mt-3 grid grid-cols-2 border-t border-dashed border-ink/15 pt-3 sm:mt-4 sm:pt-4">
                      <div>
                        <dt className="text-[0.62rem] font-bold uppercase tracking-wider text-muted">Airport</dt>
                        <dd className="text-[1.35rem] font-extrabold tracking-tight text-ink">{formatINR(v.fares.airportPickup)}</dd>
                      </div>
                      <div className="border-l border-ink/10 pl-3.5">
                        <dt className="whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-wider text-muted">
                          8 hrs / 80 km
                        </dt>
                        <dd className="text-[1.35rem] font-extrabold tracking-tight text-ink">{formatINR(v.fares.fullDay)}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-[0.7rem] font-semibold text-muted sm:text-xs">
                      {formatINR(v.fares.perHour)}/hr · {formatINR(v.fares.perKm)}/km
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted">Ask us for the fare</p>
                )}

                <div className="mt-auto flex gap-1.5 pt-4 sm:pt-5">
                  <QuoteButton
                    prefill={{ vehicle: v.id }}
                    label={`fleet-book-${v.id}`}
                    className="btn btn-primary h-11 min-h-0 flex-1 gap-1 px-2 text-sm sm:h-12 sm:text-base"
                  >
                    Book <span className="sr-only">the {v.name}</span> <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </QuoteButton>
                  <a
                    href={whatsappLink(`Hi MBA Travels Goa, I'd like a fare quote for the ${v.name}.`)}
                    target="_blank"
                    rel="noopener"
                    aria-label={`WhatsApp about the ${v.name}`}
                    className="btn btn-whatsapp h-11 min-h-0 w-11 shrink-0 px-0 sm:h-12 sm:w-12"
                    data-label={`fleet-${v.id}`}
                  >
                    <MessageCircle aria-hidden className="size-4.5" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-xs text-muted">
          Car photos are representative. Your final fare is confirmed for your exact route before you book.
        </p>
      </div>
    </section>
  );
}
