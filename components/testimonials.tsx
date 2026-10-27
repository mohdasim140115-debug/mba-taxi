import { testimonials } from "@/lib/site-config";
import { SectionHeading } from "./section-heading";

/** Renders nothing until genuine, attributable reviews are added in site-config. */
export function Testimonials() {
  if (!testimonials.enabled || testimonials.items.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="bg-paper py-20 sm:py-24" data-location="reviews">
      <div className="container-x">
        <SectionHeading id="reviews-title" eyebrow="Reviews" title="What travellers say" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.items.map((t) => (
            <li key={t.name + t.quote.slice(0, 12)}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-white p-6">
                <blockquote className="display flex-1 text-lg leading-snug text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-bold text-ink">{t.name}</span>
                  {t.context && <span className="text-muted"> · {t.context}</span>}
                  {t.source && <span className="block text-muted">{t.source}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
