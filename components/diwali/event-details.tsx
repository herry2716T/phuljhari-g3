'use client'

import { partyConfig } from '@/lib/party-config'
import { useScrollProgress } from './use-scroll-progress'

const detailRows = [
  ['venue name', partyConfig.event.venueName],
  ['full address', partyConfig.event.fullAddress],
  ['date', partyConfig.event.date],
  ['time', partyConfig.event.time],
  ['arrival note', partyConfig.event.arrivalNote],
] as const

export function EventDetails() {
  const ref = useScrollProgress<HTMLElement>()

  return (
    <section
      ref={ref}
      id="event-details"
      className="event-details scroll-linked-section"
      aria-labelledby="event-details-heading"
    >
      <div className="event-details__intro">
        <h2 id="event-details-heading">Actual venue details</h2>
      </div>

      <div className="event-details__grid">
        <dl className="event-facts">
          {detailRows.map(([label, value]) => (
            <div className="event-fact" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
