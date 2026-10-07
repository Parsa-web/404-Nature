import { Link } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { ArrowIcon } from '../components/Icons'
import { LOCATION_BY_SLUG } from '../data/locations'
import { IMAGES } from '../utils/images'
import { Hero404 } from './Hero404'
import { HeroDiagnosticLine, HeroDiagnosticMeta } from './HeroDiagnostic'
import { HeroFragmentLayer } from './HeroFragmentLayer'
import { HeroImageLayer } from './HeroImageLayer'
import { useHeroArchive } from './useHeroArchive'

/**
 * Hero
 * ├── HeroImageLayer     the environmental record, and the layers it fails into
 * ├── HeroFragmentLayer  wrong records bleeding in during an intrusion
 * ├── Hero404            the number, layered so it can come apart
 * ├── HeroDiagnostic     one status line, plus the metadata rows
 * └── useHeroArchive     the single state machine and event scheduler
 *
 * Layout, copy, typography, imagery and the sample-record card are unchanged;
 * only the motion system behind them is new.
 */

/** Copy enters across the intro, so the hero is readable as it stabilises. */
const REVEAL = {
  eyebrow: '2400ms',
  title: '4800ms',
  claim: '7200ms',
  cta: '7700ms',
  diag: '8100ms',
  aside: '8500ms',
} as const

export function Hero() {
  const { ref, status, record, fragments, nudge } = useHeroArchive()
  const anzali = LOCATION_BY_SLUG['anazali-wetland']

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      ref={ref}
    >
      <div className="hero__media" data-parallax="26">
        <HeroImageLayer
          file={IMAGES.urmiaGround}
          alt="ساحل خشک و نمکی دریاچه ارومیه در غروب"
          credit="Solmaz Daryani — Wikimedia Commons (CC BY-SA)"
        />
        {fragments ? <HeroFragmentLayer slots={fragments} /> : null}
        {/* Signal layers: grain and darkness behind, sweep and tear above. */}
        <div className="ha-fx" aria-hidden="true">
          <span className="ha-fx__black" />
          <span className="ha-fx__grain" />
          <span className="ha-fx__scan" />
          <span className="ha-fx__sweep" />
        </div>
      </div>

      <div className="shell hero__inner">
        <div>
          <HeroDiagnosticLine status={status} />
          <p className="eyebrow hero-item" style={{ ['--d' as string]: REVEAL.eyebrow }}>
            آرشیو محیط زیست ایران
          </p>
          <h1 id="hero-title" style={{ marginTop: '1.2rem' }}>
            <Hero404 onPointerEnter={nudge} />
            <span className="hero__title hero-item" style={{ ['--d' as string]: REVEAL.title }}>
              طبیعت پیدا نشد
            </span>
          </h1>
          <p className="hero__claim hero-item" style={{ ['--d' as string]: REVEAL.claim }}>
            چیزی که دنبالش هستید،
            <br />
            ممکن است دیگر وجود نداشته باشد.
          </p>
          <div className="hero__cta hero-item" style={{ ['--d' as string]: REVEAL.cta }}>
            <Link className="btn btn--accent" to="/lost-places" data-cursor="cta">
              کاوش در طبیعت گمشده
              <ArrowIcon className="btn__arrow" />
            </Link>
          </div>
          <HeroDiagnosticMeta
            status={status}
            record={record}
            style={{ ['--d' as string]: REVEAL.diag } as React.CSSProperties}
          />
        </div>

        <aside
          className="hero__card hero-item hero-item--aside"
          style={{ ['--d' as string]: REVEAL.aside }}
          aria-label="نمونه‌ای از آرشیو"
        >
          <Frame file={IMAGES.anzaliB} alt="تالاب انزلی از روی قایق محلی" ratio="43" width={720} sizes="340px" />
          <h2 className="hero__card-name">{anzali.name}</h2>
          <dl>
            <div>
              <dt>وضعیت</dt>
              <dd className="status-dot" data-tone={anzali.statusTone}>
                {anzali.status}
              </dd>
            </div>
            <div>
              <dt>استان</dt>
              <dd>{anzali.province}</dd>
            </div>
            <div>
              <dt>هشدار بین‌المللی</dt>
              <dd>فهرست مونترو، ۱۹۹۳</dd>
            </div>
          </dl>
          <Link className="loss__go" to={`/lost-places/${anzali.slug}`} style={{ marginTop: '1.1rem' }}>
            پرونده کامل
            <ArrowIcon />
          </Link>
        </aside>
      </div>

      <span className="hero__scroll latin">SCROLL</span>
    </section>
  )
}
