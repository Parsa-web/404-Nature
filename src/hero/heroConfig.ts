/* ============================================================================
   404 // UNSTABLE ARCHIVE — configuration
   One place for every timing, level, asset and event timeline used by the hero
   motion system. Nothing in the hero is allowed to invent its own number.
   ========================================================================== */

import { IMAGES } from '../utils/images'

/* -------------------------------------------------------------- states --- */

export type HeroState =
  | 'INTRO_INITIALIZING'
  | 'INTRO_SEARCHING'
  | 'INTRO_DETECTED'
  | 'INTRO_CORRUPTED'
  | 'INTRO_SIGNAL_LOST'
  | 'INTRO_RECOVERING'
  | 'LOADED_STABLE'
  | 'IDLE'
  | 'MICRO_ANOMALY'
  | 'FRAME_BREAK'
  | 'WRONG_IMAGE'
  | 'MEMORY_LEAK'
  | 'ARCHIVE_INTRUSION'
  | 'CRITICAL_FAILURE'
  | 'MAJOR_FAILURE'
  | 'RECOVERING'

/** The dramatic beat inside a state. Every long event walks this ladder. */
export type Beat = 'calm' | 'anticipate' | 'detect' | 'escalate' | 'fail' | 'hold' | 'recover'

/** Diagnostic line. One message at a time — never a HUD. */
export type Status =
  | 'searching'
  | 'detected'
  | 'wrong'
  | 'frame'
  | 'unstable'
  | 'lost'
  | 'recovering'
  | 'incomplete'
  | 'stable'

export const STATUS_TEXT: Record<Status, string> = {
  searching: 'در حال جست‌وجوی آرشیو…',
  detected: 'سیگنال دریافت شد',
  wrong: 'رکورد نادرست',
  frame: 'فریم مخدوش',
  unstable: 'سیگنال ناپایدار',
  lost: 'سیگنال قطع شد',
  recovering: 'در حال بازیابی…',
  incomplete: 'رکورد ناقص',
  stable: 'پایدار',
}

/** Short value shown in the diagnostic metadata rows. */
export const SIGNAL_TEXT: Record<Status, string> = {
  searching: 'جست‌وجو',
  detected: 'دریافت شد',
  wrong: 'ناپایدار',
  frame: 'ناپایدار',
  unstable: 'ناپایدار',
  lost: 'قطع',
  recovering: 'بازیابی',
  incomplete: 'ناقص',
  stable: 'پایدار',
}

export const RECORD_TEXT = {
  incomplete: 'ناقص',
  wrong: 'رکورد نادرست',
  corrupt: 'مخدوش',
  conflict: 'تداخل حافظه',
} as const
export type RecordVerdict = keyof typeof RECORD_TEXT

/* -------------------------------------------------------------- levels --- */
/**
 * Effect intensity, in the priority order the hero must respect:
 *   tear  (horizontal displacement)   primary
 *   frag  (wrong image fragments)     secondary
 *   glyph (404 fragmentation)         third
 *   scan  (scanlines / ghost frame)   fourth
 *   rgb   (chromatic separation)      fifth, deliberately capped at 1
 *   grain (noise)                     sixth
 * CSS reads these as numbers and scales one shared displacement unit.
 */
export type Level = 0 | 1 | 2 | 3

export interface Layers {
  tear: Level
  frag: Level
  glyph: Level
  scan: Level
  rgb: 0 | 1
  grain: Level
}

export const CALM_LAYERS: Layers = { tear: 0, frag: 0, glyph: 0, scan: 0, rgb: 0, grain: 0 }

/* ------------------------------------------------------------- timeline --- */

export interface Keyframe extends Partial<Layers> {
  /** Offset from the start of the sequence, in ms. */
  at: number
  state?: HeroState
  beat?: Beat
  status?: Status
  record?: RecordVerdict
}

export interface HeroEvent {
  id: string
  state: HeroState
  /** Relative likelihood when the scheduler picks the next event. */
  weight: number
  /** Soonest this event may return, in ms. */
  cooldown: number
  /** Visible RECOVERING tail after the last keyframe. */
  recoverMs: number
  /** How many wrong-record fragments this event needs decoded. */
  fragments: 0 | 1 | 2 | 3
  /** Calm window that follows, in ms. */
  calm: readonly [number, number]
  frames: readonly Keyframe[]
}

