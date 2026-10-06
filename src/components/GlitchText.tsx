import { useCallback, useEffect, useRef, useState, type ElementType } from 'react'

interface Props {
  text: string
  as?: ElementType
  className?: string
  /** Fire one burst this long after mount. Omit for none. */
  mountDelay?: number
  /** Duration of the mount burst — the single hard "system error" impact. */
  mountBurstMs?: number
  /** Fire a very short burst on pointer enter. */
  onHover?: boolean
  /** Average gap between rare idle bursts, in ms. Omit for no idle loop. */
  interval?: number
  /** Duration of idle / hover bursts. Kept tiny: "did I just see that?" */
  idleBurstMs?: number
}

type Mode = 'off' | 'soft' | 'hard'

/**
 * A damaged archive record, not decoration. One hard burst during the hero
 * entrance, then only rare, very short micro-glitches. Disabled entirely for
 * users who prefer reduced motion.
 */
export function GlitchText({
  text,
  as: Tag = 'span',
  className = '',
  mountDelay,
  mountBurstMs = 220,
  onHover,
  interval,
  idleBurstMs = 110,
}: Props) {
  const [mode, setMode] = useState<Mode>('off')
  const burst = useRef<number | undefined>(undefined)
  const idle = useRef<number | undefined>(undefined)
  const reduced = useRef(false)

  const fire = useCallback((ms: number, hard: boolean) => {
    if (reduced.current) return
    setMode(hard ? 'hard' : 'soft')
    window.clearTimeout(burst.current)
    burst.current = window.setTimeout(() => setMode('off'), ms)
  }, [])

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return

    let mountId: number | undefined
    if (mountDelay !== undefined) mountId = window.setTimeout(() => fire(mountBurstMs, true), mountDelay)

    const scheduleIdle = () => {
      if (!interval) return
      // +/- 40% jitter so bursts never read as a metronome.
      idle.current = window.setTimeout(() => {
        if (!document.hidden) fire(idleBurstMs, false)
        scheduleIdle()
      }, interval * (0.8 + Math.random() * 0.6))
    }
    scheduleIdle()

    return () => {
      window.clearTimeout(mountId)
      window.clearTimeout(idle.current)
      window.clearTimeout(burst.current)
    }
  }, [mountDelay, mountBurstMs, interval, idleBurstMs, fire])

  const ms = mode === 'hard' ? mountBurstMs : idleBurstMs
  return (
    <Tag
      className={`glitch ${mode !== 'off' ? 'is-glitching' : ''} ${mode === 'hard' ? 'is-hard' : ''} ${className}`}
      style={mode !== 'off' ? ({ ['--gl-dur' as string]: `${ms}ms` } as React.CSSProperties) : undefined}
      onPointerEnter={onHover ? () => fire(idleBurstMs, false) : undefined}
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
