import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ArrowIcon } from '../components/Icons'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'

export function About() {
  useReveal()
  useSeo({
    title: 'درباره ۴۰۴ | طبیعت پیدا نشد',
    description:
      'هدف ۴۰۴ این است که تغییرات محیط زیست را از پشت اعداد و اخبار بیرون بیاورد و به تجربه‌ای قابل لمس تبدیل کند.',
  })

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'درباره ۴۰۴' }]} />
          <h1>درباره ۴۰۴</h1>
          <p className="lede">
            هدف ۴۰۴ این است که تغییرات محیط زیست را از پشت اعداد و اخبار بیرون بیاورد و به تجربه‌ای قابل لمس تبدیل کند.
          </p>
        </div>
      </header>

      <div className="shell">
        <div className="about-grid">
          <h2>ایده</h2>
          <div className="prose reveal">
            <p>
              خطای ۴۰۴ در وب یعنی چیزی که دنبالش بودید، دیگر در آن نشانی وجود ندارد. این پروژه همین ایده را به طبیعت
              منتقل می‌کند: مکان‌هایی که یک نسل پیش بخشی از زندگی روزمره بودند، امروز دیگر همان چیزی نیستند که بودند.
            </p>
            <p>
              ۴۰۴ یک کمپین هشدار نیست و قصد ندارد ترس بفروشد. یک آرشیو است. هر پرونده یک مکان را مستند می‌کند: چه بود،
              چه تغییری کرد، چرا مهم است، انسان چه نقشی داشت و چه چیزی را می‌توان تغییر داد.
            </p>
          </div>
        </div>

        <div className="about-grid">
          <h2>زمینه</h2>
          <div className="prose reveal">
            <p>
              این پروژه در چارچوب درس «انسان و محیط زیست» ساخته شده است، اما از ابتدا به‌عنوان یک اثر مستقل طراحی شد:
              یک نمایشگاه دیجیتال که بدون زمینه درسی هم معنا داشته باشد.
            </p>
          </div>
        </div>

        <div className="about-grid">
          <h2>روش</h2>
          <div className="prose reveal">
            <p>
              قاعده اصلی پروژه ساده است: هیچ عدد، تاریخ یا درصدی بدون منبع منتشر نمی‌شود. تمام داده‌های کمی از گزارش‌های
              UNEP، یونسکو، کنوانسیون رامسر، ناسا، USGS، IUCN یا مقالات داوری‌شده گرفته شده‌اند و پیوند مستقیم هر منبع در
              دسترس است.
            </p>
            <p>
              جایی که جفت تصویر «قبل و بعد» با مجوز آزاد و از زاویه یکسان در دسترس نبود، این محدودیت صریحاً زیر همان
              مقایسه نوشته شده است. در این پروژه تصویر بازسازی‌شده، تاریخ ساختگی و آمار تقریبی استفاده نمی‌شود.
            </p>
            <p>
              تصاویر از Wikimedia Commons با مجوز آزاد انتخاب شده‌اند و اعتبار عکاس یا سازمان سازنده زیر هر تصویر درج شده
              است.
            </p>
          </div>
        </div>

        <div className="about-grid">
          <h2>ساخت</h2>
          <div className="prose reveal">
            <p>
              سایت با React، TypeScript و Vite ساخته شده است؛ بدون کتابخانه رابط کاربری آماده، بدون انیمیشن سنگین و با
              پشتیبانی از <span className="latin">prefers-reduced-motion</span> برای کاربرانی که حرکت کمتری ترجیح
              می‌دهند. محتوا در یک لایه داده ساختاریافته نگه‌داری می‌شود تا افزودن پرونده تازه ساده باشد.
            </p>
            <p>
              <Link className="loss__go" to="/sources" style={{ marginTop: '0.6rem' }}>
                فهرست کامل منابع
                <ArrowIcon />
              </Link>
            </p>
          </div>
        </div>
      </div>

      <section className="final" aria-label="جمله پایانی">
        <div>
          <p className="final__a reveal reveal--still">چیزی که امروز عادی به نظر می‌رسد، ممکن است فردا دیگر وجود نداشته باشد.</p>
          <div className="final__line reveal reveal--still" data-reveal-delay={500} />
        </div>
      </section>
    </>
  )
}
