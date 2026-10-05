export type EcosystemType = 'lake' | 'wetland' | 'river' | 'forest' | 'habitat'

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
  status: string
  statusTone: 'critical' | 'changing' | 'fragile'
  summary: string
  intro: string
  cover: ImageRef
  gallery: ImageRef[]
  comparison: Comparison
  whatHappened: string[]
  whyItMatters: string[]
  humanImpact: string[]
  atRisk: string[]
  solutions: string[]
  facts: { label: string; value: string; context: string; sourceUrl: string }[]
  sources: Source[]
  related: string[]
  keywords: string[]
}

export interface Animal {
  id: string
  name: string
  latinName: string
  habitat: string
  mainThreat: string
  ecologicalRole: string
  conservation: string
  body: string
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
