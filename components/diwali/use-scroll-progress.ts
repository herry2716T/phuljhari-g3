'use client'

import { useEffect, useRef } from 'react'

export type ScrollProgressMetrics = {
  progress: number
  enter: number
  exit: number
  focus: number
  viewportWidth: number
  viewportHeight: number
  reducedMotion: boolean
}

type ScrollProgressRange = 'section' | 'sticky' | 'hero' | 'footer'
type ScrollProgressOptions = {
  range?: ScrollProgressRange
  onProgress?: (metrics: ScrollProgressMetrics) => void
}
type ScrollTarget = {
  element: HTMLElement
  range: ScrollProgressRange
  onProgress: (metrics: ScrollProgressMetrics) => void
}

const targets = new Map<HTMLElement, ScrollTarget>()
let frame = 0
let motionPreference: MediaQueryList | null = null

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smoothstep = (value: number) => value * value * (3 - 2 * value)

function setVariable(element: HTMLElement, name: string, value: number | string) {
  element.style.setProperty(name, typeof value === 'number' ? String(value) : value)
}

function writeStaticVariables(element: HTMLElement) {
  const staticVariables: Record<string, string> = {
    '--scroll-progress': '0.5',
    '--scroll-focus': '1',
    '--scroll-enter': '1',
    '--scroll-exit': '0',
    '--scroll-opacity': '1',
    '--scroll-content-y': '0px',
    '--scroll-art-y': '0px',
    '--scroll-art-scale': '1',
    '--scroll-heading-scale': '1',
    '--scroll-blur': '0px',
    '--scroll-small-blur': '0px',
    '--scroll-background-y': '0px',
    '--scroll-light-x': '50%',
    '--scroll-parallax-y': '0px',
    '--scroll-atmosphere-opacity': '0.72',
    '--hero-progress': '0',
    '--hero-lantern-rise': '42px',
    '--hero-center-scale': '0.72',
    '--hero-side-scale': '0.54',
    '--hero-lantern-blur': '5px',
    '--hero-center-opacity': '1',
    '--hero-side-opacity': '0.64',
    '--hero-glow-opacity': '0.7',
    '--hero-flare-opacity': '0',
    '--game-die-x': '0px',
    '--game-die-y': '0px',
    '--game-die-rotate': '0deg',
    '--game-card-y': '0px',
    '--game-card-rotate': '0deg',
    '--game-token-x': '0px',
    '--game-token-y': '0px',
  }

  Object.entries(staticVariables).forEach(([name, value]) => setVariable(element, name, value))
}

function writeSectionVariables(element: HTMLElement, metrics: ScrollProgressMetrics) {
  const { progress, enter, exit, focus } = metrics
  const centeredProgress = progress - 0.5
  const contentY = (1 - enter) * 18 - exit * 14 + (0.5 - progress) * 5
  const artY = (1 - enter) * 24 - exit * 18 + (0.5 - progress) * 22

  setVariable(element, '--scroll-progress', progress.toFixed(4))
  setVariable(element, '--scroll-focus', focus.toFixed(4))
  setVariable(element, '--scroll-enter', enter.toFixed(4))
  setVariable(element, '--scroll-exit', exit.toFixed(4))
  setVariable(element, '--scroll-opacity', focus.toFixed(4))
  setVariable(element, '--scroll-content-y', `${contentY.toFixed(2)}px`)
  setVariable(element, '--scroll-art-y', `${artY.toFixed(2)}px`)
  setVariable(element, '--scroll-art-scale', (0.94 + focus * 0.06 + centeredProgress * 0.03).toFixed(4))
  setVariable(element, '--scroll-heading-scale', (0.94 + focus * 0.06 + centeredProgress * 0.025).toFixed(4))
  setVariable(element, '--scroll-blur', `${((1 - focus) * 6).toFixed(2)}px`)
  setVariable(element, '--scroll-small-blur', `${((1 - focus) * 2.4).toFixed(2)}px`)
  setVariable(element, '--scroll-background-y', `${((0.5 - progress) * 28).toFixed(2)}px`)
  setVariable(element, '--scroll-light-x', `${(35 + progress * 30).toFixed(2)}%`)
  setVariable(element, '--scroll-parallax-y', `${((0.5 - progress) * 18).toFixed(2)}px`)
  setVariable(element, '--scroll-atmosphere-opacity', (focus * 0.72).toFixed(4))
  setVariable(element, '--game-die-x', `${(centeredProgress * 34).toFixed(2)}px`)
  setVariable(element, '--game-die-y', `${(-centeredProgress * 28).toFixed(2)}px`)
  setVariable(element, '--game-die-rotate', `${(centeredProgress * 14).toFixed(2)}deg`)
  setVariable(element, '--game-card-y', `${(centeredProgress * 40).toFixed(2)}px`)
  setVariable(element, '--game-card-rotate', `${(-centeredProgress * 18).toFixed(2)}deg`)
  setVariable(element, '--game-token-x', `${(-centeredProgress * 30).toFixed(2)}px`)
  setVariable(element, '--game-token-y', `${(centeredProgress * 18).toFixed(2)}px`)
}

