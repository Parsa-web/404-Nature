export type EcosystemType = 'lake' | 'wetland' | 'river' | 'forest' | 'habitat'

/**
 * The archive has exactly four verdicts. Every record carries one, and a record
 * can only move between them when a documented source says so.
 */
export type ArchiveStatus = 'lost' | 'failing' | 'at-risk' | 'recovering'

export interface ArchiveStatusMeta {
  /** Short Persian label shown next to a record. */
  label: string
  /** The archive's own machine code, shown in Latin. */
  code: string
  /** Reuses the existing status-dot palette. */
  tone: 'lost' | 'critical' | 'changing' | 'recovering'
  /** One line that defines the verdict, not the place. */
  meaning: string
}

export const ARCHIVE_STATUS: Record<ArchiveStatus, ArchiveStatusMeta> = {
  lost: {
    label: 'از دست‌رفته',
    code: 'LOST',
    tone: 'lost',
    meaning:
      'پهنه یا زیستگاه اصلی دیگر وجود ندارد. آنچه مانده، بستر خشک یا باقی‌مانده‌ای است که کارکرد اکولوژیک پیشین را ندارد.',
  },
  failing: {
    label: 'در حال فروپاشی',
    code: 'FAILING',
    tone: 'critical',
    meaning:
      'سامانه هنوز کار می‌کند، اما روند افت ثبت‌شده و ادامه‌دار است. بدون تغییر در مدیریت آب، مقصد این مسیر «از دست‌رفته» است.',
  },
  'at-risk': {
    label: 'در خطر',
    code: 'AT RISK',
    tone: 'changing',
    meaning:
      'اکوسیستم هنوز زنده و نسبتاً کامل است، اما فشار مستند و هشدار رسمی وجود دارد. اینجا جایی است که پیشگیری هنوز ارزان‌تر از احیا است.',
  },
  recovering: {
    label: 'در حال بازیابی',
    code: 'RECOVERING',
    tone: 'recovering',
    meaning:
      'بازگشت سنجش‌پذیر و پایدار، تأییدشده با داده. این سخت‌ترین وضعیت برای رسیدن است و آرشیو آن را بدون سند صادر نمی‌کند.',
  },
}

export interface Source {
  title: string
  organization: string
  year: string
  url: string
  topic: SourceTopic
}

export type SourceTopic = 'water' | 'forest' | 'biodiversity' | 'wetland' | 'climate'

export interface ImageRef {
  /** Wikimedia Commons file name, resolved through `commons()`. */
  file: string
  alt: string
  credit: string
}

export interface Comparison {
  before: ImageRef
  after: ImageRef
  beforeLabel: string
  afterLabel: string
  /** Shown under the slider when the two frames are not a strict same-angle pair. */
  note: string
}

export interface Location {
  id: string
  slug: string
  name: string
  latinName: string
  province: string
  type: EcosystemType
  /** The archive's formal verdict on this record. */
  archiveStatus: ArchiveStatus
  /** Free-text status line shown on cards. */
  status: string
  statusTone: 'critical' | 'changing' | 'fragile' | 'lost' | 'recovering'
  summary: string
  intro: string
  cover: ImageRef
  gallery: ImageRef[]
  comparison: Comparison
  /* The seven questions every case file in this archive answers, in order. */
  whatWasHere: string[]
  whatChanged: string[]
  why: string[]
  whatWasLost: string[]
  affected: string[]
  whatRemains: string[]
  canItRecover: string[]
  facts: { label: string; value: string; context: string; sourceUrl: string }[]
  sources: Source[]
  related: string[]
  keywords: string[]
}

/**
 * A species record is not an encyclopedia entry. It exists because the state of
 * the species is readable evidence about the state of a place in this archive.
 */
export interface Animal {
  id: string
  name: string
  latinName: string
  habitat: string
  /** The environmental pressure, named precisely — not a generic threat list. */
  pressure: string
  /** What the decline of this species proves about the ecosystem around it. */
  evidence: string
  ecologicalRole: string
  conservation: string
  body: string
  /** Case file this species reads as evidence for, if any. */
  linkedSlug?: string
  image: ImageRef
  sourceUrl: string
  keywords: string[]
}

export const TYPE_LABEL: Record<EcosystemType, string> = {
  lake: 'دریاچه',
  wetland: 'تالاب',
  river: 'رودخانه',
  forest: 'جنگل',
  habitat: 'زیستگاه',
}
