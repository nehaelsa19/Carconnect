import { BenefitsSection } from "@/components/benefits-section";
import { CtaBanner } from "@/components/cta-banner";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { NavigationHeader } from "@/components/navigation-header";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <NavigationHeader />
      <main className="bg-background pt-16">
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
