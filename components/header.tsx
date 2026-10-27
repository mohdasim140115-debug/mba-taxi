import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { site, telLink, whatsappLink } from "@/lib/site-config";
import { MobileNav } from "./mobile-nav";

export const navItems = [
  { href: "#services", label: "Taxi Services" },
  { href: "#airport", label: "Airport Transfers" },
  { href: "#fleet", label: "Our Fleet" },
  { href: "#routes", label: "Popular Routes" },
  { href: "#why", label: "Why Choose Us" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-marigold md:border-line md:bg-white/95 md:backdrop-blur-md" data-location="header">
      <a
        href="#book"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to booking form
      </a>
      <div className="container-x flex h-16 max-w-[90rem] items-center justify-between gap-4 lg:h-20">
        <a href="#top" className="flex shrink-0 items-center" aria-label={`${site.name} – back to top`}>
          <Image src={site.logo.src} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} className="h-11 w-auto lg:h-14" loading="eager" sizes="98px" />
        </a>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-8 text-[0.95rem] font-semibold text-ink">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="relative py-2 transition-colors hover:text-sea">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <a href={telLink} className="btn btn-primary hidden h-12 min-h-0 px-5 md:inline-flex" data-label="header-call">
            <Phone aria-hidden className="size-4.5" fill="currentColor" strokeWidth={0} />
            {site.phone.display}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener"
            className="btn btn-whatsapp hidden h-12 min-h-0 px-5 md:inline-flex"
            data-label="header-whatsapp"
          >
            <MessageCircle aria-hidden className="size-5" />
            WhatsApp Us
          </a>
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
