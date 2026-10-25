import { EventDetails } from '@/components/diwali/event-details'
import { SiteFooter, ThemeJoke } from '@/components/diwali/closing-sections'
import { HeroSection } from '@/components/diwali/hero-section'
import { LanternTransition } from '@/components/diwali/lantern-transition'
import { LensFlareDivider } from '@/components/diwali/lens-flare-divider'
import { SiteHeader } from '@/components/diwali/site-chrome'
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
        <LensFlareDivider side="right" />
        <StorySections />
        <LensFlareDivider side="left" hue="rose" />
        <ThemeJoke />
        <LensFlareDivider side="right" />
        <EventDetails />
        <LensFlareDivider side="center" hue="rose" />
      </main>
      <SiteFooter />
    </div>
  )
}
