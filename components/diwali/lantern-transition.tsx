'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { useCallback, useRef } from 'react'
import { useScrollProgress } from './use-scroll-progress'
import type { ScrollProgressMetrics } from './use-scroll-progress'

type LanternArtwork = {
  src: string
  width: number
  height: number
}

type LanternMotion = {
  artwork: number
  x: number
  y: number
  width: number
  startY: number
  delay: number
  revealDuration: number
  exitStart: number
  exitDistance: number
  opacity: number
  scale: number
  blur: number
  rotation: number
  sway: number
  drift: number
  sideOffset: number
  depth: number
}

const lanternArtwork: LanternArtwork[] = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%282%29-LJv8EtXKiK1jrSkFNvCxU8fxEPPVTK.png',
    width: 972,
    height: 1181,
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Glowing%20Sky%20Lantern%20Illustration%20_%20Canva%20Element%20for%20Festivals-9MtgQX5TtkFNkSrp2MgOXERHQ0B8uA.png',
    width: 1170,
    height: 1800,
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mid%20Autumn%20Sky%20Lantern%20_%20Canva%20Element%20Keyword-J5sHZ8XmV5fmyh7HkrwQk8T3VyOqUG.png',
    width: 1008,
    height: 1704,
  },
]

const lanterns: LanternMotion[] = [
  { artwork: 0, x: 18, y: 0.52, width: 14, startY: 0.86, delay: 0.08, revealDuration: 0.56, exitStart: 0.84, exitDistance: 1.2, opacity: 0.72, scale: 0.9, blur: 1.25, rotation: -6, sway: 4, drift: 4, sideOffset: -18, depth: 2 },
  { artwork: 1, x: 50, y: 0.36, width: 21, startY: 0.82, delay: 0.02, revealDuration: 0.5, exitStart: 0.87, exitDistance: 1.25, opacity: 0.95, scale: 1.05, blur: 0, rotation: 0, sway: -2, drift: 0, sideOffset: 0, depth: 4 },
  { artwork: 2, x: 82, y: 0.53, width: 14, startY: 0.89, delay: 0.14, revealDuration: 0.58, exitStart: 0.82, exitDistance: 1.2, opacity: 0.62, scale: 0.86, blur: 1.6, rotation: 6, sway: -4, drift: -4, sideOffset: 18, depth: 1 },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smoothstep = (value: number) => value * value * (3 - 2 * value)

export function LanternTransition() {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const lanternElementsRef = useRef<HTMLElement[]>([])

  const onProgress = useCallback((metrics: ScrollProgressMetrics) => {
    const scene = sceneRef.current
    if (!scene || metrics.reducedMotion) return

    const { progress, viewportWidth, viewportHeight } = metrics
    const backgroundProgress = smoothstep(clamp((progress - 0.14) / 0.86))
    const headingProgress = smoothstep(clamp((progress - 0.56) / 0.34))
    const previewExit = smoothstep(clamp((progress - 0.84) / 0.16))
    const ambientProgress = Math.sin(Math.PI * progress)

    scene.style.setProperty('--transition-progress', progress.toFixed(4))
    scene.style.setProperty('--why-background-opacity', backgroundProgress.toFixed(4))
    scene.style.setProperty('--why-intro-opacity', (headingProgress * (1 - previewExit)).toFixed(4))
    scene.style.setProperty('--why-intro-y', `${((1 - headingProgress) * 26).toFixed(2)}px`)
    scene.style.setProperty('--why-intro-blur', `${((1 - headingProgress) * 6).toFixed(2)}px`)
    scene.style.setProperty('--why-intro-scale', (1.08 - headingProgress * 0.08).toFixed(4))
    scene.style.setProperty('--lantern-ambience', ambientProgress.toFixed(4))

    if (!lanternElementsRef.current.length) {
      lanternElementsRef.current = Array.from(
        scene.querySelectorAll<HTMLElement>('.lantern-transition__lantern'),
      )
    }

    lanternElementsRef.current.forEach((element, index) => {
      const lantern = lanterns[index]
      if (!lantern) return

      const reveal = smoothstep(clamp((progress - lantern.delay) / lantern.revealDuration))
      const exit = smoothstep(clamp((progress - lantern.exitStart) / (1 - lantern.exitStart)))
      const horizontalOffset =
        (lantern.drift * progress + lantern.sideOffset * (1 - reveal)) * (viewportWidth / 100)
      const verticalOffset =
        ((1 - reveal) * lantern.startY - exit * lantern.exitDistance) * viewportHeight
      const scale = lantern.scale * (0.7 + reveal * 0.44 + exit * 0.12)
      const opacity = lantern.opacity * reveal * (1 - exit)
      const rotation = lantern.rotation + lantern.sway * progress
      const depthOffset = (progress - 0.5) * 64 + (lantern.depth - 2) * 20
      const blur = lantern.blur * (1 - reveal) + exit * 1.6
      const glow = (0.06 + reveal * 0.42) * (1 - exit)

      element.style.opacity = opacity.toFixed(4)
      element.style.setProperty('--lantern-blur', `${blur.toFixed(2)}px`)
      element.style.setProperty('--lantern-glow', glow.toFixed(4))
      element.style.transform = `translate3d(calc(-50% + ${horizontalOffset.toFixed(2)}px), calc(-50% + ${verticalOffset.toFixed(2)}px), ${depthOffset.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`
    })
  }, [])

  const wrapperRef = useScrollProgress<HTMLDivElement>({
    range: 'sticky',
    onProgress,
  })

  return (
    <>
      {lanternArtwork.map((artwork) => (
        <link key={artwork.src} rel="preload" as="image" href={artwork.src} />
      ))}
      <div ref={wrapperRef} className="lantern-transition scroll-linked-section" aria-hidden="true">
        <div ref={sceneRef} className="lantern-transition__scene">
          <div className="lantern-transition__backdrop" />
          <div className="lantern-transition__why-background" />
          <div className="lantern-transition__ambient" />
          <div className="lantern-transition__field">
            {lanterns.map((lantern, index) => {
              const artwork = lanternArtwork[lantern.artwork]
              const style = {
                '--lantern-x': `${lantern.x}%`,
                '--lantern-y': `${lantern.y * 100}%`,
                '--lantern-width': `${lantern.width}vw`,
                '--lantern-opacity': String(lantern.opacity),
                '--lantern-scale': String(lantern.scale),
                '--lantern-rotation': `${lantern.rotation}deg`,
                '--lantern-blur': `${lantern.blur}px`,
                '--lantern-depth': lantern.depth,
              } as CSSProperties

              return (
                <div key={`${lantern.artwork}-${index}`} className="lantern-transition__lantern" style={style}>
                  <Image
                    src={artwork.src}
                    alt=""
                    width={artwork.width}
                    height={artwork.height}
                    sizes="(max-width: 760px) 24vw, 16vw"
                    loading="eager"
                    fetchPriority="low"
                    unoptimized
                    className="lantern-transition__image"
                  />
                </div>
              )
            })}
          </div>
          <div className="lantern-transition__why-preview">
            <h2>why you need it</h2>
            <span>swipe / scroll sideways</span>
          </div>
        </div>
      </div>
    </>
  )
}
