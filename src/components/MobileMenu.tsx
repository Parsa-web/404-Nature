import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseIcon } from './Icons'
import { NAV_ITEMS } from './Navbar'
import { useBodyLock } from '../hooks/useBodyLock'

interface Props {
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
}

const EXTRA = [
  { to: '/sources', label: 'منابع' },
  { to: '/about', label: 'درباره ۴۰۴' },
]

export function MobileMenu({ open, onClose, onOpenSearch }: Props) {
  // Keep the panel mounted through its exit so the items can leave first.
  const [closing, setClosing] = useState(false)
  const exit = useRef<number | undefined>(undefined)
  useBodyLock(open)

  const close = () => {
    setClosing(true)
    window.clearTimeout(exit.current)
    exit.current = window.setTimeout(() => {
      setClosing(false)
      onClose()
    }, 180)
  }

  useEffect(() => {
    if (open) setClosing(false)
    return () => window.clearTimeout(exit.current)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const links = [...NAV_ITEMS.filter((i) => i.to !== '/about'), ...EXTRA]

  return (
    <div className={`mobile-menu ${open ? 'is-open' : ''} ${closing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="منوی اصلی" aria-hidden={!open}>
      <div className="shell mobile-menu__top">
        <b style={{ fontSize: '1.35rem' }}>۴۰۴</b>
        <button type="button" className="icon-btn" onClick={close} aria-label="بستن منو">
          <CloseIcon />
        </button>
      </div>

      <div className="shell mobile-menu__body">
        {links.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            className="mobile-menu__link"
            onClick={close}
            tabIndex={open ? 0 : -1}
            style={{ animationDelay: `${0.07 * i + 0.16}s` }}
          >
            {item.label}
            <i>{String(i + 1).padStart(2, '0')}</i>
          </Link>
        ))}
        <button
          type="button"
          className="mobile-menu__link"
          onClick={() => {
            close()
            onOpenSearch()
          }}
          tabIndex={open ? 0 : -1}
          style={{ animationDelay: `${0.07 * links.length + 0.16}s`, textAlign: 'start' }}
        >
          جستجو
          <i>↗</i>
        </button>
      </div>

      <div className="shell mobile-menu__foot">آرشیو دیجیتال محیط زیست ایران</div>
    </div>
  )
}
