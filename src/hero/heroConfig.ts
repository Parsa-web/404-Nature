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
 *   alert (the archive's error red)   a colour cue, not a displacement
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
  /** Error red. 1 = the archive flags a fault, 2 = the record is lost. */
  alert: 0 | 1 | 2
}

export const CALM_LAYERS: Layers = {
  tear: 0,
  frag: 0,
  glyph: 0,
  scan: 0,
  rgb: 0,
  grain: 0,
  alert: 0,
}

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
  /* ===================== A — MICRO ANOMALY · ~2s ======================
     Six variants, so the small stuff never starts to feel like a loop. */
  {
    id: 'micro-slice',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 26000,
    recoverMs: 0,
    fragments: 0,
    calm: [5000, 8000],
    frames: [
      { at: 0, beat: 'detect', tear: 1 },
      { at: 600, tear: 2 },
      { at: 1000, tear: 0 },
      { at: 1350, tear: 2, glyph: 1 },
      { at: 1900, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-ghost',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 26000,
    recoverMs: 0,
    fragments: 0,
    calm: [5000, 8000],
    frames: [
      { at: 0, beat: 'detect', scan: 1, grain: 1 },
      { at: 700, scan: 2 },
      { at: 1200, glyph: 1, tear: 1 },
      { at: 1700, scan: 2, tear: 2, grain: 1 },
      { at: 2200, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-glyph',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 26000,
    recoverMs: 0,
    fragments: 0,
    calm: [5000, 8000],
    frames: [
      { at: 0, beat: 'detect', glyph: 1 },
      { at: 550, glyph: 2 },
      { at: 1000, glyph: 0 },
      { at: 1400, glyph: 2, tear: 1 },
      { at: 2000, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-dropout',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 26000,
    recoverMs: 0,
    fragments: 0,
    calm: [5000, 8000],
    frames: [
      // Two strips of the record simply go missing for a moment.
      { at: 0, beat: 'fail', tear: 3, alert: 1 },
      { at: 320, beat: 'detect', tear: 1, alert: 0 },
      { at: 900, beat: 'fail', tear: 3, glyph: 1, alert: 1 },
      { at: 1200, beat: 'detect', tear: 1, alert: 0 },
      { at: 1800, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-fault',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 26000,
    recoverMs: 0,
    fragments: 0,
    calm: [5000, 8000],
    frames: [
      // The archive flags a fault in red, then decides it was nothing.
      { at: 0, beat: 'detect', status: 'frame', alert: 1, grain: 1 },
      { at: 700, tear: 1, glyph: 1, rgb: 1 },
      { at: 1300, tear: 2, alert: 1 },
      { at: 1800, alert: 0 },
      { at: 2200, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'micro-record',
    state: 'MICRO_ANOMALY',
    weight: 10,
    cooldown: 30000,
    recoverMs: 0,
    fragments: 1,
    calm: [5000, 8000],
    frames: [
      // One wrong record surfaces for a second and is gone again.
      { at: 0, beat: 'detect', scan: 1 },
      { at: 500, frag: 1, status: 'wrong', record: 'wrong' },
      { at: 1400, frag: 1, tear: 1, alert: 1 },
      { at: 2000, frag: 0, alert: 0 },
      { at: 2400, ...calm, beat: 'calm', record: 'incomplete' },
    ],
  },

  /* ===================== B — FRAME BREAK · 5.4-6.2s ==================== */
  {
    id: 'frame-break',
    state: 'FRAME_BREAK',
    weight: 14,
    cooldown: 34000,
    recoverMs: 1400,
    fragments: 0,
    calm: [6000, 9000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 800, beat: 'detect', tear: 1, scan: 1 },
      { at: 1600, beat: 'escalate', status: 'frame', tear: 2, alert: 1, record: 'corrupt' },
      { at: 2400, tear: 2, glyph: 1, scan: 2 },
      { at: 3200, tear: 3, glyph: 2, alert: 1 },
      { at: 3900, beat: 'fail', status: 'unstable', tear: 3, glyph: 2, grain: 2, alert: 2 },
      { at: 4700, beat: 'hold', tear: 3, glyph: 2, scan: 2, grain: 2, alert: 2 },
      { at: 5400, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'frame-break-cascade',
    state: 'FRAME_BREAK',
    weight: 14,
    cooldown: 34000,
    recoverMs: 1500,
    fragments: 0,
    calm: [6000, 9000],
    frames: [
      // The frame does not break at once: one region goes, then the next.
      { at: 0, beat: 'anticipate', status: 'detected', scan: 1 },
      { at: 700, beat: 'detect', tear: 1 },
      { at: 1300, beat: 'escalate', tear: 2, alert: 1 },
      { at: 1800, tear: 1, glyph: 1 },
      { at: 2400, status: 'frame', tear: 3, record: 'corrupt', alert: 1 },
      { at: 3000, tear: 2, glyph: 2, rgb: 1 },
      { at: 3700, beat: 'fail', status: 'unstable', tear: 3, glyph: 2, alert: 2, grain: 2 },
      { at: 4600, beat: 'hold', tear: 3, glyph: 3, scan: 2, alert: 2 },
      { at: 5500, tear: 2, glyph: 2, alert: 1 },
      { at: 6200, ...calm, beat: 'calm' },
    ],
  },

  /* ================= C — WRONG IMAGE FRAGMENT · 6.6-7.2s ============== */
  {
    id: 'wrong-image',
    state: 'WRONG_IMAGE',
    weight: 12,
    cooldown: 44000,
    recoverMs: 1600,
    fragments: 1,
    calm: [6000, 9000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 800, beat: 'detect', frag: 1, scan: 1 },
      { at: 1700, beat: 'escalate', status: 'wrong', frag: 2, record: 'wrong', alert: 1 },
      { at: 2600, frag: 2, tear: 1, glyph: 1 },
      { at: 3400, frag: 3, tear: 2, glyph: 1, alert: 1 },
      { at: 4200, status: 'unstable', tear: 2, glyph: 2, scan: 2 },
      { at: 5000, beat: 'fail', status: 'lost', frag: 3, tear: 3, glyph: 2, grain: 2, alert: 2 },
      { at: 5900, beat: 'hold', tear: 3, glyph: 3, frag: 3, alert: 2 },
      { at: 6600, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'wrong-image-sweep',
    state: 'WRONG_IMAGE',
    weight: 12,
    cooldown: 44000,
    recoverMs: 1600,
    fragments: 2,
    calm: [6000, 9000],
    frames: [
      // The archive scans, finds the wrong file, and keeps opening it.
      { at: 0, beat: 'anticipate', status: 'searching', scan: 2 },
      { at: 900, beat: 'detect', status: 'detected', scan: 2, tear: 1 },
      { at: 1800, status: 'wrong', frag: 1, record: 'wrong', alert: 1 },
      { at: 2500, beat: 'escalate', frag: 2, glyph: 1 },
      { at: 3200, frag: 1, tear: 2, alert: 1 },
      { at: 3900, frag: 3, tear: 2, glyph: 2, rgb: 1 },
      { at: 4700, status: 'unstable', tear: 3, glyph: 2, alert: 2 },
      { at: 5500, beat: 'fail', status: 'lost', tear: 3, glyph: 3, grain: 2, alert: 2 },
      { at: 6400, beat: 'hold', tear: 2, glyph: 3, frag: 3, alert: 2 },
      { at: 7200, ...calm, beat: 'calm' },
    ],
  },

  /* ==================== D — MEMORY LEAK · 7.9-8.6s ==================== */
  {
    id: 'memory-leak',
    state: 'MEMORY_LEAK',
    weight: 9,
    cooldown: 58000,
    recoverMs: 1800,
    fragments: 2,
    calm: [6500, 10000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1, scan: 1 },
      { at: 900, beat: 'detect', frag: 1, record: 'conflict' },
      { at: 1800, beat: 'escalate', status: 'unstable', frag: 2, tear: 1, alert: 1 },
      { at: 2700, frag: 3, tear: 1, glyph: 1, scan: 2 },
      { at: 3600, frag: 3, tear: 2, glyph: 2, alert: 1 },
      { at: 4500, tear: 2, glyph: 2, rgb: 1 },
      { at: 5400, beat: 'fail', status: 'lost', frag: 3, tear: 3, glyph: 3, grain: 2, alert: 2 },
      { at: 6400, beat: 'hold', tear: 3, glyph: 3, frag: 3, scan: 2, alert: 2 },
      { at: 7300, tear: 2, glyph: 3, alert: 1 },
      { at: 7900, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'memory-leak-stack',
    state: 'MEMORY_LEAK',
    weight: 9,
    cooldown: 58000,
    recoverMs: 1800,
    fragments: 3,
    calm: [6500, 10000],
    frames: [
      // Old frames pile up one on top of the other and will not clear.
      { at: 0, beat: 'anticipate', status: 'detected', scan: 1 },
      { at: 800, beat: 'detect', frag: 1, record: 'conflict' },
      { at: 1600, frag: 2, tear: 1 },
      { at: 2400, beat: 'escalate', frag: 3, glyph: 1, alert: 1 },
      { at: 3200, status: 'unstable', frag: 3, tear: 2, scan: 2 },
      { at: 4000, frag: 3, tear: 2, glyph: 2, rgb: 1, alert: 1 },
      { at: 4900, tear: 3, glyph: 2, grain: 2 },
      { at: 5800, beat: 'fail', status: 'lost', tear: 3, glyph: 3, alert: 2, grain: 2 },
      { at: 6800, beat: 'hold', tear: 3, glyph: 3, frag: 3, alert: 2 },
      { at: 7800, tear: 2, glyph: 2, alert: 1 },
      { at: 8600, ...calm, beat: 'calm' },
    ],
  },

  /* ================= E — ARCHIVE INTRUSION · 9.0-9.8s ================= */
  {
    id: 'archive-intrusion',
    state: 'ARCHIVE_INTRUSION',
    weight: 8,
    cooldown: 72000,
    recoverMs: 1900,
    fragments: 2,
    calm: [7000, 11000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 1000, beat: 'detect', scan: 2 },
      { at: 1900, status: 'wrong', frag: 1, record: 'wrong', alert: 1 },
      { at: 2800, beat: 'escalate', frag: 2, tear: 1, glyph: 1 },
      { at: 3700, frag: 3, tear: 2, glyph: 1, rgb: 1, alert: 1 },
      { at: 4600, status: 'unstable', tear: 2, glyph: 2, frag: 3 },
      { at: 5500, tear: 3, glyph: 2, scan: 2, grain: 2, alert: 2 },
      { at: 6400, beat: 'fail', status: 'lost', tear: 3, glyph: 3, grain: 2, alert: 2 },
      { at: 7400, beat: 'hold', tear: 3, glyph: 3, frag: 3, alert: 2 },
      { at: 8300, tear: 2, glyph: 3, scan: 2, alert: 1 },
      { at: 9000, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'archive-intrusion-takeover',
    state: 'ARCHIVE_INTRUSION',
    weight: 8,
    cooldown: 72000,
    recoverMs: 2000,
    fragments: 3,
    calm: [7000, 11000],
    frames: [
      // The wrong record does not just appear: it takes the frame over.
      { at: 0, beat: 'anticipate', status: 'searching', scan: 1, grain: 1 },
      { at: 1000, beat: 'detect', status: 'detected', tear: 1, scan: 2 },
      { at: 1900, status: 'wrong', frag: 1, record: 'wrong', alert: 1 },
      { at: 2700, beat: 'escalate', frag: 2, glyph: 1, tear: 1 },
      { at: 3500, frag: 3, tear: 2, glyph: 1, alert: 1 },
      { at: 4300, frag: 3, tear: 1, glyph: 2, rgb: 1, record: 'conflict' },
      { at: 5100, status: 'unstable', tear: 3, glyph: 2, alert: 2 },
      { at: 5900, tear: 2, glyph: 3, frag: 3, grain: 2 },
      { at: 6700, beat: 'fail', status: 'lost', tear: 3, glyph: 3, alert: 2, grain: 2 },
      { at: 7800, beat: 'hold', tear: 3, glyph: 3, frag: 3, scan: 2, alert: 2 },
      { at: 8900, tear: 2, glyph: 2, alert: 1 },
      { at: 9800, ...calm, beat: 'calm' },
    ],
  },

  /* ============== F — CRITICAL SIGNAL FAILURE · 8.2-9.0s ============== */
  {
    id: 'critical-signal-failure',
    state: 'CRITICAL_FAILURE',
    weight: 7,
    cooldown: 88000,
    recoverMs: 2000,
    fragments: 1,
    calm: [7000, 11000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 800, beat: 'detect', tear: 1, scan: 1 },
      { at: 1600, beat: 'escalate', glyph: 1, tear: 1, alert: 1 },
      { at: 2300, tear: 2, glyph: 2, frag: 1 },
      { at: 3000, status: 'unstable', scan: 2, rgb: 1, record: 'corrupt', alert: 1 },
      { at: 3800, tear: 3, glyph: 2, frag: 2 },
      { at: 4600, tear: 3, glyph: 3, grain: 2, alert: 2 },
      { at: 5400, beat: 'fail', status: 'lost', tear: 3, glyph: 3, scan: 2, grain: 2, alert: 2 },
      { at: 6400, beat: 'hold', tear: 3, glyph: 3, alert: 2 },
      { at: 7400, tear: 2, glyph: 3, frag: 2, alert: 1 },
      { at: 8200, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'critical-cascade',
    state: 'CRITICAL_FAILURE',
    weight: 7,
    cooldown: 88000,
    recoverMs: 2000,
    fragments: 2,
    calm: [7000, 11000],
    frames: [
      // Three separate faults land on top of each other.
      { at: 0, beat: 'anticipate', status: 'frame', alert: 1, grain: 1 },
      { at: 900, beat: 'detect', tear: 2, scan: 1 },
      { at: 1500, tear: 0, alert: 0 },
      { at: 2100, beat: 'escalate', status: 'unstable', tear: 2, glyph: 2, alert: 1 },
      { at: 2800, tear: 1, glyph: 0 },
      { at: 3500, frag: 2, tear: 3, glyph: 2, rgb: 1, record: 'corrupt', alert: 1 },
      { at: 4300, tear: 2, glyph: 3, scan: 2, grain: 2 },
      { at: 5100, beat: 'fail', status: 'lost', tear: 3, glyph: 3, alert: 2, grain: 2 },
      { at: 6200, beat: 'hold', tear: 3, glyph: 3, frag: 2, alert: 2 },
      { at: 7200, tear: 2, glyph: 2, alert: 1 },
      { at: 9000, ...calm, beat: 'calm' },
    ],
  },

  /* ============ G — MAJOR ARCHIVE FAILURE · 12.5s · rare =============
     The only event that relapses: the archive appears to come back, then
     loses the record a second time. */
  {
    id: 'major-archive-failure',
    state: 'MAJOR_FAILURE',
    weight: 4,
    cooldown: 160000,
    recoverMs: 2200,
    fragments: 3,
    calm: [10000, 16000],
    frames: [
      { at: 0, beat: 'anticipate', status: 'detected', grain: 1 },
      { at: 1000, beat: 'detect', scan: 1, tear: 1 },
      { at: 1900, status: 'wrong', frag: 1, record: 'wrong', alert: 1 },
      { at: 2800, beat: 'escalate', frag: 2, tear: 1, glyph: 1 },
      { at: 3700, status: 'frame', tear: 2, glyph: 1, scan: 2, record: 'conflict', alert: 1 },
      { at: 4600, frag: 3, tear: 2, glyph: 2, rgb: 1 },
      { at: 5500, status: 'unstable', tear: 3, glyph: 2, grain: 2, record: 'corrupt', alert: 2 },
      { at: 6400, tear: 3, glyph: 3, frag: 3 },
      { at: 7300, beat: 'fail', status: 'lost', tear: 3, glyph: 3, scan: 2, grain: 2, alert: 2 },
      { at: 8300, beat: 'hold', tear: 3, glyph: 3, frag: 3, alert: 2 },
      { at: 9200, tear: 2, glyph: 3, scan: 2, alert: 1 },
      /* relapse */
      { at: 10100, beat: 'escalate', status: 'unstable', tear: 3, glyph: 3, frag: 3, rgb: 1, alert: 2 },
      { at: 11000, beat: 'fail', status: 'lost', tear: 3, glyph: 3, grain: 2, alert: 2 },
      { at: 11900, beat: 'hold', tear: 2, glyph: 3, alert: 2 },
      { at: 12500, ...calm, beat: 'calm' },
    ],
  },
]

/* ---- reduced motion: the same narrative, without displacement ---------- */
export const CALM_EVENTS: readonly HeroEvent[] = [
  {
    id: 'calm-anomaly',
    state: 'MICRO_ANOMALY',
    weight: 30,
    cooldown: 9000,
    recoverMs: 0,
    fragments: 0,
    calm: [8000, 15000],
    frames: [
      { at: 0, beat: 'detect', grain: 1, alert: 1 },
      { at: 1600, ...calm, beat: 'calm' },
    ],
  },
  {
    id: 'calm-signal-loss',
    state: 'CRITICAL_FAILURE',
    weight: 14,
    cooldown: 36000,
    recoverMs: 1600,
    fragments: 1,
    calm: [12000, 22000],
    frames: [
      { at: 0, beat: 'detect', status: 'detected', grain: 1 },
      { at: 1400, beat: 'escalate', status: 'unstable', frag: 1, record: 'corrupt', alert: 1 },
      { at: 3000, beat: 'fail', status: 'lost', frag: 1, alert: 2 },
      { at: 4400, beat: 'hold', alert: 2 },
      { at: 5600, ...calm, beat: 'calm' },
    ],
  },
]

/* ------------------------------------------------------------- scheduler -- */

/** Nothing notable may follow another notable event inside this window. */
export const CALM_AFTER_NOTABLE = 5000
/** Delay between the hero settling and the scheduler's first tick. */
export const FIRST_EVENT_DELAY: readonly [number, number] = [4000, 7000]
/** Fragment images are mounted this long after the intro, so they are decoded. */
export const FRAGMENT_PRELOAD_DELAY = 1200
/** Hover / tap on the number may provoke a micro anomaly at most this often. */
export const NUDGE_COOLDOWN = 5000
/** How many recent event ids the scheduler refuses to repeat. */
export const NO_REPEAT_WINDOW = 4

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
