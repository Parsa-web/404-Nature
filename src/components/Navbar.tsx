import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MenuIcon, SearchIcon } from './Icons'

export const NAV_ITEMS = [
  { to: '/', label: 'خانه' },
  { to: '/lost-places', label: 'مکان‌های از دست‌رفته' },
  { to: '/wildlife', label: 'زیستگاه‌ها' },
  { to: '/data', label: 'داده‌ها' },
  { to: '/about', label: 'درباره پروژه' },
]

interface Props {
  onOpenMenu: () => void
  onOpenSearch: () => void
}

export function Navbar({ onOpenMenu, onOpenSearch }: Props) {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'is-solid' : ''}`}>
      <div className="shell nav__inner">
        <Link to="/" className="nav__brand" aria-label="۴۰۴ — طبیعت پیدا نشد، خانه">
          <b>۴۰۴</b>
          <span>طبیعت پیدا نشد</span>
        </Link>

        <nav className="nav__links" aria-label="ناوبری اصلی">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__tools">
          <button type="button" className="icon-btn" onClick={onOpenSearch} aria-label="جستجو در آرشیو">
            <SearchIcon />
          </button>
          <button type="button" className="icon-btn nav__burger" onClick={onOpenMenu} aria-label="باز کردن منو">
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