/* ========================================================================== *
   PHASE A — CINEMATIC INTRO (~9.4s)
   0.0 initializing · 1.0 searching · 2.0 signal detected · 3.0 404 detected
   4.5 corrupted reveal · 6.0 signal lost · 7.0 recovering · 9.2 loaded
 * ========================================================================== */

export const INTRO_FRAMES: readonly Keyframe[] = [
  { at: 0, state: 'INTRO_INITIALIZING', beat: 'calm', grain: 1 },
  { at: 1000, state: 'INTRO_SEARCHING', beat: 'anticipate', status: 'searching', scan: 1, grain: 1 },
  { at: 2000, state: 'INTRO_DETECTED', beat: 'detect', status: 'detected', tear: 1, scan: 1, grain: 1 },
  { at: 3000, beat: 'escalate', glyph: 1, tear: 1, scan: 2, grain: 1 },
  { at: 3900, glyph: 2, tear: 1 },
  { at: 4500, state: 'INTRO_CORRUPTED', beat: 'escalate', status: 'unstable', tear: 2, glyph: 2, scan: 2, rgb: 1, grain: 2, record: 'corrupt' },
  { at: 5200, tear: 3, glyph: 3 },
  { at: 5600, tear: 2, glyph: 2 },
  { at: 6000, state: 'INTRO_SIGNAL_LOST', beat: 'fail', status: 'lost', tear: 3, glyph: 3, scan: 2, rgb: 1, grain: 2 },
  { at: 6600, beat: 'hold', tear: 2, glyph: 3 },
  { at: 7000, state: 'INTRO_RECOVERING', beat: 'recover', status: 'recovering', tear: 1, glyph: 1, scan: 1, rgb: 0, grain: 1 },
  { at: 8200, tear: 0, glyph: 0, scan: 0, grain: 1, record: 'incomplete' },
  { at: 9200, state: 'LOADED_STABLE', beat: 'calm', status: 'incomplete', grain: 0 },
]

/** Returning within the same session: the same story, compressed. */
export const INTRO_QUICK_FRAMES: readonly Keyframe[] = [
  { at: 0, state: 'INTRO_INITIALIZING', beat: 'calm', grain: 1 },
  { at: 260, state: 'INTRO_DETECTED', beat: 'detect', status: 'detected', tear: 1, scan: 1 },
  { at: 700, state: 'INTRO_CORRUPTED', beat: 'escalate', status: 'unstable', tear: 2, glyph: 2, scan: 1 },
  { at: 1150, state: 'INTRO_SIGNAL_LOST', beat: 'fail', status: 'lost', tear: 3, glyph: 3 },
  { at: 1550, state: 'INTRO_RECOVERING', beat: 'recover', status: 'recovering', tear: 1, glyph: 1, scan: 0 },
  { at: 2200, state: 'LOADED_STABLE', beat: 'calm', status: 'incomplete', ...CALM_LAYERS },
]

export const INTRO_MS = 9200
export const INTRO_QUICK_MS = 2200

/* ========================================================================== *
   PHASE B — POST-LOAD UNSTABLE ARCHIVE
   Seven distinct event types. Every long one runs
   anticipation -> detection -> escalation -> failure -> hold -> recovery.
 * ========================================================================== */

const calm = CALM_LAYERS

