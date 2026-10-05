import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ResultRow } from '../components/ResultRow'
import { SearchIcon } from '../components/Icons'
import { SEARCH_SUGGESTIONS, useSearchResults } from '../hooks/useSearchIndex'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import { faNum } from '../utils/text'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [draft, setDraft] = useState(q)
  const results = useSearchResults(draft)

  useEffect(() => setDraft(q), [q])
  useReveal([draft])
  useSeo({
    title: q ? `جستجو: ${q} | ۴۰۴ — طبیعت پیدا نشد` : 'جستجو | ۴۰۴ — طبیعت پیدا نشد',
    description: 'جستجو در آرشیو مکان‌ها و گونه‌های پروژه ۴۰۴.',
  })

  // Keep the URL in sync so results stay shareable.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft.trim() === q) return
      if (draft.trim()) setParams({ q: draft.trim() }, { replace: true })
      else setParams({}, { replace: true })
    }, 350)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'جستجو' }]} />
          <h1 style={{ fontSize: 'var(--step-3)' }}>
            {draft.trim() ? <>نتایج جستجو برای «{draft.trim()}»</> : 'جستجو در آرشیو'}
          </h1>

          <form className="search-page__field" onSubmit={(e) => e.preventDefault()} role="search">
            <SearchIcon size={22} />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="دریاچه، تالاب، جنگل، حیوان، استان…"
              aria-label="عبارت جستجو"
              autoFocus
            />
          </form>

          <div className="search-chips">
            {SEARCH_SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setDraft(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="section section--flush" style={{ paddingTop: 'clamp(2rem,5vw,3rem)' }}>
        <div className="shell">
          {draft.trim().length < 2 ? (
            <p style={{ color: 'var(--ink-faint)' }}>دست‌کم دو حرف بنویسید.</p>
          ) : results.length === 0 ? (
            <p style={{ color: 'var(--ink-faint)' }}>
              نتیجه‌ای برای «{draft.trim()}» پیدا نشد. شاید همین هم بخشی از موضوع این پروژه باشد.
            </p>
          ) : (
            <>
              <p style={{ color: 'var(--ink-faint)', fontSize: 'var(--step--1)', marginBottom: '1rem' }}>
                {faNum(results.length)} نتیجه
              </p>
              <ul className="search-page__results">
                {results.map((r, i) => (
                  <li key={r.kind + r.id} style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}>
                    <ResultRow result={r} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  )
}
