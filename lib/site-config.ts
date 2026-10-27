/**
 * Single source of truth for business facts shown on the landing page.
 *
 * Everything here was taken from https://mbatravelsgoa.com (audited 26 Oct 2026)
 * unless marked otherwise. Items the business still needs to confirm are
 * flagged with `TODO(confirm)` and are disabled or kept neutral until then.
 */

import { asset } from "./base-path";

export const site = {
  name: "MBA Travels Goa",
  shortName: "MBA Travels",
  /** Production origin (no path); the page lives at `${url}/taxi-services/`. Override with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mbatravelsgoa.com",
  mainSiteUrl: "https://mbatravelsgoa.com",
  logo: {
    src: asset("/images/mba-travels-goa-logo.png"),
    width: 480,
    height: 277,
    alt: "MBA Travels Goa logo",
  },
  /**
   * Primary number: used for 36 call links on the live site, in its LocalBusiness
   * schema, and on the contact page as the "verified business WhatsApp number".
   * TODO(confirm): the live /taxi-services/ page itself has no call links, sends its
   * airport WhatsApp buttons to +91 90020 70068 and its fleet buttons to the
   * placeholder +91 90000 00000; the About page uses +91 93220 72068.
   * Confirm the number below is the one that should receive taxi enquiries.
   */
  phone: {
    display: "+91 93220 73068",
    e164: "+919322073068",
  },
  whatsapp: {
    number: "919322073068",
    defaultMessage: "Hi MBA Travels Goa, I would like a taxi fare quote.",
  },
  email: "mbatravels12@gmail.com",
  /** From the LocalBusiness schema on the live site. */
  address: {
    street: "Mollembhat",
    locality: "Saligao",
    region: "Goa",
    postalCode: "403511",
    country: "IN",
    display: "Mollembhat, Saligao, Goa 403511",
  },
  /** Live site schema: open Monday–Sunday 00:00–23:59; FAQ says available 24×7. */
  hours: "Open 24 hours, 7 days a week",
  social: {
    facebook: "https://www.facebook.com/share/1BkLm8wkYC/",
  },
  paymentMethods: ["Cash", "UPI", "Google Pay", "PhonePe", "Bank transfer"],
} as const;

