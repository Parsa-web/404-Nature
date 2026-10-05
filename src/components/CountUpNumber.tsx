import { useEffect, useRef, useState } from 'react'
import { faNum } from '../utils/text'

const FA_DIGITS = /^[\u06F0-\u06F9\u066C\u066B٫,\s]+$/

function toNumber(fa: string): number | null {
  const latin = fa.replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[^\d]/g, '')
  if (!latin) return null
  const n = Number(latin)
  return Number.isFinite(n) ? n : null
}

/**
 * Short, restrained reveal for the big figures on the data page. Only plain
 * numeric headlines animate; ranges and words are rendered untouched.
 */
export function CountUpNumber({ value, className }: { value: string; className?: string }) {
  const host = useRef<HTMLDivElement | null>(null)
  const target = FA_DIGITS.test(value.trim()) ? toNumber(value) : null
  const grouped = value.includes('٫') || value.includes('،')
  const [shown, setShown] = useState<string>(target === null ? value : faNum(0))

  useEffect(() => {
    if (target === null) return
    const el = host.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }

    let frame = 0
    const run = () => {
      const start = performance.now()
      const DURATION = 850
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        // easeOutExpo: fast settle, no bounce.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -9 * t)
        const current = Math.round(target * eased)
        setShown(grouped ? faNum(current.toLocaleString('en-US')).replace(/,/g, '٫') : faNum(current))
        if (t < 1) frame = window.requestAnimationFrame(step)
        else setShown(value)
      }
      frame = window.requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [target, value, grouped])

  return (
    <div className={className} ref={host}>
      {target === null ? value : <span className="tabular">{shown}</span>}
    </div>
  )
}
