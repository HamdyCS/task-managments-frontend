import { CTASection } from "../components/website/home/CTASection";
import { FeaturesSection } from "../components/website/home/FeaturesSection";
import { HeroSection } from "../components/website/home/HeroSection";
import { SocialProofSection } from "../components/website/home/SocialProofSection";
import { StatisticsSection } from "../components/website/home/StatisticsSection";

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
