import { Link } from 'react-router-dom'
import { GlitchText } from '../components/GlitchText'
import { ArrowIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'

export function NotFound() {
  useSeo({
    title: 'صفحه پیدا نشد | ۴۰۴ — طبیعت پیدا نشد',
    description: 'این صفحه پیدا نشد. اما مسئله اصلی این است: چه چیزهایی در دنیای واقعی دیگر پیدا نمی‌شوند؟',
  })

  return (
    <section className="nf">
      <div>
        <GlitchText as="p" text="404" className="nf__code latin" autoOnMount interval={3600} />
        <h1>این صفحه پیدا نشد.</h1>
        <p className="nf__q">
          اما مسئله اصلی این است:
          <br />
          چه چیزهایی در دنیای واقعی دیگر پیدا نمی‌شوند؟
        </p>
        <div className="nf__actions">
          <Link className="btn btn--accent" to="/">
            بازگشت به خانه
            <ArrowIcon className="btn__arrow" />
          </Link>
          <Link className="btn" to="/lost-places">
            مکان‌های از دست‌رفته
          </Link>
        </div>
      </div>
    </section>
  )
}
