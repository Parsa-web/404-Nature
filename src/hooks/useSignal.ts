import { useEffect, useRef, useState } from 'react'

/** Opening phases of the hero, in order. */
export type Phase = 'search' | 'detect' | 'impact' | 'settle' | 'stable'
/** What the diagnostic block reports. */
export type Signal = 'stable' | 'lost' | 'recovering'

export interface SignalState {
  phase: Phase
  signal: Signal
  /** True when the opening has already been seen this session. */
  quick: boolean
}

/** Opening choreography, in ms from mount. */
const T = {
  detect: 360,
  impact: 620,
  settle: 880,
  stable: 2000,
  /** Shortened opening when the visitor has already seen it this session. */
  quickStable: 700,
}

/** Micro-errors: short, varied, never on a predictable beat. */
const MICRO_TYPES = ['slip', 'ghost', 'tear'] as const
const MICRO_MIN = 2800
const MICRO_MAX = 6500
/** The signature event. Rare enough to stay a surprise. */
const COLLAPSE_MIN = 17000
const COLLAPSE_MAX = 28000
const COLLAPSE_MS = 230
const RECOVER_MS = 560

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * "404 // SIGNAL LOST" — the hero's motion system.
 *
 * Owns one state machine for the whole hero so the number, the environmental
 * image and the diagnostic text always fail together: the archive malfunctions,
 * rather than a title having a glitch effect bolted on.
 *
 * The hook writes `data-phase` and a transient `data-glitch` onto the hero
 * element; every pixel of the effect itself is CSS (transform / opacity /
 * clip-path / filter), so it stays on the compositor.
 *
 * Scheduling pauses when the hero scrolls out of view or the tab is hidden,
 * and the whole system is inert under `prefers-reduced-motion`.
 */
export function useSignal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [state, setState] = useState<SignalState>({ phase: 'search', signal: 'stable', quick: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ phase: 'stable', signal: 'stable', quick: true })
      return
    }

    const timers = new Set<number>()
    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
      return id
    }

    const setPhase = (phase: Phase) => setState((s) => ({ ...s, phase }))

    // ---- opening ---------------------------------------------------------
    const seen = sessionStorage.getItem('signal-seen') === '1'
    if (seen) {
      setState((s) => ({ ...s, phase: 'settle', quick: true }))
      after(T.quickStable, () => setPhase('stable'))
    } else {
      after(T.detect, () => setPhase('detect'))
      after(T.impact, () => setPhase('impact'))
      after(T.settle, () => setPhase('settle'))
      after(T.stable, () => {
        setPhase('stable')
        sessionStorage.setItem('signal-seen', '1')
      })
    }

    // ---- disturbances ----------------------------------------------------
    let clearing: number | undefined
    let lastEvent = 0
    /** Events never stack: a disturbance is ignored if one just happened. */
    const disturb = (kind: string, ms: number, force = false) => {
      const now = performance.now()
      if (!force && now - lastEvent < 900) return
      lastEvent = now
      el.dataset.glitch = kind
      window.clearTimeout(clearing)
      clearing = window.setTimeout(() => {
        delete el.dataset.glitch
      }, ms)
    }

    const collapse = () => {
      disturb('collapse', COLLAPSE_MS, true)
      setState((s) => ({ ...s, signal: 'lost' }))
      after(COLLAPSE_MS, () => setState((s) => ({ ...s, signal: 'recovering' })))
      after(COLLAPSE_MS + RECOVER_MS, () => setState((s) => ({ ...s, signal: 'stable' })))
    }

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.12 })
    io.observe(el)
    const awake = () => visible && !document.hidden

    let microId: number | undefined
    const loopMicro = () => {
      microId = window.setTimeout(() => {
        if (awake()) disturb(MICRO_TYPES[Math.floor(Math.random() * MICRO_TYPES.length)], rand(70, 130))
        loopMicro()
      }, rand(MICRO_MIN, MICRO_MAX))
    }
    let collapseId: number | undefined
    const loopCollapse = () => {
      collapseId = window.setTimeout(() => {
        if (awake()) collapse()
        loopCollapse()
      }, rand(COLLAPSE_MIN, COLLAPSE_MAX))
    }
    const startLoops = after(seen ? T.quickStable : T.stable, () => {
      loopMicro()
      loopCollapse()
    })

    // ---- scroll: lift the hero away, and tear once on the way out --------
    let ticking = false
    let lastOut = -1
    let torn = false
    const write = () => {
      ticking = false
      const p = Math.min(1, Math.max(0, window.scrollY / ((el.offsetHeight || 1) * 0.85)))
      const v = Math.round(p * 100) / 100
      if (v !== lastOut) {
        lastOut = v
        el.style.setProperty('--ho', String(v))
      }
      // Leaving the hero is itself a signal event, fired once per approach.
      if (v > 0.12 && v < 0.75 && !torn) {
        torn = true
        disturb('tear', 120)
      } else if (v <= 0.04) {
        torn = false
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(write)
    }
    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.clearTimeout(startLoops)
      window.clearTimeout(microId)
      window.clearTimeout(collapseId)
      window.clearTimeout(clearing)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /** Hover on desktop is a user-triggered micro-error. */
  const nudge = () => {
    const el = ref.current
    if (!el || el.dataset.phase !== 'stable') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.glitch = 'ghost'
    window.setTimeout(() => {
      if (ref.current?.dataset.glitch === 'ghost') delete ref.current.dataset.glitch
    }, 110)
  }

  return { ref, ...state, nudge }
}
