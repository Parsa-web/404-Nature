import { Link, useParams } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { GlitchText } from '../components/GlitchText'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { SourceList } from '../components/SourceList'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ArrowIcon } from '../components/Icons'
import { LOCATION_BY_SLUG } from '../data/locations'
import { TYPE_LABEL } from '../data/types'
import { commons } from '../utils/images'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import { NotFound } from './NotFound'

const SECTION_TITLES = {
  whatHappened: 'چه اتفاقی افتاد؟',
  whyItMatters: 'چرا مهم است؟',
  humanImpact: 'اثر آن بر انسان',
  atRisk: 'چه چیزی در خطر است؟',
  solutions: 'چه می‌توان کرد؟',
} as const

export function LocationPage() {
  const { slug = '' } = useParams()
  const loc = LOCATION_BY_SLUG[slug]

  useReveal([slug])
  useSeo({
    title: loc ? `${loc.name} | ۴۰۴ — طبیعت پیدا نشد` : 'پیدا نشد | ۴۰۴',
    description: loc ? loc.summary : 'این صفحه پیدا نشد.',
    image: loc ? commons(loc.cover.file, 1200) : undefined,
  })

  if (!loc) return <NotFound />

  return (
    <article>
      {/* hero */}
      <header className="loc-hero">
        <div className="loc-hero__media">
          <img
            src={commons(loc.cover.file, 2000)}
            srcSet={`${commons(loc.cover.file, 900)} 900w, ${commons(loc.cover.file, 1600)} 1600w`}
            sizes="100vw"
            alt={loc.cover.alt}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="shell loc-hero__inner">
          <Breadcrumbs
            items={[{ label: 'خانه', to: '/' }, { label: 'مکان‌های از دست‌رفته', to: '/lost-places' }, { label: loc.name }]}
          />
          <p className="loc-hero__latin latin" style={{ marginTop: '1.2rem' }}>
            {loc.latinName}
          </p>
          <h1>
            <GlitchText text={loc.name} onHover />
          </h1>

          <dl className="loc-hero__facts">
            <div>
              <dt>استان / منطقه</dt>
              <dd>{loc.province}</dd>
            </div>
            <div>
              <dt>نوع اکوسیستم</dt>
              <dd>{TYPE_LABEL[loc.type]}</dd>
            </div>
            <div>
              <dt>وضعیت کنونی</dt>
              <dd className="status-dot" data-tone={loc.statusTone}>
                {loc.status}
              </dd>
            </div>
            <div>
              <dt>تصویر</dt>
              <dd style={{ fontSize: 'var(--step--1)', color: 'var(--ink-dim)' }}>{loc.cover.credit}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* intro */}
      <section className="section section--flush">
        <div className="shell">
          <p className="lede reveal">{loc.intro}</p>
        </div>
      </section>

      {/* before / after */}
      <section className="section section--flush" aria-labelledby="ba-title" style={{ paddingTop: 0 }}>
        <div className="shell">
          <h2 id="ba-title" className="reveal" style={{ fontSize: 'var(--step-2)', marginBottom: '1.4rem' }}>
            گذشته / امروز
          </h2>
          <div className="reveal">
            <BeforeAfterSlider data={loc.comparison} />
          </div>
        </div>
      </section>

      {/* narrative sections */}
      <section className="section" style={{ paddingBlock: 0 }}>
        <div className="shell">
          {(Object.keys(SECTION_TITLES) as (keyof typeof SECTION_TITLES)[]).map((key) => (
            <div className="narrative reveal" key={key}>
              <h2>{SECTION_TITLES[key]}</h2>
              <ul>
                {loc[key].map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* gallery */}
      <section aria-label={`تصاویر ${loc.name}`} className="reveal">
        <div className="loc-gallery">
          {loc.gallery.map((g) => (
            <Frame key={g.file} file={g.file} alt={g.alt} credit={g.credit} ratio="43" sizes="(max-width:760px) 100vw, 33vw" />
          ))}
        </div>
      </section>

      {/* documented facts */}
      {loc.facts.length ? (
        <section className="section">
          <div className="shell">
            <h2 className="reveal" style={{ fontSize: 'var(--step-2)', marginBottom: '1.6rem' }}>
              واقعیت‌های مستند
            </h2>
            <div className="data-grid">
              {loc.facts.map((f) => (
                <article className="data-block reveal" key={f.label}>
                  <span className="data-block__cat">{f.label}</span>
                  <div className="data-block__headline" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)' }}>
                    {f.value}
                  </div>
                  <p>{f.context}</p>
                  <div className="data-block__src">
                    <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer">
                      منبع ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* sources */}
      <section className="section">
        <div className="shell">
          <h2 className="reveal" style={{ fontSize: 'var(--step-2)', marginBottom: '1.4rem' }}>
            منابع این پرونده
          </h2>
          <div className="reveal">
            <SourceList sources={loc.sources} />
          </div>
          <Link className="loss__go" to="/sources" style={{ marginTop: '1.6rem' }}>
            فهرست کامل منابع پروژه
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* related */}
      <section className="section">
        <div className="shell">
          <h2 className="reveal" style={{ fontSize: 'var(--step-2)', marginBottom: '1.4rem' }}>
            پرونده‌های مرتبط
          </h2>
          <div className="related reveal">
            {loc.related.map((slugRef) => {
              const r = LOCATION_BY_SLUG[slugRef]
              if (!r) return null
              return (
                <Link key={r.slug} to={`/lost-places/${r.slug}`}>
                  <Frame file={r.cover.file} alt={r.cover.alt} ratio="16" sizes="(max-width:760px) 100vw, 33vw" />
                  <div className="related__body">
                    <b>{r.name}</b>
                    <span>
                      {r.province} — {TYPE_LABEL[r.type]}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </article>
  )
}
