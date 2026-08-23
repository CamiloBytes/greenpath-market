import {
  LandingHeader,
  LandingBackground,
  HeroSection,
  AboutSection,
  ContactSection,
} from "@/src/components/landing";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <LandingBackground />

      <div className="relative z-10">
        <LandingHeader />
        <HeroSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}