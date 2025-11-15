import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DiscoverSection } from "@/components/DiscoverSection";
import { AccountLinkSection } from "@/components/AccountLinkSection";
import { BadgeShowcase } from "@/components/BadgeShowcase";
import { LegalSection } from "@/components/LegalSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <DiscoverSection />
      <AccountLinkSection />
      <BadgeShowcase />
      <LegalSection />
      <Footer />
    </div>
  );
};

export default Index;
