import { useEffect, useRef, useState, type ElementType } from 'react'

interface Props {
  text: string
  as?: ElementType
  className?: string
  /** Fires once shortly after mount — used for entrances. */
  autoOnMount?: boolean
  /** Fires on pointer enter. */
  onHover?: boolean
  /** Repeats on an interval, in ms. Omit for no loop. */
  interval?: number
}

/**
 * Storytelling device, not decoration: a short RGB-split burst.
 * Disabled entirely when the user prefers reduced motion.
 */
export function GlitchText({ text, as: Tag = 'span', className = '', autoOnMount, onHover, interval }: Props) {
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return
    const fire = () => {
      setActive(true)
      timer.current = window.setTimeout(() => setActive(false), 1000)
    }
    let mountId: number | undefined
    let loopId: number | undefined
    if (autoOnMount) mountId = window.setTimeout(fire, 450)
    if (interval) loopId = window.setInterval(fire, interval)
    return () => {
      window.clearTimeout(mountId)
      window.clearInterval(loopId)
      window.clearTimeout(timer.current)
    }
  }, [autoOnMount, interval])

  const trigger = () => {
    if (!onHover || reduced.current) return
    setActive(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(false), 900)
  }

  return (
    <Tag className={`glitch ${active ? 'is-glitching' : ''} ${className}`} onPointerEnter={trigger}>
      {text}
      <span className="glitch__layer glitch__layer--a" aria-hidden="true">
        {text}
      </span>
      <span className="glitch__layer glitch__layer--b" aria-hidden="true">
        {text}
      </span>
    </Tag>
  )
}