export const EVENTS: readonly HeroEvent[] = [
  /* ---- A — MICRO ANOMALY · 0.8–1.5s · one or two symptoms only ---------- */
  {
    id: 'micro-slice',
    state: 'MICRO_ANOMALY',
    weight: 46,
    cooldown: 9000,
    recoverMs: 0,
    fragments: 0,
    calm: [10000, 20000],
    frames: [
      { at: 0, beat: 'detect', tear: 1 },
      { at: 520, tear: 0 },
      { at: 760, tear: 1, glyph: 1 },
      { at: 1180, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-ghost',
    state: 'MICRO_ANOMALY',
    weight: 34,
    cooldown: 11000,
    recoverMs: 0,
    fragments: 0,
    calm: [10000, 20000],
    frames: [
      { at: 0, beat: 'detect', scan: 1, grain: 1 },
      { at: 600, scan: 2 },
      { at: 980, glyph: 1 },
      { at: 1400, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-glyph',
    state: 'MICRO_ANOMALY',
    weight: 30,
    cooldown: 13000,
    recoverMs: 0,
    fragments: 0,
    calm: [10000, 20000],
    frames: [
      { at: 0, beat: 'detect', glyph: 1 },
      { at: 420, glyph: 0 },
      { at: 700, glyph: 1, tear: 1 },
      { at: 1100, ...calm, beat: 'calm' },
    ],
  },

  /* ---- B — FRAME BREAK · 2–4s · one region of the photograph lets go ---- */
  {
    id: 'frame-break',
    state: 'FRAME_BREAK',
    weight: 22,
    cooldown: 52000,
    recoverMs: 1200,
    fragments: 0,
    calm: [12000, 24000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 600, beat: 'detect', tear: 1, scan: 1 },
      { at: 1200, beat: 'escalate', status: 'frame', tear: 2, record: 'corrupt' },
      { at: 1900, tear: 2, glyph: 1, scan: 2 },
      { at: 2500, beat: 'fail', status: 'unstable', tear: 3, glyph: 2 },
      { at: 3100, beat: 'hold', tear: 3, glyph: 2, grain: 2 },
      { at: 3600, ...calm, beat: 'calm' },
    ],
  },

  /* ---- C — WRONG IMAGE FRAGMENT · 3–5s --------------------------------- */
  {
    id: 'wrong-image',
    state: 'WRONG_IMAGE',
    weight: 17,
    cooldown: 68000,
    recoverMs: 1400,
    fragments: 1,
    calm: [15000, 30000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 700, beat: 'detect', frag: 1, scan: 1 },
      { at: 1400, beat: 'escalate', status: 'wrong', frag: 2, record: 'wrong' },
      { at: 2100, frag: 2, tear: 1, glyph: 1 },
      { at: 2800, beat: 'fail', status: 'unstable', frag: 3, tear: 2, glyph: 2 },
      { at: 3600, beat: 'hold', frag: 3, tear: 2, glyph: 2, grain: 2 },
      { at: 4300, ...calm, beat: 'calm' },
    ],
  },

  /* ---- D — MEMORY LEAK · 3–6s · older records will not clear ------------ */
  {
    id: 'memory-leak',
    state: 'MEMORY_LEAK',
    weight: 13,
    cooldown: 95000,
    recoverMs: 1600,
    fragments: 2,
    calm: [15000, 30000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1, scan: 1 },
      { at: 800, beat: 'detect', frag: 1, record: 'conflict' },
      { at: 1700, beat: 'escalate', status: 'unstable', frag: 2, tear: 1 },
      { at: 2600, frag: 3, tear: 1, glyph: 1, scan: 2 },
      { at: 3400, frag: 3, tear: 2, glyph: 2 },
      { at: 4100, beat: 'fail', status: 'lost', frag: 3, tear: 3, glyph: 2, grain: 2 },
      { at: 4900, beat: 'hold', tear: 2, glyph: 2, frag: 3 },
      { at: 5500, ...calm, beat: 'calm' },
    ],
  },

  /* ---- E — ARCHIVE INTRUSION · 4–7s · a wrong record walks in ----------- */
  {
    id: 'archive-intrusion',
    state: 'ARCHIVE_INTRUSION',
    weight: 11,
    cooldown: 115000,
    recoverMs: 1700,
    fragments: 2,
    calm: [20000, 40000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 900, beat: 'detect', scan: 2 },
      { at: 1600, status: 'wrong', frag: 1, record: 'wrong' },
      { at: 2400, beat: 'escalate', frag: 2, tear: 1, glyph: 1 },
      { at: 3200, frag: 3, tear: 2, glyph: 1, rgb: 1 },
      { at: 4000, status: 'unstable', tear: 2, glyph: 2, frag: 3 },
      { at: 4800, beat: 'fail', status: 'lost', tear: 3, glyph: 3, grain: 2 },
      { at: 5600, beat: 'hold', tear: 2, glyph: 3, frag: 3 },
      { at: 6400, ...calm, beat: 'calm' },
    ],
  },

  /* ---- F — CRITICAL SIGNAL FAILURE · 4–6s ------------------------------- */
  {
    id: 'critical-signal-failure',
    state: 'CRITICAL_FAILURE',
    weight: 9,
    cooldown: 150000,
    recoverMs: 1800,
    fragments: 1,
    calm: [25000, 45000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 700, beat: 'detect', tear: 1, scan: 1 },
      { at: 1400, beat: 'escalate', glyph: 1, tear: 1 },
      { at: 2000, tear: 2, glyph: 2, frag: 1 },
      { at: 2600, status: 'unstable', scan: 2, rgb: 1, record: 'corrupt' },
      { at: 3300, tear: 3, glyph: 2, frag: 2 },
      { at: 4000, beat: 'fail', status: 'lost', tear: 3, glyph: 3, grain: 2 },
      { at: 4900, beat: 'hold', tear: 2, glyph: 3 },
      { at: 5600, ...calm, beat: 'calm' },
    ],
  },

  /* ---- G — MAJOR ARCHIVE FAILURE · 6–9s · rare, and it should feel it --- */
  {
    id: 'major-archive-failure',
    state: 'MAJOR_FAILURE',
    weight: 2,
    cooldown: 420000,
    recoverMs: 2000,
    fragments: 3,
    calm: [30000, 60000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 900, beat: 'detect', scan: 1, tear: 1 },
      { at: 1700, status: 'wrong', frag: 1, record: 'wrong' },
      { at: 2500, beat: 'escalate', frag: 2, tear: 1, glyph: 1 },
      { at: 3300, status: 'frame', tear: 2, glyph: 1, scan: 2, record: 'conflict' },
      { at: 4100, frag: 3, tear: 2, glyph: 2, rgb: 1 },
      { at: 4900, status: 'unstable', tear: 3, glyph: 2, grain: 2, record: 'corrupt' },
      { at: 5700, tear: 3, glyph: 3, frag: 3 },
      { at: 6500, beat: 'fail', status: 'lost', tear: 3, glyph: 3, scan: 2, grain: 2 },
      { at: 7500, beat: 'hold', tear: 2, glyph: 3, frag: 3 },
      { at: 8400, ...calm, beat: 'calm' },
    ],
  },
]

