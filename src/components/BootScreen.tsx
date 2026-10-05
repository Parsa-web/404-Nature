import { useEffect, useState } from 'react'

/** Shown once per browser session, and only until the first paint is ready. */
let alreadyBooted = false

export function BootScreen() {
  const [show, setShow] = useState(!alreadyBooted)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!show) return
    alreadyBooted = true

    const finish = () => {
      setLeaving(true)
      window.setTimeout(() => setShow(false), 520)
    }
    // Leave as soon as the document is ready; the cap keeps it from ever
    // becoming an artificial wait.
    const cap = window.setTimeout(finish, 1100)
    const min = window.setTimeout(() => {
      if (document.readyState === 'complete') finish()
      else window.addEventListener('load', finish, { once: true })
    }, 420)

    return () => {
      window.clearTimeout(cap)
      window.clearTimeout(min)
      window.removeEventListener('load', finish)
    }
  }, [show])

  if (!show) return null
  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="boot__inner">
        <b className="boot__code">۴۰۴</b>
        <span className="boot__title">طبیعت پیدا نشد</span>
        <span className="boot__bar" />
      </div>
    </div>
  )
}
