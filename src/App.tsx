import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { EXIT_MS, TransitionContext, type Phase } from './motion/transition'
import { Home } from './pages/Home'
import { LostPlaces } from './pages/LostPlaces'
import { LocationPage } from './pages/LocationPage'
import { Wildlife } from './pages/Wildlife'
import { DataPage } from './pages/DataPage'
import { SourcesPage } from './pages/SourcesPage'
import { About } from './pages/About'
import { SearchPage } from './pages/SearchPage'
import { NotFound } from './pages/NotFound'

/** Query-only changes (filters, search, the wildlife panel) must not fade the page. */
const routeKey = (pathname: string) => pathname

export default function App() {
  const location = useLocation()
  const [display, setDisplay] = useState(location)
  const [phase, setPhase] = useState<Phase>('in')
  const [token, setToken] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (routeKey(location.pathname) === routeKey(display.pathname)) {
      // Same page, different query string: swap immediately, no transition.
      if (location.search !== display.search || location.key !== display.key) setDisplay(location)
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const commit = () => {
      setDisplay(location)
      setToken((t) => t + 1)
      setPhase('in')
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    if (reduce) {
      commit()
      return
    }

    setPhase('out')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(commit, EXIT_MS)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <TransitionContext.Provider value={{ phase, token }}>
      <Routes location={display}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lost-places" element={<LostPlaces />} />
          <Route path="/lost-places/:slug" element={<LocationPage />} />
          <Route path="/wildlife" element={<Wildlife />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TransitionContext.Provider>
  )
}
