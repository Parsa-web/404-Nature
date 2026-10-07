import { useEffect, useRef, useState } from 'react'

/** Opening phases of the hero, in order. */
export type Phase = 'search' | 'detect' | 'impact' | 'settle' | 'stable'
/** What the signal row of the diagnostic block reports. */
export type Signal = 'stable' | 'detected' | 'unstable' | 'lost' | 'recovering'
/** What the record row reports: the archive's own verdict on the data. */
export type ArchiveRecord = 'incomplete' | 'wrong' | 'corrupt' | 'conflict'
/** How badly the archive is failing. */
export type Severity = 'micro' | 'medium' | 'critical' | 'intrusion' | 'major'

export interface SignalState {
  phase: Phase
  signal: Signal
  record: ArchiveRecord
  /** Which archive fragments are currently bleeding into the hero. */
  fragment: 'none' | 'one' | 'two' | 'all'
  /** Fragment layers are mounted lazily, once the hero has settled. */
  fragmentsReady: boolean
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
   One catalogue, one scheduler, one source of truth for hero state.

   Every event is a small timeline of steps. A step writes a CSS state onto the
   hero element (`data-glitch`, `data-fragment`, `data-recover`) or updates the
   diagnostic rows. Short events are two or three steps; archive failures run
   through detection -> instability -> corruption -> failure -> hold ->
   recovery over several seconds, so the viewer can actually read them.

