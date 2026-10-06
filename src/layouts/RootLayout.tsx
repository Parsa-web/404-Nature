import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { MobileMenu } from '../components/MobileMenu'
import { SearchOverlay } from '../components/SearchOverlay'
import { Footer } from '../components/Footer'
import { CustomCursor } from '../components/CustomCursor'
import { useTransition } from '../motion/transition'

export function RootLayout() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { phase, token } = useTransition()

  return (
    <>
      <a className="skip-link" href="#main">
        پرش به محتوای اصلی
      </a>

      <CustomCursor />

      <Navbar onOpenMenu={() => setMenu(true)} onOpenSearch={() => setSearch(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} onOpenSearch={() => setSearch(true)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      {/* Thin veil + scanline wash that carries the route change. */}
      <div className={`veil ${phase === 'out' ? 'is-active' : ''}`} aria-hidden="true" />

      <main id="main" key={token} className={`page ${phase === 'out' ? 'is-leaving' : 'is-entering'}`}>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
