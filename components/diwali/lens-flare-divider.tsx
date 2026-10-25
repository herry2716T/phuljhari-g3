'use client'

import type { CSSProperties } from 'react'
import { useCallback } from 'react'
import { useScrollProgress } from './use-scroll-progress'
import type { ScrollProgressMetrics } from './use-scroll-progress'

type LensFlareDividerProps = {
  side?: 'left' | 'right' | 'center'
  hue?: 'amber' | 'rose'
}

const sidePosition = { left: '22%', right: '78%', center: '50%' }

export function LensFlareDivider({ side = 'center', hue = 'amber' }: LensFlareDividerProps) {
  const onProgress = useCallback((metrics: ScrollProgressMetrics) => {
    const element = ref.current
    if (!element) return
    const intensity = metrics.reducedMotion ? 0.7 : Math.sin(Math.PI * metrics.progress)
    element.style.setProperty('--flare-intensity', Math.max(0, intensity).toFixed(4))
  }, [])

  const ref = useScrollProgress<HTMLDivElement>({ onProgress })

  const style = { '--flare-x': sidePosition[side] } as CSSProperties

  return (
    <div
      ref={ref}
      className={`lens-flare-divider lens-flare-divider--${hue}`}
      style={style}
      aria-hidden="true"
    >
      <span className="lens-flare__core" />
      <span className="lens-flare__streak" />
      <span className="lens-flare__ghost lens-flare__ghost--one" />
      <span className="lens-flare__ghost lens-flare__ghost--two" />
      <span className="lens-flare__ghost lens-flare__ghost--three" />
    </div>
  )
}
