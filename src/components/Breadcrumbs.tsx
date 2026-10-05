import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="مسیر صفحه">
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'inline-flex', gap: '0.6rem', alignItems: 'center' }}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {i < items.length - 1 ? <span aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav>
  )
}
