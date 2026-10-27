import { asset } from "@/lib/base-path";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { site, telLink, whatsappLink } from "@/lib/site-config";
import { BookingForm } from "./booking-form";

export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="final-title" className="relative isolate overflow-hidden bg-ink py-20 text-ivory sm:py-28" data-location="final-cta">
      <Image
        src={asset("/images/baga-beach-sunset.jpg")}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[60%_center] opacity-60"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-ink)_15%,rgb(11_23_38/0.6)_100%)]" />

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="eyebrow text-marigold">Ready when you are</p>
          <h2 id="final-title" className="display mt-4 text-[2.4rem] leading-[1.05] text-white sm:text-6xl">
            Planning your Goa trip? Let’s arrange your ride.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-ivory/80">
            Tell us where and when. We’ll reply with the vehicle options and your fare — no payment needed to enquire.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telLink} className="btn btn-primary" data-label="final-call">
              <Phone aria-hidden className="size-4" /> Call {site.phone.display}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-light" data-label="final-whatsapp">
              <MessageCircle aria-hidden className="size-4" /> WhatsApp us
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-paper p-5 text-ink shadow-lift sm:p-7">
          <h3 className="display mb-5 text-2xl">Quick fare enquiry</h3>
          <BookingForm location="final-form" />
        </div>
      </div>
    </section>
  );
}
