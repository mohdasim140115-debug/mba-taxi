import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { telLink, whatsappLink } from "@/lib/site-config";

/** Persistent bottom bar on small screens. The footer reserves space for it. */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick contact"
      data-location="mobile-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <li>
          <a href={telLink} className="btn btn-ghost h-12 w-full gap-1.5 px-2 text-sm" data-label="mobile-bar-call">
            <Phone aria-hidden className="size-4" /> Call
          </a>
        </li>
        <li>
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-whatsapp h-12 w-full gap-1.5 px-2 text-sm" data-label="mobile-bar-whatsapp">
            <MessageCircle aria-hidden className="size-4" /> WhatsApp
          </a>
        </li>
        <li>
          <a href="#book" className="btn btn-primary h-12 w-full gap-1.5 px-2 text-sm" data-track="cta_click" data-label="mobile-bar-book">
            <CalendarCheck aria-hidden className="size-4" /> Book
          </a>
        </li>
      </ul>
    </nav>
  );
}
