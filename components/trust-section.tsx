import { CarFront, MessageCircle, Plane, Wallet } from "lucide-react";

/** Only facts published by the business; no invented counts or ratings. */
const items = [
  { icon: Plane, label: "Airports", value: "Dabolim (GOI) & Mopa (GOX)" },
  { icon: CarFront, label: "Vehicles", value: "Dzire, Ertiga, Innova, Innova Crysta" },
  { icon: MessageCircle, label: "Booking", value: "WhatsApp, phone or online form" },
  { icon: Wallet, label: "Payment", value: "Cash, UPI, GPay, PhonePe, bank transfer" },
];

/** Small fact cards: a swipeable row on phones, a grid from tablet up. */
export function TrustSection() {
  return (
    <section aria-label="At a glance" className="border-b border-line bg-white py-5 sm:py-8">
      <div className="container-x">
        <dl className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {items.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex w-[64%] shrink-0 snap-start items-start gap-3 rounded-2xl border border-line bg-ivory p-4 sm:w-auto"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-marigold text-ink">
                <Icon aria-hidden className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold leading-snug text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
