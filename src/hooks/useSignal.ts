import { useEffect, useRef, useState } from 'react'

/** Opening phases of the hero, in order. */
export type Phase = 'search' | 'detect' | 'impact' | 'settle' | 'stable'
/** What the diagnostic block reports. */
export type Signal = 'stable' | 'unstable' | 'lost' | 'recovering'
/** How badly the archive is failing. */
export type Severity = 'micro' | 'medium' | 'critical'

export interface SignalState {
  phase: Phase
  signal: Signal
  /** True when the opening has already been seen this session. */
  quick: boolean
}

/** Opening choreography, in ms from mount. UNCHANGED — the intro is approved. */
const T = {
  detect: 360,
  impact: 620,
  settle: 880,
  stable: 2000,
  /** Shortened opening when the visitor has already seen it this session. */
  quickStable: 700,
}

/* ---------------------------------------------------------------------------
   POST-INTRO ERROR SYSTEM
   One event catalogue, one scheduler. Every entry names a CSS state written to
   the hero as `data-glitch`; the durations below are the exact lengths of the
   matching CSS animations, so JS never has to animate anything itself.
   ------------------------------------------------------------------------- */

interface ErrorEvent {
  /** Value written to `data-glitch`; the CSS contract. */
  kind: string
  severity: Severity
  /** Length of the visual event, matching its CSS animation. */
  ms: number
}

const EVENTS: readonly ErrorEvent[] = [
  // Level 1 — tiny isolated malfunctions, one effect each.
  { kind: 'micro-slice', severity: 'micro', ms: 120 },
  { kind: 'micro-ghost', severity: 'micro', ms: 110 },
  { kind: 'micro-scan', severity: 'micro', ms: 180 },
  { kind: 'micro-glyph', severity: 'micro', ms: 140 },
  { kind: 'micro-frame', severity: 'micro', ms: 130 },
  // Level 2 — noticeable: the number and the photograph fail together.
  { kind: 'medium-tear', severity: 'medium', ms: 460 },
  { kind: 'medium-image', severity: 'medium', ms: 420 },
  { kind: 'medium-corruption', severity: 'medium', ms: 360 },
  // Level 3 — the signature failure of the archive.
  { kind: 'critical-signal-loss', severity: 'critical', ms: 1100 },
  { kind: 'critical-frame-corruption', severity: 'critical', ms: 820 },
  { kind: 'critical-horizontal-tear', severity: 'critical', ms: 900 },
]

/** Reduced motion keeps the idea of an error, not its displacement. */
const CALM_EVENTS: readonly ErrorEvent[] = [
  { kind: 'calm-micro', severity: 'micro', ms: 260 },
  { kind: 'calm-signal', severity: 'medium', ms: 520 },
]

/** Gaps between events. Wide ranges, so the beat is never readable. */
const GAP = { min: 4200, max: 10000 }
/** One in five waits noticeably longer: the archive looks settled again. */
const LONG_PAUSE = { chance: 0.22, min: 2600, max: 6500 }
/** Severity mix — stability dominates by design. */
const MIX = { medium: 0.18, critical: 0.055 }
/** Minimum spacing per level, so a big failure stays an event. */
const SPACING = { medium: 9000, critical: 25000 }
/** Recovery is slower than the failure: sharp break, controlled return. */
const RECOVERY_MS = 540
const CALM_GAP = { min: 14000, max: 26000 }

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <X,>(list: readonly X[]) => list[Math.floor(Math.random() * list.length)]

/**
 * "404 // SIGNAL INSTABILITY" — the hero's motion system.
 *
 * Owns one state machine for the whole hero so the number, the environmental
 * image and the diagnostic text always fail together: the archive malfunctions,
 * rather than a title having a glitch effect bolted on.
 *
 *   INTRO -> IDLE_STABLE -> (micro | medium | critical) -> RECOVERING -> IDLE_STABLE
 *
 * The intro is untouched. After it completes, a single scheduler fires one
 * event at a time with randomised gaps, weighted heavily towards stability.
 * It writes `data-glitch`, `data-severity` and `data-recover` onto the hero
 * element; every pixel of the effect itself is CSS (transform / opacity /
 * clip-path / filter), so it stays on the compositor and can never move layout.
 *
 * Scheduling pauses when the hero scrolls out of view or the tab is hidden,
 * events never stack, and every timer is cleared on unmount.
 */
