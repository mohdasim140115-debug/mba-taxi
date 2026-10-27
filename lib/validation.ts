import { fleet, serviceTypes, type ServiceType } from "./site-config";

/** Shared by the enquiry form (client) and /api/enquiry (server). */

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  passengers: string;
  /**
   * Optional trip context. The form doesn't show these fields; they are
   * pre-filled when a visitor taps a route / service / airport button.
   */
  service: ServiceType | "";
  pickup: string;
  drop: string;
  date: string;
  time: string;
  /** Preferred vehicle id from site-config fleet, or "" for any. */
  vehicle: string;
};

export type Attribution = Partial<
  Record<"gclid" | "gbraid" | "wbraid" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content" | "landing_page", string>
>;

export type EnquiryPayload = EnquiryInput & {
  /** Honeypot: must stay empty. Deliberately not a name browsers autofill. */
  hp_field?: string;
  /** Epoch ms when the form was first rendered. */
  startedAt?: number;
  attribution?: Attribution;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const serviceValues = new Set<string>(serviceTypes.map((s) => s.value));
const vehicleIds = new Set<string>(fleet.map((v) => v.id));

/** Accepts Indian mobiles (with or without +91 / 0) and international numbers. */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (hasPlus) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

function todayISO() {
  // Goa is UTC+5:30; compare dates in IST so late-night bookings are not rejected.
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

export function validateEnquiry(input: Partial<EnquiryInput>): FieldErrors {
  const errors: FieldErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const phone = input.phone ?? "";
  const date = input.date ?? "";

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 80) errors.name = "Please shorten your name.";

  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) {
    errors.email = "Please enter a valid email, e.g. name@example.com.";
  }

  if (!phone.trim()) errors.phone = "Please enter a phone or WhatsApp number.";
  else if (!normalisePhone(phone)) errors.phone = "Please enter a valid number, e.g. 98765 43210 or +44 7700 900123.";

  if (input.passengers && !/^(?:[1-7]|8\+)$/.test(input.passengers)) {
    errors.passengers = "Please choose the number of passengers.";
  }

  // Optional trip context: only checked when present.
  if (input.service && !serviceValues.has(input.service)) errors.service = "Please choose a service.";
  if ((input.pickup ?? "").length > 120) errors.pickup = "Please shorten the pickup location.";
  if ((input.drop ?? "").length > 120) errors.drop = "Please shorten the destination.";
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Please choose a valid travel date.";
  else if (date && date < todayISO()) errors.date = "The travel date can’t be in the past.";
  if (input.time && !/^\d{2}:\d{2}$/.test(input.time)) errors.time = "Please choose a valid time.";
  if (input.vehicle && !vehicleIds.has(input.vehicle)) errors.vehicle = "Please choose a taxi type.";

  return errors;
}

export function serviceLabel(value: string) {
  return serviceTypes.find((s) => s.value === value)?.long ?? value;
}

/** Human-readable summary used for WhatsApp hand-off and notification e-mails. */
export function enquirySummary(e: EnquiryInput) {
  const lines = [
    `Name: ${e.name}`,
    `Phone: ${e.phone}`,
    e.email && `Email: ${e.email}`,
    e.passengers && `Passengers: ${e.passengers}`,
    e.service && `Service: ${serviceLabel(e.service)}`,
    e.pickup && `Pickup: ${e.pickup}`,
    e.drop && `Drop: ${e.drop}`,
    e.date && `Date: ${e.date}${e.time ? ` at ${e.time}` : ""}`,
    e.vehicle && `Taxi type: ${fleet.find((v) => v.id === e.vehicle)?.name ?? e.vehicle}`,
  ];
  return lines.filter(Boolean).join("\n");
}