function writeHeroVariables(element: HTMLElement, progress: number) {
  const flare = Math.sin(Math.PI * progress) * 0.34

  setVariable(element, '--hero-progress', progress.toFixed(4))
  setVariable(element, '--hero-lantern-rise', `${(42 - progress * 142).toFixed(2)}px`)
  setVariable(element, '--hero-center-scale', (0.72 + progress * 0.42).toFixed(4))
  setVariable(element, '--hero-side-scale', (0.54 + progress * 0.22).toFixed(4))
  setVariable(element, '--hero-lantern-blur', `${((1 - progress) * 5).toFixed(2)}px`)
  setVariable(element, '--hero-center-opacity', (0.18 + progress * 0.82).toFixed(4))
  setVariable(element, '--hero-side-opacity', (0.12 + progress * 0.52).toFixed(4))
  setVariable(element, '--hero-glow-opacity', (0.1 + progress * 0.76).toFixed(4))
  setVariable(element, '--hero-flare-opacity', flare.toFixed(4))
}

function updateTarget(target: ScrollTarget, rect: DOMRect, viewportWidth: number, viewportHeight: number) {
  const reducedMotion = motionPreference?.matches ?? false

  if (reducedMotion) {
    writeStaticVariables(target.element)
    target.onProgress({
      progress: 0.5,
      enter: 1,
      exit: 0,
      focus: 1,
      viewportWidth,
      viewportHeight,
      reducedMotion: true,
    })
    return
  }

  if (target.range === 'sticky') {
    const transitionTravel = Math.max(rect.height - viewportHeight, 1) + viewportHeight * 0.08
    const progress = clamp(-rect.top / transitionTravel)
    const metrics: ScrollProgressMetrics = {
      progress,
      enter: 1,
      exit: 0,
      focus: 1,
      viewportWidth,
      viewportHeight,
      reducedMotion: false,
    }

    writeSectionVariables(target.element, metrics)
    target.onProgress(metrics)
    return
  }

  const enter =
    target.range === 'footer'
      ? smoothstep(clamp((viewportHeight - rect.top) / Math.max(rect.height, 1)))
      : smoothstep(clamp((viewportHeight * 1.16 - rect.top) / (viewportHeight * 0.82)))
  const exitStart = target.range === 'hero' ? viewportHeight * 0.66 : viewportHeight * 0.95
  const exitTravel = target.range === 'hero' ? viewportHeight * 0.58 : viewportHeight * 0.7
  const exit =
    target.range === 'footer' ? 0 : smoothstep(clamp((exitStart - rect.bottom) / exitTravel))
  const progress = clamp((viewportHeight - rect.top) / (viewportHeight + Math.max(rect.height, 1)))
  const focus = target.range === 'footer' ? enter : Math.min(enter, 1 - exit)
  const metrics: ScrollProgressMetrics = {
    progress,
    enter,
    exit,
    focus,
    viewportWidth,
    viewportHeight,
    reducedMotion: false,
  }

  writeSectionVariables(target.element, metrics)

  if (target.range === 'hero') {
    const heroProgress = clamp((viewportHeight - rect.bottom) / Math.max(rect.height * 0.9, viewportHeight))
    writeHeroVariables(target.element, heroProgress)
  }
  target.onProgress(metrics)
}

function updateAllTargets() {
  frame = 0

  if (!targets.size) return

  const viewportWidth = Math.max(window.innerWidth, 1)
  const viewportHeight = Math.max(window.innerHeight, 1)
  const measurements = Array.from(targets.values()).map((target) => ({
    target,
    rect: target.element.getBoundingClientRect(),
  }))

  measurements.forEach(({ target, rect }) => {
    updateTarget(target, rect, viewportWidth, viewportHeight)
  })
}

function scheduleUpdate() {
  if (frame || motionPreference?.matches) return
  frame = window.requestAnimationFrame(updateAllTargets)
}

function handleMotionPreferenceChange() {
  if (frame) window.cancelAnimationFrame(frame)
  frame = 0
  updateAllTargets()
}

function startListening() {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  motionPreference.addEventListener('change', handleMotionPreferenceChange)
}

function stopListening() {
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  motionPreference?.removeEventListener('change', handleMotionPreferenceChange)
  motionPreference = null

  if (frame) window.cancelAnimationFrame(frame)
  frame = 0
}

export function useScrollProgress<T extends HTMLElement>(options: ScrollProgressOptions = {}) {
  const ref = useRef<T | null>(null)
  const callbackRef = useRef(options.onProgress)
  const range = options.range ?? 'section'
  callbackRef.current = options.onProgress

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const target: ScrollTarget = {
      element,
      range,
      onProgress: (metrics) => callbackRef.current?.(metrics),
    }

    targets.set(element, target)
    if (targets.size === 1) startListening()
    scheduleUpdate()

    return () => {
      targets.delete(element)
      if (!targets.size) stopListening()
    }
  }, [range])

  return ref
}
