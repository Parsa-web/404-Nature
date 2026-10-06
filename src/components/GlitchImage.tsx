import { useCallback, useEffect, useRef, useState } from 'react'
import { commons } from '../utils/images'

interface Props {
  file: string
  alt: string
  /** Second frame revealed through the distortion (e.g. the damaged state). */
  shiftFile?: string
  credit?: string
  eager?: boolean
  /** Fire one burst this long after mount, synchronised with the 404. */
  mountDelay?: number
  mountBurstMs?: number
  /** Average gap between rare idle bursts, in ms. */
  interval?: number
  idleBurstMs?: number
  className?: string
}

/**
 * Cinematic hero image that briefly tears into a second frame.
 * Carries the "healthy -> damaged" transition without a video file, and takes
 * part in the hero's single error event rather than looping on its own.
 */
export function GlitchImage({
  file,
  alt,
  shiftFile,
  credit,
  eager,
  mountDelay,
  mountBurstMs = 240,
  interval = 11000,
  idleBurstMs = 120,
  className = '',
}: Props) {
  const [mode, setMode] = useState<'off' | 'soft' | 'hard'>('off')
  const [loaded, setLoaded] = useState(false)
  const t = useRef<number | undefined>(undefined)

  const fire = useCallback((ms: number, hard: boolean) => {
    setMode(hard ? 'hard' : 'soft')
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setMode('off'), ms)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mountId: number | undefined
    if (mountDelay !== undefined) mountId = window.setTimeout(() => fire(mountBurstMs, true), mountDelay)

    let next: number | undefined
    const schedule = () => {
      if (!interval) return
      next = window.setTimeout(() => {
        if (!document.hidden) fire(idleBurstMs, false)
        schedule()
      }, interval * (0.75 + Math.random() * 0.7))
    }
    schedule()

    return () => {
      window.clearTimeout(mountId)
      window.clearTimeout(next)
      window.clearTimeout(t.current)
    }
  }, [mountDelay, mountBurstMs, interval, idleBurstMs, fire])

  const slice = shiftFile ?? file
  const ms = mode === 'hard' ? mountBurstMs : idleBurstMs
  return (
    <div
      className={`glitch-img ${mode !== 'off' ? 'is-glitching' : ''} ${mode === 'hard' ? 'is-hard' : ''} ${className}`}
      style={mode !== 'off' ? ({ ['--gl-dur' as string]: `${ms}ms` } as React.CSSProperties) : undefined}
    >
      <img
        src={commons(file, 2000)}
        srcSet={`${commons(file, 900)} 900w, ${commons(file, 1600)} 1600w, ${commons(file, 2000)} 2000w`}
        sizes="100vw"
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        data-loaded={loaded ? 'true' : 'false'}
      />
      <span
        className="glitch-img__slice glitch-img__slice--a"
        style={{ backgroundImage: `url(${commons(slice, 1600)})` }}
        aria-hidden="true"
      />
      <span
        className="glitch-img__slice glitch-img__slice--b"
        style={{ backgroundImage: `url(${commons(slice, 1600)})` }}
        aria-hidden="true"
      />
      {credit ? <span className="frame__credit">{credit}</span> : null}
    </div>
  )
}
