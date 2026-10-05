import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloseIcon, SearchIcon } from './Icons'
import { useBodyLock } from '../hooks/useBodyLock'
import { SEARCH_SUGGESTIONS, useSearchResults } from '../hooks/useSearchIndex'
import { ResultRow } from './ResultRow'

interface Props {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState('')
  const input = useRef<HTMLInputElement | null>(null)
  const results = useSearchResults(q)
  const navigate = useNavigate()
  useBodyLock(open)

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => input.current?.focus(), 120)
      return () => window.clearTimeout(id)
    }
    setQ('')
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim().length < 2) return
    onClose()
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className={`search-overlay ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="جستجو" aria-hidden={!open}>
      <div className="shell search-overlay__head">
        <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', letterSpacing: '0.18em' }}>جستجو در آرشیو</span>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="بستن جستجو">
          <CloseIcon />
        </button>
      </div>

      <form className="shell" onSubmit={submit}>
        <div className="search-overlay__field">
          <SearchIcon size={26} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="دریاچه، تالاب، جنگل، حیوان، استان…"
            aria-label="عبارت جستجو"
            tabIndex={open ? 0 : -1}
            enterKeyHint="search"
          />
        </div>
      </form>

      <div className="shell">
        {q.trim().length < 2 ? (
          <div className="search-overlay__hint">
            نام یک مکان، یک گونه یا یک استان را بنویسید.
            <div className="search-chips">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setQ(s)} tabIndex={open ? 0 : -1}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="search-overlay__hint">
              {results.length ? `${results.length} نتیجه` : 'نتیجه‌ای پیدا نشد.'}
            </div>
            <ul>
              {results.map((r, i) => (
                <li key={r.kind + r.id} style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                  <ResultRow result={r} onNavigate={onClose} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