export function useSignal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [state, setState] = useState<SignalState>({ phase: 'search', signal: 'stable', quick: false })
  /** Hover / tap on the number is a user-triggered micro-error, rate limited. */
  const nudgeRef = useRef<() => void>(() => {})
  const nudge = () => nudgeRef.current()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
    const setSignal = (signal: Signal) => setState((s) => (s.signal === signal ? s : { ...s, signal }))

    // ---- opening (approved, do not change) -------------------------------
    const seen = sessionStorage.getItem('signal-seen') === '1' || reduced
    if (reduced) {
      setState({ phase: 'stable', signal: 'stable', quick: true })
    } else if (seen) {
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

    // ---- awake / asleep --------------------------------------------------
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.12 })
    io.observe(el)
    const awake = () => visible && !document.hidden

    // ---- one error event at a time ---------------------------------------
    let busy = false
    const lastOf: Record<Severity, number> = { micro: 0, medium: -Infinity, critical: -Infinity }

    /** Runs one event: failure, then the slower recovery, then stable. */
    const run = (ev: ErrorEvent) => {
      if (busy) return
      busy = true
      lastOf[ev.severity] = performance.now()

      el.dataset.severity = ev.severity
      el.dataset.glitch = ev.kind

      // Diagnostics follow the failure. Micro events stay silent on purpose:
      // the status line has to mean something when it does change.
      if (ev.severity === 'medium') {
        setSignal('unstable')
      } else if (ev.severity === 'critical') {
        after(90, () => setSignal('unstable'))
        after(Math.round(ev.ms * 0.45), () => setSignal('lost'))
      }

      after(ev.ms, () => {
        delete el.dataset.glitch
        if (ev.severity === 'micro') {
          delete el.dataset.severity
          busy = false
          return
        }
        el.dataset.recover = '1'
        setSignal('recovering')
        after(RECOVERY_MS, () => {
          delete el.dataset.recover
          delete el.dataset.severity
          setSignal('stable')
          busy = false
        })
      })
    }

    /** Weighted severity, with a floor on how often the big ones may return. */
    const nextEvent = (): ErrorEvent => {
      const now = performance.now()
      const roll = Math.random()
      let severity: Severity = 'micro'
      if (roll < MIX.critical && now - lastOf.critical > SPACING.critical) severity = 'critical'
      else if (roll < MIX.medium && now - lastOf.medium > SPACING.medium) severity = 'medium'
      const pool = reduced ? CALM_EVENTS : EVENTS
      const matching = pool.filter((e) => e.severity === severity)
      return pick(matching.length ? matching : pool.filter((e) => e.severity === 'micro'))
    }

    // ---- scheduler: variable gaps, never an interval ---------------------
    let nextId: number | undefined
    const schedule = () => {
      const base = reduced ? rand(CALM_GAP.min, CALM_GAP.max) : rand(GAP.min, GAP.max)
      const pause = !reduced && Math.random() < LONG_PAUSE.chance ? rand(LONG_PAUSE.min, LONG_PAUSE.max) : 0
      nextId = window.setTimeout(() => {
        if (awake() && !busy) run(nextEvent())
        schedule()
      }, base + pause)
    }
    const startId = after(reduced ? 1200 : seen ? T.quickStable : T.stable, schedule)

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
        if (!reduced && !busy) run(EVENTS.find((e) => e.kind === 'medium-tear')!)
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

    // Exposed to the component through the ref element, so hover/tap can fire
    // exactly one micro event without re-rendering React on every pointer move.
    let lastNudge = 0
    const nudge = () => {
      if (reduced || busy || el.dataset.phase !== 'stable') return
      const now = performance.now()
      if (now - lastNudge < 2600) return
      lastNudge = now
      run(pick(EVENTS.filter((e) => e.severity === 'micro')))
    }
    nudgeRef.current = nudge

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.clearTimeout(startId)
      window.clearTimeout(nextId)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      nudgeRef.current = () => {}
      delete el.dataset.glitch
      delete el.dataset.severity
      delete el.dataset.recover
    }
  }, [])

  return { ref, ...state, nudge }
}
