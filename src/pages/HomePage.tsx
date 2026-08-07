import { HeroSection } from "./home/HeroSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { SocialProofSection } from "./home/SocialProofSection";
import { StatisticsSection } from "./home/StatisticsSection";
import { CTASection } from "./home/CTASection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <StatisticsSection />
      <CTASection />
    </>
  );
}
