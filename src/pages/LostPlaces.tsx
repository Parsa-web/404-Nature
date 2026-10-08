import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { ArrowIcon } from '../components/Icons'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { LOCATIONS } from '../data/locations'
import { ARCHIVE_STATUS, TYPE_LABEL, type EcosystemType } from '../data/types'
import { useReveal } from '../hooks/useReveal'
import { useParallax } from '../hooks/useParallax'
import { useSeo } from '../hooks/useSeo'
import { faNum } from '../utils/text'

const FILTERS: { id: 'all' | EcosystemType; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'lake', label: 'دریاچه‌ها' },
  { id: 'wetland', label: 'تالاب‌ها' },
  { id: 'river', label: 'رودخانه‌ها' },
  { id: 'forest', label: 'جنگل‌ها' },
  { id: 'habitat', label: 'زیستگاه‌ها' },
]

export function LostPlaces() {
  const [params, setParams] = useSearchParams()
  const active = (params.get('filter') ?? 'all') as 'all' | EcosystemType

  const list = useMemo(
    () => (active === 'all' ? LOCATIONS : LOCATIONS.filter((l) => l.type === active)),
    [active],
  )

  useReveal([active])
  useParallax([active])
  useSeo({
    title: 'مکان‌های از دست‌رفته | ۴۰۴ — طبیعت پیدا نشد',
    description:
      'پرونده‌های مستند تغییر محیط زیست ایران: دریاچه ارومیه، تالاب هامون، دریاچه بختگان، تالاب انزلی، زاینده‌رود و جنگل‌های هیرکانی.',
  })

  const setFilter = (id: string) => {
    if (id === 'all') setParams({}, { replace: true })
    else setParams({ filter: id }, { replace: true })
  }

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'مکان‌های از دست‌رفته' }]} />
          <h1>مکان‌های از دست‌رفته</h1>
          <p className="lede">
            هر پرونده یک حکم دارد: از دست‌رفته، در حال فروپاشی، در خطر یا در حال بازیابی.
            <br />
            حکم‌ها را سند صادر می‌کند، نه لحن.
          </p>
        </div>
      </header>

      <div className="shell">
        <div className="filters" role="group" aria-label="فیلتر نوع اکوسیستم">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={active === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
          <span className="filters__count">{faNum(list.length)} پرونده</span>
        </div>

        {list.length === 0 ? (
          <p className="archive-empty">
            در این دسته هنوز پرونده‌ای ثبت نشده است. دسته «زیستگاه‌ها» در بخش{' '}
            <Link to="/wildlife" style={{ borderBottom: '1px solid var(--accent)' }}>
              وقتی زیستگاه تغییر می‌کند
            </Link>{' '}
            مستند شده است.
          </p>
        ) : (
          <div className="archive-list">
            {list.map((l, i) => (
              <article className="archive-row reveal" key={l.slug} data-reveal-delay={i * 60}>
                <Link to={`/lost-places/${l.slug}`} aria-label={l.name} data-cursor="image">
                  <Frame
                    file={l.cover.file}
                    alt={l.cover.alt}
                    credit={l.cover.credit}
                    ratio="43"
                    parallax={14}
                  />
                </Link>
                <div>
                  <div className="archive-row__head">
                    <h2>
                      <Link to={`/lost-places/${l.slug}`}>{l.name}</Link>
                    </h2>
                    <span className="archive-row__type">
                      {TYPE_LABEL[l.type]} · {ARCHIVE_STATUS[l.archiveStatus].code}
                    </span>
                  </div>
                  <div className="archive-row__meta">
                    <span>{l.province}</span>
                    <span className="status-dot" data-tone={l.statusTone}>
                      {l.status}
                    </span>
                  </div>
                  <p>{l.summary}</p>
                  <Link className="loss__go" to={`/lost-places/${l.slug}`}>
                    ورود به پرونده
                    <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="section section--flush" style={{ paddingTop: 'clamp(2.5rem,6vw,4rem)' }}>
        <div className="shell">
          <div className="note reveal">
            <b>درباره دقت داده‌ها</b>
            هر پرونده به هفت پرسش یکسان پاسخ می‌دهد — اینجا چه بود، چه تغییر کرد، چرا، چه از دست رفت، چه کسی آسیب دید،
            چه مانده و آیا برمی‌گردد — تا دو پرونده را بتوان خط به خط با هم مقایسه کرد. هیچ عدد، تاریخ یا درصدی بدون
            منبع منتشر نمی‌شود و فهرست کامل منابع در صفحه{' '}
            <Link to="/sources" style={{ borderBottom: '1px solid var(--accent)' }}>
              منابع
            </Link>{' '}
            آمده است.
          </div>
        </div>
      </div>
    </>
  )
}
