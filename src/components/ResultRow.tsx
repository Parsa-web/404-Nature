import { Link } from 'react-router-dom'
import { Frame } from './Frame'
import { ArrowIcon } from './Icons'
import type { SearchResult } from '../hooks/useSearchIndex'

export function ResultRow({ result, onNavigate }: { result: SearchResult; onNavigate?: () => void }) {
  return (
    <Link className="result-row" to={result.href} onClick={onNavigate}>
      <Frame file={result.image} alt={result.title} ratio="43" width={320} sizes="110px" plain />
      <div>
        <h3>{result.title}</h3>
        <div className="result-row__meta">
          {result.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <span className="result-row__go" aria-hidden="true">
        <ArrowIcon />
      </span>
    </Link>
  )
}
