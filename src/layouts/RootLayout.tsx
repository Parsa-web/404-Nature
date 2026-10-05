import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { MobileMenu } from '../components/MobileMenu'
import { SearchOverlay } from '../components/SearchOverlay'
import { Footer } from '../components/Footer'

export function RootLayout() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname, search: qs } = useLocation()
  const [tick, setTick] = useState(0)

  // Reset scroll and replay the page transition on every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setTick((t) => t + 1)
  }, [pathname, qs])

  return (
    <>
      <a className="skip-link" href="#main">
        پرش به محتوای اصلی
      </a>
      <Navbar onOpenMenu={() => setMenu(true)} onOpenSearch={() => setSearch(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} onOpenSearch={() => setSearch(true)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      <main id="main" key={tick} className="page-enter">
        <span className="route-loader" key={`loader-${tick}`} aria-hidden="true" />
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
