import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { TrustSection } from "@/components/trust-section";
import { ServicesSection } from "@/components/services-section";
import { AirportTransfers } from "@/components/airport-transfers";
import { PopularRoutes } from "@/components/popular-routes";
import { FleetSection } from "@/components/fleet-section";
import { LocationCoverage } from "@/components/location-coverage";
import { WhyChoose } from "@/components/why-choose";
import { Testimonials } from "@/components/testimonials";
import { FaqSection } from "@/components/faq-section";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { BookingSheet } from "@/components/booking-sheet";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <FleetSection />
        <ServicesSection />
        <AirportTransfers />
        <PopularRoutes />
        <LocationCoverage />
        <WhyChoose />
        <Testimonials />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <MobileActionBar />
      <BookingSheet />
    </>
  );
}
