import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { SectionTitle } from '../components/SectionTitle'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CloseIcon } from '../components/Icons'
import { ANIMALS, ANIMAL_BY_ID } from '../data/wildlife'
import { LOCATION_BY_SLUG } from '../data/locations'
import { ArrowIcon } from '../components/Icons'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import { useBodyLock } from '../hooks/useBodyLock'

export function Wildlife() {
  const [params, setParams] = useSearchParams()
  const openId = params.get('animal')
  const animal = openId ? ANIMAL_BY_ID[openId] : undefined

  useReveal()
  useBodyLock(Boolean(animal))
  useSeo({
    title: 'وقتی زیستگاه تغییر می‌کند | ۴۰۴ — طبیعت پیدا نشد',
    description:
      'گونه‌ها به‌عنوان شاهد تغییر اکوسیستم: فلامینگو، پلنگ ایرانی، گوزن زرد ایرانی، یوزپلنگ آسیایی و گورخر ایرانی.',
  })

  /** The card that opened the panel, so focus can return to it on close. */
  const trigger = useRef<HTMLButtonElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement | null>(null)

  const close = () => {
    params.delete('animal')
    setParams(params, { replace: true })
  }

  // Move focus into the dialog when it opens, and back to the card when it closes.
  useEffect(() => {
    if (animal) {
      closeBtn.current?.focus()
    } else if (trigger.current) {
      trigger.current.focus()
      trigger.current = null
    }
  }, [animal])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && animal && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal])

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'زیستگاه‌ها' }]} />
          <h1>گونه‌ها به‌عنوان شاهد</h1>
          <p className="lede">
            این بخش دانشنامه جانوری نیست. هر گونه اینجا یک شاهد است: وضعیتش چیزی درباره وضعیت یک مکان در این آرشیو
            می‌گوید که آمار مساحت و بارش نمی‌گوید.
          </p>
        </div>
      </header>

      <section className="section section--flush">
        <div className="shell">
          <SectionTitle
            eyebrow="شواهد زنده"
            title="پنج گونه، پنج نوع فشار"
            text="برای هر گونه چهار چیز ثبت شده است: زیستگاه، فشار محیطی دقیقی که تحمل می‌کند، نقشش در اکوسیستم، و این‌که افتش چه چیزی را ثابت می‌کند. وضعیت حفاظتی بر پایه ارزیابی اتحادیه بین‌المللی حفاظت از طبیعت (IUCN) است."
          />

          <div className="wild-grid">
            {ANIMALS.map((a, i) => (
              <button
                type="button"
                key={a.id}
                className="wild-card reveal"
                data-reveal-delay={i * 60}
                onClick={(e) => {
                  trigger.current = e.currentTarget
                  setParams({ animal: a.id }, { replace: false })
                }}
                aria-haspopup="dialog"
              >
                <Frame file={a.image.file} alt={a.image.alt} credit={a.image.credit} ratio="43" sizes="(max-width:700px) 100vw, 30vw" />
                <div className="wild-card__body">
                  <h3>{a.name}</h3>
                  <span className="wild-card__latin latin">{a.latinName}</span>
                  <dl>
                    <div>
                      <dt>زیستگاه</dt>
                      <dd>{a.habitat}</dd>
                    </div>
                    <div>
                      <dt>فشار محیطی</dt>
                      <dd>{a.pressure}</dd>
                    </div>
                    <div>
                      <dt>چه چیزی را ثابت می‌کند</dt>
                      <dd>{a.evidence}</dd>
                    </div>
                  </dl>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* detail panel */}
      <div className={`panel ${animal ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={animal?.name ?? 'جزئیات گونه'} aria-hidden={!animal}>
        <div className="panel__scrim" onClick={close} />
        <div className="panel__sheet">
          {animal ? (
            <>
              <div className="panel__head">
                <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', letterSpacing: '0.16em' }}>
                  پرونده گونه
                </span>
                <button type="button" className="icon-btn" ref={closeBtn} onClick={close} aria-label="بستن">
                  <CloseIcon />
                </button>
              </div>
              <Frame file={animal.image.file} alt={animal.image.alt} credit={animal.image.credit} ratio="16" sizes="620px" />
              <div className="panel__content">
                <div>
                  <h2>{animal.name}</h2>
                  <p className="wild-card__latin latin" style={{ marginTop: '0.4rem' }}>
                    {animal.latinName}
                  </p>
                </div>
                <p>{animal.body}</p>
                <dl className="panel__facts">
                  <div>
                    <dt>زیستگاه</dt>
                    <dd>{animal.habitat}</dd>
                  </div>
                  <div>
                    <dt>فشار محیطی</dt>
                    <dd>{animal.pressure}</dd>
                  </div>
                  <div>
                    <dt>چه چیزی را ثابت می‌کند</dt>
                    <dd>{animal.evidence}</dd>
                  </div>
                  <div>
                    <dt>نقش در اکوسیستم</dt>
                    <dd>{animal.ecologicalRole}</dd>
                  </div>
                  <div>
                    <dt>وضعیت حفاظتی</dt>
                    <dd>{animal.conservation}</dd>
                  </div>
                </dl>
                {animal.linkedSlug && LOCATION_BY_SLUG[animal.linkedSlug] ? (
                  <Link
                    className="loss__go"
                    to={`/lost-places/${animal.linkedSlug}`}
                    onClick={close}
                    style={{ marginTop: 0 }}
                  >
                    پرونده مرتبط: {LOCATION_BY_SLUG[animal.linkedSlug].name}
                    <ArrowIcon />
                  </Link>
                ) : null}
                <a
                  className="loss__go"
                  href={animal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 0 }}
                >
                  منبع: IUCN Red List ↗
                </a>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
