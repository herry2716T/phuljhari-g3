'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { partyConfig } from '@/lib/party-config'
import { BrandMark } from './brand-mark'

function SoundControl() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const soundSrc = partyConfig.soundSrc

  useEffect(() => {
    const audio = audioRef.current

    const updateScrollState = () => {
      const nextIsScrolled = window.scrollY > 48
      setIsScrolled((current) => current === nextIsScrolled ? current : nextIsScrolled)

      if (audio) {
        const scrollFade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 1.35))
        audio.volume = isPlaying ? 0.18 * scrollFade : 0
      }
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [isPlaying, soundSrc])

  const toggleSound = async () => {
    const audio = audioRef.current

    if (!audio || !soundSrc) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      audio.volume = 0.18
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <>
      <button
        aria-label={soundSrc ? (isPlaying ? 'Mute sound effects' : 'Play sound effects') : 'Sound effects unavailable until an audio asset is added'}
        aria-pressed={isPlaying}
        title={soundSrc ? undefined : 'Sound effects remain disabled until an audio asset is added'}
        className={`sound-control${isScrolled ? ' sound-control--compact' : ''}`}
        disabled={!soundSrc}
        onClick={toggleSound}
        type="button"
      >
        {isPlaying ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        <span className="sound-control__label">{soundSrc ? (isPlaying ? 'Sound on' : 'Sound off') : 'Sound off · asset TBD'}</span>
      </button>
      {soundSrc ? <audio ref={audioRef} src={soundSrc} loop preload="none" /> : null}
    </>
  )
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <BrandMark size="persistent" />
      <SoundControl />
    </header>
  )
}

export function OpticalLens() {
  return (
    <div className="optical-lens" aria-hidden="true">
      <svg
        className="optical-lens__filter-defs"
        width="0"
        height="0"
        focusable="false"
      >
        <defs>
          <filter
            id="diwali-optical-lens-filter"
            x="-10%"
            y="-32%"
            width="120%"
            height="164%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.032"
              numOctaves="1"
              seed="8"
              stitchTiles="stitch"
              result="lens-ripples"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens-ripples"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="optical-lens__surface" />
      <div className="optical-lens__chromatic-edge" />
      <svg
        className="optical-lens__rim"
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
      >
        <path className="optical-lens__rim-glow" d="M0 16 C250 0 750 0 1000 16" />
        <path className="optical-lens__rim-line" d="M0 16 C250 0 750 0 1000 16" />
        <path className="optical-lens__rim-cool" d="M0 17 C250 1 750 1 1000 17" />
      </svg>
    </div>
  )
}
