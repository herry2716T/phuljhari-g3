'use client'

import { useScrollProgress } from './use-scroll-progress'

export function ThemeJoke() {
  const ref = useScrollProgress<HTMLElement>()

  return (
    <section
      ref={ref}
      id="theme-joke"
      className="theme-joke scroll-linked-section"
      aria-labelledby="theme-joke-heading"
    >
      <h2 id="theme-joke-heading">boomer choice</h2>
    </section>
  )
}

export function SiteFooter() {
  const ref = useScrollProgress<HTMLElement>({ range: 'footer' })

  return (
    <footer ref={ref} className="site-footer scroll-linked-section">
      <p>ai used yugal to make ts or sm shi</p>
    </footer>
  )
}
