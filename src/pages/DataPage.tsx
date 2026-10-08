import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DataBlock } from '../components/DataBlock'
import { SectionTitle } from '../components/SectionTitle'
import { DATA_CATEGORY_LABEL, DATA_POINTS, TIMELINE, type DataCategory } from '../data/dataPoints'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import { faNum } from '../utils/text'

const CATS: { id: 'all' | DataCategory; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'water', label: DATA_CATEGORY_LABEL.water },
  { id: 'air', label: DATA_CATEGORY_LABEL.air },
  { id: 'forest', label: DATA_CATEGORY_LABEL.forest },
  { id: 'wetland', label: DATA_CATEGORY_LABEL.wetland },
  { id: 'biodiversity', label: DATA_CATEGORY_LABEL.biodiversity },
]

export function DataPage() {
  const [params, setParams] = useSearchParams()
  const active = (params.get('cat') ?? 'all') as 'all' | DataCategory
  const list = useMemo(
    () => (active === 'all' ? DATA_POINTS : DATA_POINTS.filter((d) => d.category === active)),
    [active],
  )

  useReveal([active])
  useSeo({
    title: 'داده‌ها | ۴۰۴ — طبیعت پیدا نشد',
    description:
      'داده‌های مستند درباره محیط زیست ایران: تالاب‌ها، جنگل‌ها، آب و تنوع زیستی. هر داده با منبع، تاریخ و زمینه آورده شده است.',
  })

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'داده‌ها' }]} />
          <h1>داده‌ها</h1>
          <p className="lede">
            این صفحه داشبورد نیست. ده عدد است که هر کدام چیزی را در این آرشیو تغییر می‌دهند — و هر کدام فقط به یک سند
            ارجاع دارند. عددی که منبع نداشته باشد، در این پروژه منتشر نمی‌شود.
          </p>
        </div>
      </header>

      <div className="shell">
        <div className="filters" role="group" aria-label="فیلتر دسته داده">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={active === c.id}
              onClick={() => (c.id === 'all' ? setParams({}, { replace: true }) : setParams({ cat: c.id }, { replace: true }))}
            >
              {c.label}
            </button>
          ))}
          <span className="filters__count">{faNum(list.length)} داده</span>
        </div>
      </div>

      <section
        className="section section--flush"
        style={{ paddingTop: 'clamp(2rem,5vw,3rem)' }}
        aria-labelledby="data-records"
      >
        <div className="shell">
          <h2 id="data-records" className="sr-only">
            داده‌های مستند
          </h2>
          <div className="data-grid">
            {list.map((p) => (
              <DataBlock key={p.id} point={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="خط زمان"
            title="هشدارها زودتر از بحران رسیدند"
            text="نکته این خط زمان، ترتیب آن است: نخستین هشدارهای رسمی بین‌المللی درباره تالاب‌های ایران در ۱۹۹۰ و ۱۹۹۳ صادر شدند — سال‌ها پیش از آن‌که خشکی به تیتر خبرها برسد. هر تاریخ از یک سند رسمی گرفته شده است."
          />
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div className="timeline__row reveal" key={t.year + t.title} data-reveal-delay={i * 60}>
                <span className="timeline__year latin">{t.year}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <a className="timeline__src" href={t.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {t.source} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="note reveal">
            <b>چرا داده‌های کمتری از آنچه انتظار دارید اینجاست؟</b>
            برای بسیاری از شاخص‌های محیط زیستی ایران، سری زمانی عمومی، به‌روز و قابل استناد در دسترس نبود. به‌جای پر کردن
            این صفحه با اعداد تقریبی یا بازتولید آمارهای بی‌منبع، تنها داده‌هایی منتشر شده‌اند که می‌توان آن‌ها را به یک
            سند مشخص ارجاع داد. کم بودن عددها اینجا یک انتخاب است، نه یک کمبود.
          </div>
        </div>
      </section>
    </>
  )
}
