import { EventDetails } from '@/components/diwali/event-details'
import { SiteFooter, ThemeJoke } from '@/components/diwali/closing-sections'
import { HeroSection } from '@/components/diwali/hero-section'
import { LanternTransition } from '@/components/diwali/lantern-transition'
import { OpticalLens, SiteHeader } from '@/components/diwali/site-chrome'
import { StorySections } from '@/components/diwali/story-sections'
import { WhySection } from '@/components/diwali/why-section'

export default function Home() {
  return (
    <div className="invitation-site">
      <SiteHeader />
      <main>
        <HeroSection />
        <LanternTransition />
        <WhySection />
        <StorySections />
        <EventDetails />
        <ThemeJoke />
      </main>
      <SiteFooter />
      <OpticalLens />
    </div>
  )
}
