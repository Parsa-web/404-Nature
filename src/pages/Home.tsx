import { Link } from 'react-router-dom'
import { Frame } from '../components/Frame'
import { SectionTitle } from '../components/SectionTitle'
import { ArrowIcon } from '../components/Icons'
import { Hero } from '../hero/Hero'
import { LOCATIONS, LOCATION_BY_SLUG } from '../data/locations'
import { ARCHIVE_STATUS, TYPE_LABEL } from '../data/types'
import { ARCHIVE_CONCEPT, ARCHIVE_STATUS_ORDER, CHAIN, SOLUTIONS, STATUS_RECORDS } from '../data/narrative'
import { IMAGES, commons } from '../utils/images'
import { useReveal } from '../hooks/useReveal'
import { useParallax } from '../hooks/useParallax'
import { useSeo } from '../hooks/useSeo'
import { faNum } from '../utils/text'

const CATEGORIES = [
  { label: 'تالاب‌ها', type: 'wetland' },
  { label: 'جنگل‌ها', type: 'forest' },
  { label: 'گونه‌های جانوری', type: 'habitat' },
  { label: 'رودخانه‌ها', type: 'river' },
  { label: 'دریاچه‌ها', type: 'lake' },
] as const

export function Home() {
  useReveal()
  useParallax()
  useSeo({
    title: '۴۰۴ — طبیعت پیدا نشد | آرشیو محیط زیست ایران',
    description:
      'آرشیوی مستند از مکان‌ها و زیستگاه‌هایی در ایران که تغییر کرده‌اند، خشک شده‌اند یا در خطرند. چیزی که امروز عادی به نظر می‌رسد، ممکن است فردا دیگر وجود نداشته باشد.',
    image: commons(IMAGES.urmiaIss, 1200),
  })

  return (
    <>
      <Hero />

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

      {/* ---------------- 01 · THE ARCHIVE ---------------- */}
      <section className="section" aria-labelledby="archive-title">
        <div className="shell">
          <SectionTitle
            id="archive-title"
            eyebrow={ARCHIVE_CONCEPT.eyebrow}
            title={ARCHIVE_CONCEPT.title}
            text={ARCHIVE_CONCEPT.lede}
          />

          <p className="lede reveal" style={{ maxWidth: '62ch' }}>
            {ARCHIVE_CONCEPT.rule}
          </p>

          <div className="human__list">
            {ARCHIVE_STATUS_ORDER.map((key, i) => {
              const st = ARCHIVE_STATUS[key]
              const records = STATUS_RECORDS[key]
              return (
                <div className="human__row reveal" key={key} data-reveal-delay={i * 60}>
                  <span className="n latin">{String(i + 1).padStart(2, '0')}</span>
                  <b>
                    <span className="status-dot" data-tone={st.tone}>
                      {st.label}
                    </span>
                    <span className="code latin">{st.code}</span>
                  </b>
                  <p>
                    {st.meaning}
                    <span className="ev">
                      {records.length ? (
                        <>
                          پرونده‌ها:{' '}
                          {records.map((slug, n) => {
                            const loc = LOCATION_BY_SLUG[slug]
                            if (!loc) return null
                            return (
                              <span key={slug}>
                                {n > 0 ? '، ' : ''}
                                <Link to={`/lost-places/${loc.slug}`}>{loc.name}</Link>
                              </span>
                            )
                          })}
                        </>
                      ) : (
                        <>
                          هنوز هیچ پرونده‌ای. نزدیک‌ترین مورد ثبت‌شده، گزارش ۲۰۱۷ برنامه محیط زیست ملل متحد با عنوان
                          «نشانه‌های بهبود دریاچه ارومیه» است.{' '}
                          <a href={ARCHIVE_CONCEPT.noteSource} target="_blank" rel="noopener noreferrer">
                            UNEP ↗
                          </a>
                        </>
                      )}
                    </span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 02 · CASE FILES ---------------- */}
      <section className="section" aria-labelledby="losses-title">
        <div className="shell">
          <SectionTitle
            id="losses-title"
            eyebrow="پرونده‌ها"
            title="شش مکان که دیگر همان نیستند"
            text={`هر پرونده به هفت پرسش پاسخ می‌دهد و منابع خودش را همراه دارد. دو پرونده نخست — ارومیه و هامون — کل منطق این آرشیو را توضیح می‌دهند: یکی در حال فروپاشی است، دیگری از دست رفته. ${faNum(LOCATIONS.length)} پرونده ثبت شده است.`}
          />

          <div className="losses">
            {LOCATIONS.map((l, i) => (
              <article className="loss reveal" key={l.slug}>
                <div className="loss__media">
                  <Link to={`/lost-places/${l.slug}`} aria-label={l.name} data-cursor="image">
                    <Frame
                      file={l.cover.file}
                      alt={l.cover.alt}
                      credit={l.cover.credit}
                      ratio="43"
                      parallax={16}
                    />
                  </Link>
                </div>
                <div>
                  <span className="loss__index latin">
                    {String(i + 1).padStart(2, '0')} / {ARCHIVE_STATUS[l.archiveStatus].code}
                  </span>
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

      {/* ---------------- 03 · THE CHAIN ---------------- */}
      <section className="section human" aria-labelledby="chain-title">
        <div className="shell">
          <p className="eyebrow reveal">زنجیره</p>
          <h2 id="chain-title" className="human__title reveal" style={{ marginTop: '1.2rem' }}>
            یک حلقه کافی است تا بقیه بیفتند.
          </h2>
          <p className="human__intro reveal">
            هیچ‌کدام از پرونده‌های این آرشیو با «نابودی طبیعت» شروع نشد. همه با یک تصمیم درباره آب شروع شدند. این شش گام،
            همان مسیری است که در سیستان، ارومیه و اصفهان ثبت شده — به همین ترتیب.
          </p>

          <div className="human__list">
            {CHAIN.map((link, i) => (
              <div className="human__row reveal" key={link.id} data-reveal-delay={i * 50}>
                <span className="n latin">{String(i + 1).padStart(2, '0')}</span>
                <b>{link.title}</b>
                <p>
                  {link.text}
                  <span className="ev">
                    {link.evidence}{' '}
                    <a href={link.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {link.source} ↗
                    </a>
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 04 · CAN WE FIX IT ---------------- */}
      <section className="section" aria-labelledby="fix-title">
        <div className="shell">
          <SectionTitle
            id="fix-title"
            eyebrow="راه‌حل"
            title="می‌شود درستش کرد؟"
            text="بله — اما نه با نیت خوب. هر چیزی که اینجا آمده، در دست‌کم یک پرونده واقعی مطالعه یا اجرا شده است. ترتیب هم تصادفی نیست: بدون گام اول، بقیه گام‌ها اثر خود را از دست می‌دهند."
          />

          <div className="human__list">
            {SOLUTIONS.map((sol, i) => (
              <div className="human__row reveal" key={sol.id} data-reveal-delay={i * 50}>
                <span className="n latin">{String(i + 1).padStart(2, '0')}</span>
                <b>{sol.title}</b>
                <p>
                  {sol.text}
                  <span className="ev">
                    {sol.evidence}{' '}
                    <a href={sol.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {sol.source} ↗
                    </a>
                  </span>
                </p>
              </div>
            ))}
          </div>

          <Link className="loss__go" to="/sources" style={{ marginTop: '2rem' }}>
            همه منابع این آرشیو
            <ArrowIcon />
          </Link>
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