   JS never animates a pixel: it only switches states that CSS renders with
   transform / opacity / clip-path / filter.
   ------------------------------------------------------------------------- */

interface Step {
  /** Offset from the start of the event, in ms. */
  at: number
  /** `data-glitch` value, or null to clear it. */
  glitch?: string | null
  /** Which wrong-record fragments are visible. */
  fragment?: SignalState['fragment']
  signal?: Signal
  record?: ArchiveRecord
}

interface EventDef {
  id: string
  severity: Severity
  /** Visible recovery after the last step. Longer for the bigger failures. */
  recoverMs: number
  steps: readonly Step[]
}

/** Phase vocabulary shared by every long event (see sequence.css). */
const DETECT = 'seq-detect'
const UNSTABLE = 'seq-unstable'
const CORRUPT = 'seq-corrupt'
const FAIL = 'seq-fail'
const HOLD = 'seq-hold'

const EVENTS: readonly EventDef[] = [
  /* -- level 1: short anomalies, two or three stutters so they register ---- */
  {
    id: 'micro-slice',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-slice' },
      { at: 180, glitch: null },
      { at: 340, glitch: 'micro-slice' },
      { at: 500, glitch: null },
    ],
  },
  {
    id: 'micro-ghost',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-ghost' },
      { at: 260, glitch: null },
      { at: 430, glitch: 'micro-ghost' },
      { at: 620, glitch: null },
    ],
  },
  {
    id: 'micro-scan',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-scan' },
      { at: 620, glitch: 'micro-slice' },
      { at: 760, glitch: null },
    ],
  },
  {
    id: 'micro-glyph',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-glyph' },
      { at: 240, glitch: null },
      { at: 420, glitch: 'micro-glyph' },
      { at: 640, glitch: null },
    ],
  },
  {
    id: 'micro-frame',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-frame' },
      { at: 300, glitch: null },
      { at: 480, glitch: 'micro-frame' },
      { at: 700, glitch: null },
    ],
  },
  {
    id: 'micro-noise',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'micro-noise' },
      { at: 420, glitch: 'micro-scan' },
      { at: 820, glitch: null },
    ],
  },

  /* -- level 2: the number and the photograph fail together --------------- */
  {
    id: 'medium-tear',
    severity: 'medium',
    recoverMs: 900,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 520, glitch: UNSTABLE, signal: 'unstable' },
      { at: 1200, glitch: 'medium-tear' },
      { at: 1720, glitch: UNSTABLE },
      { at: 2250, glitch: 'medium-corruption', record: 'corrupt' },
      { at: 2730, glitch: null },
    ],
  },
  {
    id: 'medium-image',
    severity: 'medium',
    recoverMs: 900,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 600, glitch: 'medium-image', signal: 'unstable' },
      { at: 1160, glitch: UNSTABLE },
      { at: 1800, glitch: 'medium-image', record: 'corrupt' },
      { at: 2360, glitch: null },
    ],
  },
  {
    id: 'broken-frame',
    severity: 'medium',
    recoverMs: 1000,
    steps: [
      // A rectangle of the photograph slips out of the frame, shows a sliver of
      // another record, and snaps back.
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 520, glitch: 'broken-frame', signal: 'unstable', record: 'corrupt' },
      { at: 1250, fragment: 'one' },
      { at: 1700, glitch: CORRUPT },
      { at: 2200, glitch: 'broken-frame', fragment: 'none' },
      { at: 2800, glitch: null },
    ],
  },

  /* -- level 3: the signature signal drop --------------------------------- */
  {
    id: 'critical-signal-loss',
    severity: 'critical',
    recoverMs: 1300,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 700, glitch: UNSTABLE, signal: 'unstable' },
      { at: 1600, glitch: CORRUPT, record: 'corrupt' },
      { at: 2500, glitch: 'critical-signal-loss' },
      { at: 3650, glitch: FAIL, signal: 'lost' },
      { at: 4300, glitch: HOLD },
      { at: 4900, glitch: null },
    ],
  },
  {
    id: 'critical-frame-corruption',
    severity: 'critical',
    recoverMs: 1300,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 620, glitch: 'medium-corruption', signal: 'unstable' },
      { at: 1300, glitch: CORRUPT, record: 'corrupt' },
      { at: 2200, glitch: 'critical-frame-corruption' },
      { at: 3180, glitch: FAIL, signal: 'lost' },
      { at: 3900, glitch: HOLD },
      { at: 4450, glitch: null },
    ],
  },
  {
    id: 'critical-horizontal-tear',
    severity: 'critical',
    recoverMs: 1300,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 640, glitch: UNSTABLE, signal: 'unstable' },
      { at: 1500, glitch: 'critical-horizontal-tear', record: 'corrupt' },
      { at: 2550, glitch: CORRUPT },
      { at: 3300, glitch: FAIL, signal: 'lost' },
      { at: 4000, glitch: HOLD },
      { at: 4550, glitch: null },
    ],
  },

  /* -- archive intrusions: the wrong record is retrieved ------------------ */
  {
    id: 'wrong-fragment',
    severity: 'intrusion',
    recoverMs: 1300,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 800, fragment: 'one', record: 'wrong' },
      { at: 1600, glitch: UNSTABLE, signal: 'unstable' },
      { at: 2400, fragment: 'two' },
      { at: 3000, glitch: CORRUPT },
      { at: 3700, glitch: FAIL, signal: 'lost' },
      { at: 4300, glitch: HOLD },
      { at: 4900, glitch: null, fragment: 'none' },
    ],
  },
  {
    id: 'archive-intrusion',
    severity: 'intrusion',
    recoverMs: 1500,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 900, glitch: 'micro-scan' },
      { at: 1300, fragment: 'one', record: 'wrong' },
      { at: 2100, glitch: UNSTABLE, signal: 'unstable' },
      { at: 2900, fragment: 'two' },
      { at: 3500, glitch: CORRUPT },
      { at: 4300, glitch: FAIL, signal: 'lost' },
      { at: 5100, glitch: HOLD },
      { at: 5800, glitch: null, fragment: 'none' },
    ],
  },
  {
    id: 'memory-leak',
    severity: 'intrusion',
    recoverMs: 1300,
    steps: [
      // An older record will not clear from memory: two frames overlap.
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 700, fragment: 'one', record: 'conflict' },
      { at: 1500, fragment: 'two', glitch: UNSTABLE, signal: 'unstable' },
      { at: 2300, fragment: 'all' },
      { at: 3000, glitch: CORRUPT },
      { at: 3700, glitch: FAIL, signal: 'lost' },
      { at: 4250, glitch: HOLD },
      { at: 4800, glitch: null, fragment: 'none' },
    ],
  },

  /* -- the rare one ------------------------------------------------------- */
  {
    id: 'major-archive-failure',
    severity: 'major',
    recoverMs: 1700,
    steps: [
      { at: 0, glitch: DETECT, signal: 'detected' },
      { at: 900, fragment: 'one', record: 'wrong' },
      { at: 1700, glitch: UNSTABLE, signal: 'unstable' },
      { at: 2400, fragment: 'two' },
      { at: 3000, glitch: CORRUPT, record: 'corrupt' },
      { at: 3800, glitch: 'critical-horizontal-tear' },
      { at: 4700, fragment: 'all', glitch: CORRUPT },
      { at: 5300, glitch: FAIL, signal: 'lost' },
      { at: 6100, glitch: HOLD },
      { at: 6900, glitch: null, fragment: 'none' },
    ],
  },
]

