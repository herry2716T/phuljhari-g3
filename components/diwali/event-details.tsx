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
  const directionsUrl = partyConfig.destinations.directionsUrl
  const whatsappRsvpUrl = partyConfig.destinations.whatsappRsvpUrl

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

        <div className="event-actions">
          <div className="map-placeholder" role="img" aria-label="Map preview placeholder. Venue to be decided.">
            <span className="map-placeholder__frame" aria-hidden="true" />
            <span className="map-placeholder__label">Map preview placeholder</span>
            <span className="map-placeholder__value">TBD — TO BE DECIDED</span>
          </div>

          <div className="event-actions__buttons">
            {directionsUrl ? (
              <a className="event-button event-button--primary" href={directionsUrl} target="_blank" rel="noreferrer">
                Get directions
              </a>
            ) : (
              <button className="event-button event-button--primary" type="button" disabled>
                Get directions
              </button>
            )}
            {whatsappRsvpUrl ? (
              <a className="event-button" href={whatsappRsvpUrl} target="_blank" rel="noreferrer">
                WhatsApp RSVP
              </a>
            ) : (
              <button className="event-button" type="button" disabled>
                WhatsApp RSVP
              </button>
            )}
          </div>
          <p className="event-actions__note">TBD — TO BE DECIDED</p>
        </div>
      </div>
    </section>
  )
}
