import { Link } from 'react-router-dom'
import { GlitchImage } from '../components/GlitchImage'
import { GlitchText } from '../components/GlitchText'
import { Frame } from '../components/Frame'
import { SectionTitle } from '../components/SectionTitle'
import { ArrowIcon } from '../components/Icons'
import { LOCATIONS, LOCATION_BY_SLUG } from '../data/locations'
import { TYPE_LABEL } from '../data/types'
import { IMAGES, commons } from '../utils/images'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'

const CATEGORIES = [
  { label: 'تالاب‌ها', type: 'wetland' },
  { label: 'جنگل‌ها', type: 'forest' },
  { label: 'گونه‌های جانوری', type: 'habitat' },
  { label: 'رودخانه‌ها', type: 'river' },
  { label: 'دریاچه‌ها', type: 'lake' },
] as const

const HUMAN_ROWS = [
  { title: 'آب', text: 'وقتی یک رودخانه یا دریاچه کم می‌آورد، فشار به سفره‌های زیرزمینی منتقل می‌شود و کیفیت آب شهر تغییر می‌کند.' },
  { title: 'غذا', text: 'کشاورزی و شیلات مستقیم‌ترین پیوند میان یک اکوسیستم و سفره غذای مردم است.' },
  { title: 'سلامت', text: 'بستر خشک یک تالاب به کانون گردوغبار تبدیل می‌شود؛ گردوغبار یک مسئله ریوی است، نه فقط یک مسئله منظر.' },
  { title: 'اقتصاد', text: 'گردشگری، صیادی، دامداری و صنایع آب‌بر همه روی یک منبع مشترک حساب می‌کنند.' },
  { title: 'شهرها', text: 'تالاب سیلاب را میرا می‌کند و پهنه آبی دما را تعدیل می‌کند؛ بدون آن‌ها شهر گرم‌تر و آسیب‌پذیرتر می‌شود.' },
  { title: 'مهاجرت', text: 'وقتی آب برود، مردم هم می‌روند. مهاجرت از سیستان یکی از آشکارترین نمونه‌های این پیوند در ایران است.' },
  { title: 'زندگی روزمره', text: 'پل‌هایی که بر بستر خشک ایستاده‌اند، نشان می‌دهند تغییر محیط زیست چیزی دور از زندگی ما نیست.' },
]

export function Home() {
  useReveal()
  useSeo({
    title: '۴۰۴ — طبیعت پیدا نشد | آرشیو محیط زیست ایران',
    description:
      'آرشیوی مستند از مکان‌ها و زیستگاه‌هایی در ایران که تغییر کرده‌اند، خشک شده‌اند یا در خطرند. چیزی که امروز عادی به نظر می‌رسد، ممکن است فردا دیگر وجود نداشته باشد.',
    image: commons(IMAGES.urmiaIss, 1200),
  })

  const anzali = LOCATION_BY_SLUG['anazali-wetland']

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media">
          <GlitchImage
            file={IMAGES.urmiaGround}
            shiftFile={IMAGES.urmiaIss}
            alt="ساحل خشک و نمکی دریاچه ارومیه در غروب"
            credit="Solmaz Daryani — Wikimedia Commons (CC BY-SA)"
            eager
          />
        </div>

        <div className="shell hero__inner">
          <div>
            <p className="eyebrow">آرشیو محیط زیست ایران</p>
            <h1 id="hero-title" style={{ marginTop: '1.2rem' }}>
              <GlitchText as="span" text="۴۰۴" className="hero__404" autoOnMount interval={9000} />
              <span className="hero__title">طبیعت پیدا نشد</span>
            </h1>
            <p className="hero__claim">
              چیزی که دنبالش هستید،
              <br />
              ممکن است دیگر وجود نداشته باشد.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--accent" to="/lost-places">
                کاوش در طبیعت گمشده
                <ArrowIcon className="btn__arrow" />
              </Link>
            </div>
          </div>

          <aside className="hero__card" aria-label="نمونه‌ای از آرشیو">
            <Frame file={IMAGES.anzaliB} alt="تالاب انزلی از روی قایق محلی" ratio="43" width={720} sizes="340px" />
            <h3>{anzali.name}</h3>
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

      {/* ---------------- ARCHIVE CATEGORIES ---------------- */}
      <section aria-label="دسته‌های آرشیو">
        <div className="archive-strip">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.label}
              to={c.type === 'habitat' ? '/wildlife' : `/lost-places?filter=${c.type}`}
              className="archive-strip__item reveal"
              data-reveal-delay={i * 70}
            >
              <span className="archive-strip__num latin">{String(i + 1).padStart(2, '0')}</span>
              <b>{c.label}</b>
              <span>آرشیو</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- WHAT ARE WE LOSING ---------------- */}
      <section className="section" aria-labelledby="losses-title">
        <div className="shell">
          <SectionTitle
            eyebrow="پرونده‌ها"
            title="چه چیزهایی را از دست می‌دهیم؟"
            text="پنج پرونده از جاهایی که روزی عادی بودند. هر پرونده با منبع خودش ارجاع داده شده است."
          />

          <div className="losses">
            {LOCATIONS.map((l, i) => (
              <article className="loss reveal" key={l.slug} id={i === 0 ? 'losses-title' : undefined}>
                <div className="loss__media">
                  <Link to={`/lost-places/${l.slug}`} aria-label={l.name}>
                    <Frame file={l.cover.file} alt={l.cover.alt} credit={l.cover.credit} ratio="43" />
                  </Link>
                </div>
                <div>
                  <span className="loss__index latin">{String(i + 1).padStart(2, '0')} / ARCHIVE</span>
                  <h3 className="loss__name">
                    <Link to={`/lost-places/${l.slug}`}>{l.name}</Link>
                  </h3>
                  <div className="loss__meta">
                    <span>{l.province}</span>
                    <span>{TYPE_LABEL[l.type]}</span>
                    <span className="status-dot" data-tone={l.statusTone}>
                      {l.status}
                    </span>
                  </div>
                  <p className="loss__text">{l.summary}</p>
                  <Link className="loss__go" to={`/lost-places/${l.slug}`}>
                    مشاهده پرونده
                    <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HUMAN CONNECTION ---------------- */}
      <section className="section human" aria-labelledby="human-title">
        <div className="shell">
          <p className="eyebrow reveal">پیوند انسانی</p>
          <h2 id="human-title" className="human__title reveal" style={{ marginTop: '1.2rem' }}>
            این فقط درباره طبیعت نیست.
          </h2>
          <p className="human__intro reveal">
            تغییر یک اکوسیستم در خلأ اتفاق نمی‌افتد. از لحظه‌ای که یک رودخانه کم می‌آورد، زنجیره‌ای از پیامدها به زندگی
            روزمره می‌رسد.
          </p>

          <div className="human__list">
            {HUMAN_ROWS.map((row, i) => (
              <div className="human__row reveal" key={row.title} data-reveal-delay={i * 50}>
                <span className="n latin">{String(i + 1).padStart(2, '0')}</span>
                <b>{row.title}</b>
                <p>{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FINAL STATEMENT ---------------- */}
      <section className="final" aria-label="جمله پایانی">
        <div>
          <p className="final__a reveal reveal--still">
            محیط زیست،
            <br />
            جایی خارج از زندگی ما نیست.
          </p>
          <p className="final__b reveal reveal--still" data-reveal-delay={450}>
            ما درون آن زندگی می‌کنیم.
          </p>
          <div className="final__line reveal reveal--still" data-reveal-delay={800} />
        </div>
      </section>
    </>
  )
}
