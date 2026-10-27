"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { BookingForm } from "./booking-form";
import { OPEN_BOOKING_EVENT, isPhoneLayout, openBooking } from "@/lib/booking-ui";

const AUTO_OPEN_DELAY_MS = 1500;
const SEEN_KEY = "mba_sheet_seen";

/**
 * Phone-only enquiry form in a bottom sheet (owner's request).
 * - Opens once per visit, 1.5 s after the page loads (not instantly, and easy to
 *   close, to stay friendly with Google's landing-page experience guidelines).
 * - Opens again from any "Book" action (#book links, route / car / tile buttons).
 */
export function BookingSheet() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Auto-open once per session on phones.
  useEffect(() => {
    if (!isPhoneLayout()) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked: still auto-open once for this page view.
    }
    if (seen) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Open on request, and turn plain #book links into "open booking" on phones.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href="#book"]');
      if (!link || !isPhoneLayout() || e.defaultPrevented) return;
      e.preventDefault();
      openBooking();
    };
    window.addEventListener(OPEN_BOOKING_EVENT, onOpen);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(OPEN_BOOKING_EVENT, onOpen);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // While open: lock page scroll, close on Escape, focus the close button.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] md:hidden ${open ? "visible" : "pointer-events-none invisible delay-300"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/55 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        inert={!open}
        className={`absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-lift transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div aria-hidden className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/15" />
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sand text-ink">
            <CalendarDays aria-hidden className="size-6" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="sheet-title" className="display text-[1.5rem] leading-tight">
              Book Your Ride
            </h2>
            <p className="text-sm text-muted">Leave your details — we’ll call you with the fare</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close booking form"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <BookingForm location="mobile-sheet" listenForPrefill />
      </div>
    </div>
  );
}
