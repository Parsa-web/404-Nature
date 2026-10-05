import { useMemo } from 'react'
import { LOCATIONS } from '../data/locations'
import { ANIMALS } from '../data/wildlife'
import { TYPE_LABEL } from '../data/types'
import { normalizeFa } from '../utils/text'

export type ResultKind = 'location' | 'animal'

export interface SearchResult {
  kind: ResultKind
  id: string
  title: string
  meta: string[]
  text: string
  href: string
  image: string
  haystack: string
}

const INDEX: SearchResult[] = [
  ...LOCATIONS.map((l) => ({
    kind: 'location' as const,
    id: l.id,
    title: l.name,
    meta: [l.province, TYPE_LABEL[l.type], l.status],
    text: l.summary,
    href: `/lost-places/${l.slug}`,
    image: l.cover.file,
    haystack: normalizeFa(
      [l.name, l.latinName, l.province, TYPE_LABEL[l.type], l.status, l.summary, ...l.keywords].join(' '),
    ),
  })),
  ...ANIMALS.map((a) => ({
    kind: 'animal' as const,
    id: a.id,
    title: a.name,
    meta: ['حیات وحش', a.habitat],
    text: a.mainThreat,
    href: `/wildlife?animal=${a.id}`,
    image: a.image.file,
    haystack: normalizeFa([a.name, a.latinName, a.habitat, a.mainThreat, ...a.keywords].join(' ')),
  })),
]

export function searchAll(query: string): SearchResult[] {
  const q = normalizeFa(query)
  if (q.length < 2) return []
  const words = q.split(' ').filter(Boolean)
  return INDEX.filter((item) => words.every((w) => item.haystack.includes(w)))
}

export function useSearchResults(query: string): SearchResult[] {
  return useMemo(() => searchAll(query), [query])
}

export const SEARCH_SUGGESTIONS = ['دریاچه', 'تالاب', 'جنگل', 'رودخانه', 'گیلان', 'یوزپلنگ', 'اصفهان']
