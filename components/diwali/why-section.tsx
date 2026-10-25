'use client'

import Image from 'next/image'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { useRef } from 'react'
import { partyConfig } from '@/lib/party-config'
import { useScrollProgress } from './use-scroll-progress'

const cardRotations = [-3.5, 2.3, -1.6, 3.2]
const pinPositions = ['34%', '56%', '44%', '63%']

function PaperCard({
  reason,
  index,
}: {
  reason: (typeof partyConfig.reasons)[number]
  index: number
}) {
  const rotation = cardRotations[index]

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return

    const bounds = event.currentTarget.getBoundingClientRect()
    const offset = (event.clientX - bounds.left) / bounds.width - 0.5
    event.currentTarget.style.setProperty('--hover-tilt', `${offset * 7}deg`)
  }

  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--hover-tilt', '0deg')
  }

  const cardStyle = {
    '--card-rotation': `${rotation}deg`,
    '--pin-offset': pinPositions[index],
    '--card-delay': `${index * 100}ms`,
  } as CSSProperties

  return (
    <article
      className={`paper-card paper-card--${index + 1}`}
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      aria-labelledby={`reason-${index + 1}`}
    >
      <span className="paper-card__pin" aria-hidden="true" />
      <h3 id={`reason-${index + 1}`}>{reason.copy}</h3>
      <figure className="paper-card__artwork">
        {reason.imageSrc ? (
          <Image
            src={reason.imageSrc}
            alt={reason.imageAlt}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1100px) 42vw, 24vw"
            className="paper-card__image"
          />
        ) : (
          <div className="meme-placeholder" role="img" aria-label={`Placeholder for ${reason.imageAlt}`}>
            <span>{reason.placeholderLabel}</span>
            <span>PLACEHOLDER</span>
          </div>
        )}
      </figure>
    </article>
  )
}

export function WhySection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const ref = useScrollProgress<HTMLElement>()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    trackRef.current?.scrollBy({
      left: event.key === 'ArrowRight' ? 340 : -340,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      ref={ref}
      id="why-you-need-it"
      className="why-section scroll-linked-section"
      aria-labelledby="why-heading"
    >
      <div className="section-heading section-heading--spread">
        <h2 id="why-heading">why you need it</h2>
        <p className="swipe-hint">swipe / scroll sideways</p>
      </div>
      <div
        ref={trackRef}
        className="paper-wall"
        role="region"
        aria-label="Four reasons to attend, shown as swipeable paper cards"
        aria-describedby="paper-wall-instructions"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <p id="paper-wall-instructions" className="sr-only">
          Scroll horizontally or use the left and right arrow keys to browse all four cards.
        </p>
        <div className="paper-wall__track">
          {partyConfig.reasons.map((reason, index) => (
            <PaperCard key={reason.copy} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
