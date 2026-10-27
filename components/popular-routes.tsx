import Image from "next/image";
import { ArrowRight, MoveRight } from "lucide-react";
import { popularRoutes } from "@/lib/site-config";
import { QuoteButton } from "./quote-button";

export function PopularRoutes() {
  return (
    <section id="routes" aria-labelledby="routes-title" className="bg-white py-20 sm:py-24" data-location="routes">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full bg-sand px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
            Popular routes
          </p>
          <h2 id="routes-title" className="display mt-5 text-[2.1rem] leading-[1.08] text-ink sm:text-5xl">
            Goa airport to Calangute, Baga &amp; beyond
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Pick a route and we’ll reply with the fare for your exact pickup and drop, by vehicle.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((r) => (
            <li key={`${r.from}-${r.to}`}>
              <QuoteButton
                prefill={{ service: r.service, pickup: r.from === "Your hotel" ? "" : r.from, drop: r.to }}
                label={`route-${r.to}`}
                className="group block h-full overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-marigold hover:shadow-lift"
              >
                <span className="relative block aspect-[16/9] overflow-hidden bg-ivory">
                  <Image
                    src={r.image}
                    alt={r.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/15 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
                      {r.from} <MoveRight aria-hidden className="size-4 text-marigold" />
                      <span className="sr-only">to</span>
                    </span>
                    <span className="mt-0.5 block text-2xl font-extrabold tracking-tight">{r.to}</span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-3 px-5 py-4">
                  <span className="text-sm font-semibold text-muted">{r.note}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-marigold px-3.5 py-2 text-sm font-bold text-ink">
                    Request fare <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </QuoteButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
