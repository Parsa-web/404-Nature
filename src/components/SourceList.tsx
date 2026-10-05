import type { Source } from '../data/types'

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ul className="src-list">
      {sources.map((s) => (
        <li key={s.url + s.title}>
          <a className="src-item" href={s.url} target="_blank" rel="noopener noreferrer">
            <span>
              <b>{s.title}</b>
              <span>{s.organization}</span>
            </span>
            <em>{s.year} ↗</em>
          </a>
        </li>
      ))}
    </ul>
  )
}
