'use client'

import { useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { partyConfig } from '@/lib/party-config'
import { BrandMark } from './brand-mark'
import { useScrollProgress } from './use-scroll-progress'

function LanternCluster() {
  return (
    <div className="hero-lantern-field" aria-hidden="true">
      <div className="hero-lantern hero-lantern--left">
        <span className="hero-lantern__glow" />
        <span className="hero-lantern__body" />
      </div>
      <div className="hero-lantern hero-lantern--center">
        <span className="hero-lantern__glow" />
        <span className="hero-lantern__body" />
      </div>
      <div className="hero-lantern hero-lantern--right">
        <span className="hero-lantern__glow" />
        <span className="hero-lantern__body" />
      </div>
      <div className="hero-lens-flare" />
    </div>
  )
}

export function HeroSection() {
  const heroRef = useScrollProgress<HTMLElement>({ range: 'hero' })
  const [hasBegun, setHasBegun] = useState(false)

  return (
    <section
      ref={heroRef}
      id="opening"
      className={`hero-section scroll-linked-section${hasBegun ? ' hero-section--started' : ''}`}
      aria-labelledby="invitation-title"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(12, 8, 12, .42), rgba(9, 7, 9, .82) 78%), url("${partyConfig.heroBackdropSrc}")` }}
    >
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-lanterns" aria-hidden="true">
        <LanternCluster />
      </div>

      <div className="hero-stage">
        <button
          className="hero-gate"
          type="button"
          onClick={() => setHasBegun(true)}
          aria-label="Tap to begin the invitation"
        >
          <span>tap to begin</span>
          <ArrowDown aria-hidden="true" />
        </button>

        <div className="hero-invite" aria-hidden={!hasBegun}>
          <BrandMark />
          <h1 id="invitation-title">
            <span>you are invited to</span>
            <span className="hero-title__second-line">
              a banger <em>Diwali party</em>
            </span>
          </h1>
        </div>
      </div>
    </section>
  )
}
