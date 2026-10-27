import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { imageCredits, site, telLink, whatsappLink } from "@/lib/site-config";
import { navItems } from "./header";

const mainSiteLinks = [
  { href: `${site.mainSiteUrl}/`, label: "Home" },
  { href: `${site.mainSiteUrl}/about-us/`, label: "About us" },
  { href: `${site.mainSiteUrl}/goa-taxi-service-contact/`, label: "Contact" },
];

/** Captured into the static shell and refreshed weekly (Cache Components disallows a bare `new Date()`). */
async function CopyrightYear() {
  "use cache";
  cacheLife("weeks");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-16 text-ivory/80 lg:pb-12" data-location="footer">
      <div className="container-x grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Image src={site.logo.src} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} className="h-16 w-auto" sizes="112px" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Private taxi service across Goa: airport transfers, hotel pickups, local rides and full-day cab hire.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-marigold">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={telLink} className="font-semibold text-white hover:underline" data-label="footer-call">
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="hover:text-white hover:underline" data-label="footer-whatsapp">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <address className="not-italic">{site.address.display}</address>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>

        <nav aria-label="On this page">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-marigold">On this page</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#coverage" className="hover:text-white hover:underline">
                Areas we cover
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="MBA Travels Goa">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-marigold">MBA Travels Goa</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainSiteLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener" className="hover:text-white hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white hover:underline">
                Privacy notice
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container-x mt-14 border-t border-white/10 pt-6 text-xs text-ivory/60">
        <p>
          © <CopyrightYear /> {site.name}. Fares shown are as published by {site.name} and are confirmed for your route before
          booking.
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer hover:text-ivory">Photo credits</summary>
          <ul className="mt-2 space-y-1">
            {imageCredits.map((c) => (
              <li key={c.what}>
                {c.what}: {c.author},{" "}
                <a href={c.url} target="_blank" rel="noopener" className="underline">
                  {c.license}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  );
}
