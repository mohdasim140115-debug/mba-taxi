import { MapPin } from "lucide-react";
import { coverage, margaoCoverage } from "@/lib/site-config";
import { SectionHeading } from "./section-heading";

export function LocationCoverage() {
  const regions = coverage.map((c) =>
    c.region === "South Goa" && margaoCoverage.enabled ? { ...c, places: [...margaoCoverage.places, ...c.places] } : c,
  );

  return (
    <section id="coverage" aria-labelledby="coverage-title" className="bg-paper py-20 sm:py-24" data-location="coverage">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          id="coverage-title"
          eyebrow="Where we drive"
          title="Taxi service across North Goa & South Goa"
          intro={
            <>
              Based in Saligao, North Goa. Airport transfers run to <strong className="text-ink">any destination in Goa</strong>,
              including the places below.
            </>
          }
        />

        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
          {regions.map((r) => (
            <div key={r.region} className="bg-white p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-sea">
                <MapPin aria-hidden className="size-4" /> {r.region}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {r.places.map((p) => (
                  <li key={p} className="font-semibold text-ink">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