/* ---- reduced motion: the same narrative, without displacement ---------- */
export const CALM_EVENTS: readonly HeroEvent[] = [
  {
    id: 'calm-anomaly',
    state: 'MICRO_ANOMALY',
    weight: 40,
    cooldown: 18000,
    recoverMs: 0,
    fragments: 0,
    calm: [18000, 34000],
    frames: [
      { at: 0, beat: 'detect', grain: 1 },
      { at: 900, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'calm-signal-loss',
    state: 'CRITICAL_FAILURE',
    weight: 10,
    cooldown: 90000,
    recoverMs: 1400,
    fragments: 1,
    calm: [30000, 55000],
    frames: [
      { at: 0, beat: 'detect', status: 'detected', grain: 1 },
      { at: 1100, beat: 'escalate', status: 'unstable', frag: 1, record: 'corrupt' },
      { at: 2400, beat: 'fail', status: 'lost', frag: 1 },
      { at: 3400, beat: 'hold' },
      { at: 4200, ...calm, beat: 'calm' },
    ],
  },
]

/* ------------------------------------------------------------- scheduler -- */

/** Nothing notable may follow another notable event inside this window. */
export const CALM_AFTER_NOTABLE = 30000
/** Delay between the hero settling and the scheduler's first tick. */
export const FIRST_EVENT_DELAY: readonly [number, number] = [14000, 26000]
/** Fragment images are mounted this long after the intro, so they are decoded. */
export const FRAGMENT_PRELOAD_DELAY = 4000
/** Hover / tap on the number may provoke a micro anomaly at most this often. */
export const NUDGE_COOLDOWN = 9000

/* ------------------------------------------------------------- fragments -- */
/**
 * Wrong records. Project photography only — other places in the same
 * documentary world, so an intrusion reads as the archive retrieving the wrong
 * file rather than as decoration.
 */
export const FRAGMENT_SOURCES: readonly string[] = [
  IMAGES.hamounDry,
  IMAGES.hyrcanianB,
  IMAGES.anzali1992,
  IMAGES.zayandehB,
  IMAGES.urmia1984,
]

/** Positions are percentages of the media box, so a piece can never escape. */
export const FRAGMENT_POSES = 4
export const FRAGMENT_COUNT = 3
/** The frame kept "in memory" behind the current record. */
export const GHOST_SOURCE = IMAGES.urmiaIss
