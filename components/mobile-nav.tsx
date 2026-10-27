"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink shadow-soft"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-soft"
        >
          <ul className="container-x divide-y divide-line py-2">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block py-3.5 text-base font-semibold text-ink">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#book" onClick={() => setOpen(false)} className="block py-3.5 text-base font-bold text-sea" data-track="cta_click" data-label="mobile-menu-quote">
                Get a fare quote
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
