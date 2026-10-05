import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { SectionTitle } from '../components/SectionTitle'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CloseIcon } from '../components/Icons'
import { ANIMALS, ANIMAL_BY_ID } from '../data/wildlife'
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
      'آرشیو گونه‌های جانوری ایران که با تغییر زیستگاه روبه‌رو هستند: یوزپلنگ آسیایی، پلنگ ایرانی، گوزن زرد ایرانی، فلامینگو و گورخر ایرانی.',
  })

  const close = () => {
    params.delete('animal')
    setParams(params, { replace: true })
  }

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
          <h1>وقتی زیستگاه تغییر می‌کند</h1>
          <p className="lede">
            یک گونه با تفنگ از بین نمی‌رود؛ با از دست رفتن زمینش از بین می‌رود. این بخش گونه‌هایی را مستند می‌کند که
            سرنوشتشان به سرنوشت همان مکان‌های آرشیو گره خورده است.
          </p>
        </div>
      </header>

      <section className="section section--flush">
        <div className="shell">
          <SectionTitle
            eyebrow="آرشیو گونه‌ها"
            title="پنج گونه، پنج زیستگاه"
            text="وضعیت حفاظتی هر گونه بر پایه ارزیابی اتحادیه بین‌المللی حفاظت از طبیعت (IUCN) آورده شده است. برای جزئیات روی هر گونه کلیک کنید."
          />

          <div className="wild-grid">
            {ANIMALS.map((a, i) => (
              <button
                type="button"
                key={a.id}
                className="wild-card reveal"
                data-reveal-delay={i * 60}
                onClick={() => setParams({ animal: a.id }, { replace: false })}
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
                      <dt>تهدید اصلی</dt>
                      <dd>{a.mainThreat}</dd>
                    </div>
                    <div>
                      <dt>اهمیت اکولوژیک</dt>
                      <dd>{a.ecologicalRole}</dd>
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
                <button type="button" className="icon-btn" onClick={close} aria-label="بستن">
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
                    <dt>تهدید اصلی</dt>
                    <dd>{animal.mainThreat}</dd>
                  </div>
                  <div>
                    <dt>اهمیت اکولوژیک</dt>
                    <dd>{animal.ecologicalRole}</dd>
                  </div>
                  <div>
                    <dt>وضعیت حفاظتی</dt>
                    <dd>{animal.conservation}</dd>
                  </div>
                </dl>
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
