import { useEffect } from 'react'
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
  useBodyLock(open)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const links = [...NAV_ITEMS.filter((i) => i.to !== '/about'), ...EXTRA]

  return (
    <div className={`mobile-menu ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="منوی اصلی" aria-hidden={!open}>
      <div className="shell mobile-menu__top">
        <b style={{ fontSize: '1.35rem' }}>۴۰۴</b>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="بستن منو">
          <CloseIcon />
        </button>
      </div>

      <div className="shell mobile-menu__body">
        {links.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            className="mobile-menu__link"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            style={{ animationDelay: `${0.08 * i + 0.12}s` }}
          >
            {item.label}
            <i>{String(i + 1).padStart(2, '0')}</i>
          </Link>
        ))}
        <button
          type="button"
          className="mobile-menu__link"
          onClick={() => {
            onClose()
            onOpenSearch()
          }}
          tabIndex={open ? 0 : -1}
          style={{ animationDelay: `${0.08 * links.length + 0.12}s`, textAlign: 'start' }}
        >
          جستجو
          <i>↗</i>
        </button>
      </div>

      <div className="shell mobile-menu__foot">آرشیو دیجیتال محیط زیست ایران</div>
    </div>
  )
}
