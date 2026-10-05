import { useCallback, useEffect, useRef, useState, type ElementType } from 'react'

interface Props {
  text: string
  as?: ElementType
  className?: string
  /** Fires once shortly after mount — used for entrances and route changes. */
  autoOnMount?: boolean
  /** Fires on pointer enter. */
  onHover?: boolean
  /** Average gap between idle bursts, in ms. Omit for no idle loop. */
  interval?: number
}

const BURST_MS = 620

/**
 * Storytelling device, not decoration: one short tear-and-scanline burst, then
 * back to a clean state. Idle bursts are irregular on purpose — a steady pulse
 * reads as a loading spinner, an irregular one reads as a damaged record.
 * Disabled entirely when the user prefers reduced motion.
 */
export function GlitchText({ text, as: Tag = 'span', className = '', autoOnMount, onHover, interval }: Props) {
  const [active, setActive] = useState(false)
  const burst = useRef<number | undefined>(undefined)
  const idle = useRef<number | undefined>(undefined)
  const reduced = useRef(false)

  const fire = useCallback(() => {
    if (reduced.current) return
    setActive(true)
    window.clearTimeout(burst.current)
    burst.current = window.setTimeout(() => setActive(false), BURST_MS)
  }, [])

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return

    let mountId: number | undefined
    if (autoOnMount) mountId = window.setTimeout(fire, 520)

    const scheduleIdle = () => {
      if (!interval) return
      // +/- 40% jitter so bursts never feel metronomic.
      const next = interval * (0.8 + Math.random() * 0.6)
      idle.current = window.setTimeout(() => {
        if (!document.hidden) fire()
        scheduleIdle()
      }, next)
    }
    scheduleIdle()

    return () => {
      window.clearTimeout(mountId)
      window.clearTimeout(idle.current)
      window.clearTimeout(burst.current)
    }
  }, [autoOnMount, interval, fire])

  return (
    <Tag
      className={`glitch ${active ? 'is-glitching' : ''} ${className}`}
      onPointerEnter={onHover ? fire : undefined}
    >
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