export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:${site.phone.e164}`;

/* -------------------------------------------------------------------------- */
/* Airports                                                                   */
/* -------------------------------------------------------------------------- */

export const airports = [
  {
    id: "dabolim",
    name: "Dabolim Airport",
    code: "GOI",
    note: "Goa International Airport, near Vasco da Gama",
    image: asset("/images/dabolim-airport.jpg"),
    imageAlt: "Terminal building and drop-off ramp at Dabolim Airport, Goa",
  },
  {
    id: "mopa",
    name: "Manohar International Airport",
    code: "GOX",
    note: "Mopa, in the north of Goa",
    image: asset("/images/mopa-airport.jpg"),
    imageAlt: "Landscaped forecourt of Manohar International Airport at Mopa, Goa",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Fleet                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Vehicles, features and fares exactly as published on /taxi-services/. Set `showPublishedFares` to false to hide all prices.
 * TODO(confirm): whether "₹/hour" and "₹/km" are charges beyond the 8 hrs / 80 km
 * package; the live site shows them without a label.
 */
export const showPublishedFares = true;

export type Vehicle = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  seats: number;
  features: string[];
  fares: {
    airportPickup: number;
    fullDay: number;
    perHour: number;
    perKm: number;
  };
  /** Representative photo of the model supplied by the owner (not necessarily an MBA vehicle). */
  image: { src: string; alt: string };
};

export const fleet: Vehicle[] = [
  {
    id: "dzire",
    name: "Maruti Suzuki Dzire",
    shortName: "Dzire",
    type: "Sedan",
    seats: 4,
    features: ["Airport pickup included", "Air-conditioned vehicle", "Professional driver"],
    fares: { airportPickup: 1250, fullDay: 2500, perHour: 200, perKm: 20 },
    image: { src: asset("/images/cars/dzire-white.jpg"), alt: "White Maruti Suzuki Dzire sedan" },
  },
  {
    id: "ertiga",
    name: "Maruti Suzuki Ertiga",
    shortName: "Ertiga",
    type: "MPV",
    seats: 6,
    features: ["Airport pickup included", "Spacious family vehicle", "Comfortable AC ride"],
    fares: { airportPickup: 1550, fullDay: 3000, perHour: 200, perKm: 22 },
    image: { src: asset("/images/cars/ertiga-white.jpg"), alt: "White Maruti Suzuki Ertiga MPV" },
  },
  {
    id: "innova",
    name: "Toyota Innova",
    shortName: "Innova",
    type: "SUV",
    seats: 7,
    // TODO(confirm): "Airport meet & greet" is listed on the live page for this vehicle.
    features: ["Premium interior", "Extra luggage space", "Airport meet & greet"],
    fares: { airportPickup: 1750, fullDay: 3500, perHour: 250, perKm: 25 },
    image: { src: asset("/images/cars/innova-white.jpg"), alt: "White Toyota Innova" },
  },
  {
    id: "innova-crysta",
    name: "Toyota Innova Crysta",
    shortName: "Innova Crysta",
    type: "Luxury SUV",
    seats: 7,
    features: ["Premium chauffeur", "Best for families & groups", "Air-conditioned"],
    fares: { airportPickup: 2250, fullDay: 4000, perHour: 300, perKm: 35 },
    image: { src: asset("/images/cars/innova-crysta-white.jpg"), alt: "White Toyota Innova Crysta" },
  },
];

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Taxi services only (scope agreed with the owner: this page mirrors
 * /taxi-services/; tour packages, cruises and hotels stay on the main site).
 * Values are used by the enquiry form; keep them stable for reporting.
 */
export const serviceTypes = [
  { value: "point-to-point", label: "Local Ride", long: "Local ride / hotel transfer" },
  { value: "airport-transfer", label: "Airport", long: "Airport pickup or drop" },
  { value: "full-day", label: "Full Day", long: "Full-day taxi (8 hrs / 80 km)" },
] as const;

export type ServiceType = (typeof serviceTypes)[number]["value"];

/* -------------------------------------------------------------------------- */
/* Coverage & routes                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Only places named on the live site are listed. The site states airport
 * transfers go "to any destination in Goa".
 * TODO(confirm): Margao/Madgaon pickups and Madgaon railway station. Margao
 * keywords carry high search volume; set `enabled: true` once confirmed.
 */
export const coverage = [
  {
    region: "North Goa",
    places: ["Calangute", "Baga", "Candolim", "Anjuna", "Vagator", "Fort Aguada", "Saligao"],
  },
  {
    region: "Panaji & Old Goa",
    places: ["Miramar", "Dona Paula", "Old Goa (Basilica of Bom Jesus)"],
  },
  {
    region: "South Goa",
    places: ["Colva", "Dabolim Airport"],
  },
] as const;

export const margaoCoverage = {
  enabled: false,
  places: ["Margao (Madgaon)", "Madgaon railway station"],
};

export type Route = {
  from: string;
  to: string;
  service: ServiceType;
  note: string;
  image: string;
  imageAlt: string;
};

export const popularRoutes: Route[] = [
  { from: "Goa airport", to: "Calangute", service: "airport-transfer", note: "Dabolim or Mopa", image: asset("/images/places/calangute.jpg"), imageAlt: "Calangute Beach, North Goa" },
  { from: "Goa airport", to: "Baga Beach", service: "airport-transfer", note: "Dabolim or Mopa", image: asset("/images/baga-beach-sunset.jpg"), imageAlt: "Sunset over Baga Beach, North Goa" },
  { from: "Goa airport", to: "Candolim", service: "airport-transfer", note: "Dabolim or Mopa", image: asset("/images/places/candolim.jpg"), imageAlt: "Entrance to Candolim Beach with the Candolim sign" },
  { from: "Goa airport", to: "Anjuna / Vagator", service: "airport-transfer", note: "Dabolim or Mopa", image: asset("/images/places/anjuna.jpg"), imageAlt: "Rocky shore and headland at Anjuna Beach" },
  { from: "Goa airport", to: "Colva", service: "airport-transfer", note: "Dabolim or Mopa", image: asset("/images/places/colva.jpg"), imageAlt: "Wide sandy beach at Colva, South Goa" },
  { from: "Your hotel", to: "Goa airport", service: "airport-transfer", note: "Return transfer", image: asset("/images/mopa-airport.jpg"), imageAlt: "Manohar International Airport, Mopa" },
];

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Hidden by default. The live site shows six reviews (e.g. "Rahul Sharma,
 * Bangalore") with no link to a review platform, so they cannot be verified.
 * TODO(confirm): add genuine reviews (e.g. from the Google Business Profile)
 * with the customer's permission, then set `enabled: true`.
 */
export const testimonials: {
  enabled: boolean;
  items: { quote: string; name: string; context?: string; source?: string }[];
} = {
  enabled: false,
  items: [],
};

/* -------------------------------------------------------------------------- */
/* Image credits (Wikimedia Commons / Unsplash)                               */
/* -------------------------------------------------------------------------- */

export const imageCredits = [
  { what: "Calangute Beach", author: "Anoop M S", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Calangute-beach.jpg" },
  { what: "Candolim Beach", author: "S1ranand", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Candolim_Beach_in_Goa.jpg" },
  { what: "Anjuna Beach", author: "Nikhilb239", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Anjuna_Beach_25012016.jpg" },
  { what: "Colva Beach", author: "Ymsarade", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Beautiful_Colva_Beach_in_Goa.jpg" },
  { what: "Dabolim Airport", author: "A.Savin", license: "FAL 1.3", url: "https://commons.wikimedia.org/wiki/File:Goa-Vasco_03-2016_12_Dabolim_Airport.jpg" },
  { what: "Manohar International Airport, Mopa", author: "Arunpnair 787", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mopa_Airport_Goa_Exteriors.jpg" },
  { what: "Baga Beach at sunset", author: "TravelTwilight.com", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Baga_Beach_In_North_Goa.jpg" },
] as const;
