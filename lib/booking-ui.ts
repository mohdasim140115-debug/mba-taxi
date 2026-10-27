/**
 * On phones the enquiry form lives in a bottom sheet (components/booking-sheet.tsx);
 * on larger screens it's the card in the hero (#book). Every "Book" action calls
 * openBooking() so it does the right thing at each size.
 */
export const OPEN_BOOKING_EVENT = "mba:open-booking";

/** Must match the `md` breakpoint where the hero form card becomes visible. */
export const isPhoneLayout = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

export function openBooking() {
  if (isPhoneLayout()) {
    window.dispatchEvent(new Event(OPEN_BOOKING_EVENT));
    return;
  }
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", "#book");
}
