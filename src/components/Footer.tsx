import { Link } from 'react-router-dom'
import { LOCATIONS } from '../data/locations'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <b>۴۰۴</b>
            <span style={{ color: 'var(--ink-dim)' }}>طبیعت پیدا نشد</span>
            <p>آرشیوی مستند از مکان‌ها و زیستگاه‌هایی که تغییر کرده‌اند. هر ادعای عددی در این پروژه به منبع خود ارجاع دارد.</p>
          </div>

          <div>
            <h2 className="footer__head">آرشیو</h2>
            <ul>
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link to={`/lost-places/${l.slug}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer__head">پروژه</h2>
            <ul>
              <li>
                <Link to="/wildlife">زیستگاه‌ها و گونه‌ها</Link>
              </li>
              <li>
                <Link to="/data">داده‌ها</Link>
              </li>
              <li>
                <Link to="/sources">منابع</Link>
              </li>
              <li>
                <Link to="/about">درباره ۴۰۴</Link>
              </li>
              <li>
                <Link to="/search">جستجو</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>۴۰۴ — طبیعت پیدا نشد</span>
          <span>تصاویر: Wikimedia Commons با مجوز آزاد</span>
        </div>
      </div>
    </footer>
  )
}