/** Reduced motion keeps the idea of an error, not its displacement. */
const CALM_EVENTS: readonly EventDef[] = [
  {
    id: 'calm-micro',
    severity: 'micro',
    recoverMs: 0,
    steps: [
      { at: 0, glitch: 'calm-micro' },
      { at: 420, glitch: null },
    ],
  },
  {
    id: 'calm-signal',
    severity: 'medium',
    recoverMs: 700,
    steps: [
      { at: 0, glitch: 'calm-signal', signal: 'unstable', record: 'corrupt' },
      { at: 900, glitch: null },
    ],
  },
  {
    id: 'calm-record',
    severity: 'intrusion',
    recoverMs: 700,
    steps: [
      { at: 0, glitch: 'calm-signal', signal: 'detected', record: 'wrong' },
      { at: 900, fragment: 'one' },
      { at: 2000, signal: 'lost' },
      { at: 2600, glitch: null, fragment: 'none' },
    ],
  },
]

/** Gaps between events. Wide ranges, so the beat is never readable. */
const GAP = { min: 8000, max: 16000 }
/** One wait in four runs much longer: the archive looks settled again. */
const LONG_PAUSE = { chance: 0.26, min: 4000, max: 14000 }
/** Severity mix — calm dominates, and the big failures stay special. */
const MIX = { medium: 0.3, critical: 0.17, intrusion: 0.1, major: 0.03 }
/** No two notable events back to back, whatever their level. */
const CALM_AFTER_EVENT = 30000
/** Minimum spacing per level, in ms. */
const SPACING: Record<Severity, number> = {
  micro: 0,
  medium: 22000,
  critical: 48000,
  intrusion: 40000,
  major: 150000,
}
const CALM_GAP = { min: 16000, max: 30000 }

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <X,>(list: readonly X[]) => list[Math.floor(Math.random() * list.length)]
const endOf = (e: EventDef) => e.steps[e.steps.length - 1].at

/**
 * "404 // UNSTABLE ARCHIVE" — the hero's motion system.
 *
 * Owns one state machine for the whole hero so the number, the environmental
 * image, the intruding archive fragments and the diagnostic rows always fail
 * together: the archive malfunctions, rather than a title having a glitch
 * effect bolted on.
 *
 *   INTRO -> IDLE -> MICRO | MEDIUM | CRITICAL | INTRUSION | MAJOR
 *         -> RECOVERING -> IDLE
 *
 * The intro is untouched. After it completes, a single scheduler runs one
 * event at a time with randomised gaps, weighted heavily towards stability.
 *
 * Scheduling pauses when the hero scrolls out of view or the tab is hidden,
 * events never stack, and every timer is cleared on unmount.
 */
