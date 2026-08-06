import { Navbar } from './home/Navbar'
import { HeroSection } from './home/HeroSection'
import { FeaturesSection } from './home/FeaturesSection'
import { SocialProofSection } from './home/SocialProofSection'
import { StatisticsSection } from './home/StatisticsSection'
import { CTASection } from './home/CTASection'
import { Footer } from './home/Footer'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" />

      {/* Radial Gradient Overlay */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <SocialProofSection />
          <StatisticsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
