import { useEffect, useRef, useState } from 'react'
import {
  CALM_AFTER_NOTABLE,
  CALM_EVENTS,
  CALM_LAYERS,
  EVENTS,
  FIRST_EVENT_DELAY,
  FRAGMENT_COUNT,
  FRAGMENT_POSES,
  FRAGMENT_PRELOAD_DELAY,
  FRAGMENT_SOURCES,
  INTRO_FRAMES,
  INTRO_MS,
  INTRO_QUICK_FRAMES,
  INTRO_QUICK_MS,
  NO_REPEAT_WINDOW,
  NUDGE_COOLDOWN,
  type HeroEvent,
  type HeroState,
  type Keyframe,
  type Layers,
  type Level,
  type RecordVerdict,
  type Status,
} from './heroConfig'

/* ---------------------------------------------------------------- helpers */

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))
const clampLevel = (v: number, max: number): Level => Math.max(0, Math.min(max, v)) as Level

/** One wrong-record layer: which archive photograph, and where it bleeds in. */
export interface FragmentSlot {
  src: string
  pose: number
}

export interface HeroArchive {
  ref: React.RefObject<HTMLElement | null>
  /** Coarse machine state, also mirrored onto `data-state` for CSS. */
  state: HeroState
  /** Current diagnostic line; null while the archive is calm. */
  status: Status | null
  record: RecordVerdict
  /** Fragment layers mount lazily, once the hero has settled. */
  fragments: FragmentSlot[] | null
  quick: boolean
  reduced: boolean
  /** Hover / tap on the number: a user-provoked micro anomaly. */
  nudge: () => void
}

/* ========================================================================== *
   404 // UNSTABLE ARCHIVE — the hero's single motion system.

   One state machine, one scheduler, one source of truth. JavaScript never
   animates a pixel: it walks a timeline and writes discrete states onto the
   hero element (data-state, data-beat, data-tear, data-frag, data-glyph,
   data-scan, data-rgb, data-grain). CSS renders those states with transform,
   opacity, clip-path and filter only, so the photograph, the 404 and the
   diagnostic line always fail and recover as one system.

     PHASE A  INTRO_INITIALIZING -> SEARCHING -> DETECTED -> CORRUPTED
              -> SIGNAL_LOST -> RECOVERING -> LOADED_STABLE
     PHASE B  IDLE -> (one event) -> RECOVERING -> IDLE

   Scheduling is event-based with variable gaps — never a fixed interval. One
   event at a time, cooldowns per event type, a calm floor after anything
   notable, paused while the hero is off-screen or the tab is hidden, and
   every timer cleared on unmount.
 * ========================================================================== */