export function useSignal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [state, setState] = useState<SignalState>({
    phase: 'search',
    signal: 'stable',
    record: 'incomplete',
    fragment: 'none',
    fragmentsReady: false,
    quick: false,
  })
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
    const patch = (next: Partial<SignalState>) => setState((s) => ({ ...s, ...next }))

    // ---- opening (approved, do not change) -------------------------------
    const seen = sessionStorage.getItem('signal-seen') === '1' || reduced
    if (reduced) {
      setState((s) => ({ ...s, phase: 'stable', quick: true }))
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

    // ---- one event at a time ---------------------------------------------
    let busy = false
    let lastId = ''
    let lastNotable = 0
    // Seeded so the first visit starts calm: the bigger failures cannot open
    // the session, they have to be waited for.
    const start = performance.now()
    const lastOf: Record<Severity, number> = {
      micro: 0,
      medium: start - SPACING.medium * 0.55,
      critical: start - SPACING.critical * 0.45,
      intrusion: start - SPACING.intrusion * 0.5,
      major: start - SPACING.major * 0.35,
    }

    /** Runs one event timeline, then the visible recovery, then idle. */
    const run = (ev: EventDef) => {
      if (busy) return
      busy = true
      const now = performance.now()
      lastOf[ev.severity] = now
      lastId = ev.id
      if (ev.severity !== 'micro') lastNotable = now
      el.dataset.severity = ev.severity
      el.dataset.event = ev.id

      for (const step of ev.steps) {
        after(step.at, () => {
          if (step.glitch === null) delete el.dataset.glitch
          else if (step.glitch) el.dataset.glitch = step.glitch
          if (step.fragment) {
            if (step.fragment === 'none') delete el.dataset.fragment
            else el.dataset.fragment = step.fragment
          }
          const next: Partial<SignalState> = {}
          if (step.signal) next.signal = step.signal
          if (step.record) next.record = step.record
          if (step.fragment) next.fragment = step.fragment
          if (Object.keys(next).length) patch(next)
        })
      }

      const end = endOf(ev)
      after(end, () => {
        delete el.dataset.glitch
        delete el.dataset.fragment
        if (!ev.recoverMs) {
          delete el.dataset.severity
          delete el.dataset.event
          busy = false
          return
        }
        // Recovery is slower than the failure: sharp break, controlled return.
        el.dataset.recover = '1'
        patch({ signal: 'recovering', fragment: 'none' })
        after(ev.recoverMs, () => {
          delete el.dataset.recover
          delete el.dataset.severity
          delete el.dataset.event
          patch({ signal: 'stable', record: 'incomplete' })
          busy = false
        })
      })
    }

    /** Weighted severity, with a floor on how often each level may return. */
    const nextEvent = (): EventDef => {
      const pool = reduced ? CALM_EVENTS : EVENTS
      const now = performance.now()
      const roll = Math.random()
      const free = (s: Severity) => now - lastOf[s] > SPACING[s] && now - lastNotable > CALM_AFTER_EVENT
      let severity: Severity = 'micro'
      if (roll < MIX.major && free('major')) severity = 'major'
      else if (roll < MIX.intrusion && free('intrusion')) severity = 'intrusion'
      else if (roll < MIX.critical && free('critical')) severity = 'critical'
      else if (roll < MIX.medium && free('medium')) severity = 'medium'
      const matching = pool.filter((e) => e.severity === severity)
      const candidates = matching.length ? matching : pool.filter((e) => e.severity === 'micro')
      // Never run the same event twice in a row, so the failures stay varied.
      const fresh = candidates.filter((e) => e.id !== lastId)
      return pick(fresh.length ? fresh : candidates)
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
    const settle = reduced ? 1200 : seen ? T.quickStable : T.stable
    const startId = after(settle, schedule)
    // Mount the wrong-record fragment layers once the hero is calm, so their
    // files are already decoded before the first intrusion needs them.
    const readyId = after(settle + 4000, () => patch({ fragmentsReady: true }))

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
        if (!reduced && !busy) run(EVENTS.find((e) => e.id === 'micro-slice')!)
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

    let lastNudge = 0
    nudgeRef.current = () => {
      if (reduced || busy || el.dataset.phase !== 'stable') return
      const now = performance.now()
      if (now - lastNudge < 3000) return
      lastNudge = now
      run(pick(EVENTS.filter((e) => e.severity === 'micro')))
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.clearTimeout(startId)
      window.clearTimeout(readyId)
      window.clearTimeout(nextId)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      nudgeRef.current = () => {}
      delete el.dataset.glitch
      delete el.dataset.fragment
      delete el.dataset.severity
      delete el.dataset.event
      delete el.dataset.recover
    }
  }, [])

  return { ref, ...state, nudge }
}