export function useHeroArchive(): HeroArchive {
  const ref = useRef<HTMLElement | null>(null)
  const nudgeRef = useRef<() => void>(() => {})

  /* Read once, at mount. These decide which intro plays, so they must stay
     stable for the life of the hero — recomputing them on a later render
     would change the effect's dependencies and replay the intro mid-flight. */
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [quick] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('hero-archive-seen') === '1',
  )

  const [state, setState] = useState<HeroState>('INTRO_INITIALIZING')
  const [status, setStatus] = useState<Status | null>(null)
  const [record, setRecord] = useState<RecordVerdict>('incomplete')
  const [fragments, setFragments] = useState<FragmentSlot[] | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* ---- timers, all owned here so cleanup can never miss one ---------- */
    const timers = new Set<number>()
    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
      return id
    }
    const clearAll = () => {
      timers.forEach((id) => window.clearTimeout(id))
      timers.clear()
    }

    /* ---- the only writer of hero visual state -------------------------- */
    const ceiling: Layers = reduced
      ? { tear: 1, frag: 1, glyph: 1, scan: 1, rgb: 0, grain: 1, alert: 1 }
      : { tear: 3, frag: 3, glyph: 3, scan: 2, rgb: 1, grain: 2, alert: 2 }

    const layers: Layers = { ...CALM_LAYERS }

    const writeLayers = () => {
      el.dataset.tear = String(layers.tear)
      el.dataset.frag = String(layers.frag)
      el.dataset.glyph = String(layers.glyph)
      el.dataset.scan = String(layers.scan)
      el.dataset.rgb = String(layers.rgb)
      el.dataset.grain = String(layers.grain)
      el.dataset.alert = String(layers.alert)
    }

    const applyFrame = (f: Keyframe) => {
      if (f.tear !== undefined) layers.tear = clampLevel(f.tear, ceiling.tear)
      if (f.frag !== undefined) layers.frag = clampLevel(f.frag, ceiling.frag)
      if (f.glyph !== undefined) layers.glyph = clampLevel(f.glyph, ceiling.glyph)
      if (f.scan !== undefined) layers.scan = clampLevel(f.scan, ceiling.scan)
      if (f.rgb !== undefined) layers.rgb = clampLevel(f.rgb, ceiling.rgb) as 0 | 1
      if (f.grain !== undefined) layers.grain = clampLevel(f.grain, ceiling.grain)
      if (f.alert !== undefined) layers.alert = clampLevel(f.alert, ceiling.alert) as 0 | 1 | 2
      writeLayers()
      if (f.beat) el.dataset.beat = f.beat
      if (f.state) {
        el.dataset.state = f.state
        setState(f.state)
      }
      if (f.status) setStatus(f.status)
      if (f.record) setRecord(f.record)
    }

    const toCalm = () => {
      Object.assign(layers, CALM_LAYERS)
      writeLayers()
      el.dataset.beat = 'calm'
    }

    if (reduced) el.dataset.reduced = '1'
    if (quick) el.dataset.quick = '1'
    writeLayers()

    /* ================= PHASE A — cinematic intro ======================= */
    const introFrames = quick || reduced ? INTRO_QUICK_FRAMES : INTRO_FRAMES
    const introMs = quick || reduced ? INTRO_QUICK_MS : INTRO_MS
    introFrames.forEach((f) => after(f.at, () => applyFrame(f)))
    after(introMs + 400, () => {
      sessionStorage.setItem('hero-archive-seen', '1')
      el.dataset.state = 'IDLE'
      setState('IDLE')
      setStatus(null)
    })

    /* Wrong-record layers are decoded during the calm, never mid-event. */
    after(introMs + FRAGMENT_PRELOAD_DELAY, () => setFragments(pickFragments()))

    /* ---- awake only when the hero is actually being looked at ---------- */
    let onScreen = true
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0.12,
    })
    io.observe(el)
    const awake = () => onScreen && !document.hidden

    /* ================= PHASE B — the event scheduler =================== */
    const pool = reduced ? CALM_EVENTS : EVENTS
    const lastRun = new Map<string, number>()
    let lastNotable = -Infinity
    /** Recent ids, newest first. Nothing in here may run again yet. */
    const recent: string[] = []
    let busy = false
    let nextTick: number | undefined

    function pickFragments(): FragmentSlot[] {
      /* Distinct records, distinct positions: an intrusion never repeats. */
      const srcs = [...FRAGMENT_SOURCES].sort(() => Math.random() - 0.5)
      const poses = Array.from({ length: FRAGMENT_POSES }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5,
      )
      return Array.from({ length: FRAGMENT_COUNT }, (_, i) => ({
        src: srcs[i % srcs.length],
        pose: poses[i % poses.length],
      }))
    }

    /** Weighted pick from a list. */
    const weighted = (list: readonly HeroEvent[]): HeroEvent => {
      const total = list.reduce((sum, e) => sum + e.weight, 0)
      let roll = Math.random() * total
      for (const e of list) {
        roll -= e.weight
        if (roll <= 0) return e
      }
      return list[list.length - 1]
    }

    /* Events that may be brought forward rather than letting the hero sit
       silent. The big failures are never relaxed, so they stay special. */
    const RELAXABLE = new Set<HeroState>([
      'MICRO_ANOMALY',
      'FRAME_BREAK',
      'WRONG_IMAGE',
      'MEMORY_LEAK',
    ])

    const choose = (): HeroEvent | null => {
      const now = performance.now()
      const sinceNotable = now - lastNotable
      const fresh = pool.filter((e) => !recent.includes(e.id))
      const strict = fresh.filter((e) => {
        const last = lastRun.get(e.id)
        if (last !== undefined && now - last < e.cooldown) return false
        if (e.state !== 'MICRO_ANOMALY' && sinceNotable < CALM_AFTER_NOTABLE) return false
        return true
      })
      if (strict.length) return weighted(strict)
      /* Nothing is due yet. Rather than leave a long dead gap, bring forward
         the least recently seen of the everyday events. */
      const relaxed = fresh.filter((e) => RELAXABLE.has(e.state))
      if (relaxed.length) {
        const oldest = Math.min(...relaxed.map((e) => lastRun.get(e.id) ?? -Infinity))
        return weighted(relaxed.filter((e) => (lastRun.get(e.id) ?? -Infinity) === oldest))
      }
      return fresh.length ? weighted(fresh) : null
    }

    /** Runs one event timeline, its recovery tail, then hands back to IDLE. */
    const run = (ev: HeroEvent) => {
      if (busy) return
      busy = true
      const now = performance.now()
      lastRun.set(ev.id, now)
      recent.unshift(ev.id)
      /* Keep the window smaller than the pool, or nothing would ever qualify. */
      while (recent.length > Math.min(NO_REPEAT_WINDOW, pool.length - 1)) recent.pop()
      if (ev.state !== 'MICRO_ANOMALY') lastNotable = now

      el.dataset.event = ev.id
      el.dataset.state = ev.state
      setState(ev.state)
      /* Re-roll which records intrude, so no two intrusions look alike. */
      if (ev.fragments > 0) setFragments(pickFragments())

      ev.frames.forEach((f) => after(f.at, () => applyFrame(f)))

      const end = ev.frames[ev.frames.length - 1].at
      after(end, () => {
        toCalm()
        if (!ev.recoverMs) {
          delete el.dataset.event
          el.dataset.state = 'IDLE'
          setState('IDLE')
          setStatus(null)
          busy = false
          schedule(ev)
          return
        }
        /* Recovery is slower than the break: sharp failure, controlled return. */
        el.dataset.state = 'RECOVERING'
        el.dataset.beat = 'recover'
        setState('RECOVERING')
        setStatus('recovering')
        after(ev.recoverMs, () => {
          delete el.dataset.event
          el.dataset.beat = 'calm'
          el.dataset.state = 'IDLE'
          setState('IDLE')
          setStatus(null)
          setRecord('incomplete')
          busy = false
          schedule(ev)
        })
      })
    }

    /** Variable, never an interval. The gap belongs to the event that ran. */
    const schedule = (previous?: HeroEvent) => {
      const [min, max] = previous ? previous.calm : FIRST_EVENT_DELAY
      nextTick = window.setTimeout(() => {
        if (!awake() || busy) {
          /* Asleep: look again shortly rather than firing into a hidden tab. */
          schedule(previous)
          return
        }
        const ev = choose()
        if (ev) run(ev)
        else schedule(previous)
      }, rand(min, max))
    }
    const bootId = after(introMs + 600, () => schedule())

    /* ---- leaving the hero: lift it away, nothing more ------------------ */
    let ticking = false
    let lastOut = -1
    const write = () => {
      ticking = false
      const p = Math.min(1, Math.max(0, window.scrollY / ((el.offsetHeight || 1) * 0.85)))
      const v = Math.round(p * 100) / 100
      if (v === lastOut) return
      lastOut = v
      el.style.setProperty('--ho', String(v))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(write)
    }
    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    /* ---- user-provoked micro anomaly ----------------------------------- */
    let lastNudge = -Infinity
    nudgeRef.current = () => {
      if (reduced || busy || el.dataset.state !== 'IDLE') return
      const now = performance.now()
      if (now - lastNudge < NUDGE_COOLDOWN) return
      lastNudge = now
      const micros = pool.filter((e) => e.state === 'MICRO_ANOMALY')
      if (!micros.length) return
      window.clearTimeout(nextTick)
      run(micros[randInt(0, micros.length - 1)])
    }

    return () => {
      clearAll()
      window.clearTimeout(bootId)
      window.clearTimeout(nextTick)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      nudgeRef.current = () => {}
      for (const key of [
        'state',
        'beat',
        'event',
        'tear',
        'frag',
        'glyph',
        'scan',
        'rgb',
        'grain',
        'alert',
        'quick',
        'reduced',
      ]) {
        delete el.dataset[key]
      }
    }
  }, [quick, reduced])

  return {
    ref,
    state,
    status,
    record,
    fragments,
    quick,
    reduced,
    nudge: () => nudgeRef.current(),
  }
}
