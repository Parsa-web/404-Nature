import { useEffect, useRef, useState } from 'react'
import { commons } from '../utils/images'

interface FrameProps {
  file: string
  alt: string
  credit?: string
  ratio?: '21' | '16' | '43' | '34' | '11'
  width?: number
  plain?: boolean
  eager?: boolean
  className?: string
  sizes?: string
  /** Subtle vertical drift for a few large editorial images. */
  parallax?: number
}

/**
 * Single image primitive: lazy loading, fixed aspect ratio (so nothing shifts),
 * an optional credit line, and a one-shot documentary reveal — the mask opens
 * while the frame settles out of a slight zoom.
 *
 * The reveal owns its own observer so it also works for images mounted inside
 * overlays and panels, which the page-level reveal pass never sees, and it
 * opens regardless if a slow network delays the decode.
 */
export function Frame({
  file,
  alt,
  credit,
  ratio = '16',
  width = 1400,
  plain,
  eager,
  className = '',
  sizes = '(max-width: 900px) 100vw, 55vw',
  parallax,
}: FrameProps) {
  const host = useRef<HTMLDivElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    if (
      eager ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setInView(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  // Fail-safe: on a slow connection the mask must not sit closed indefinitely.
  useEffect(() => {
    if (!inView || loaded) return
    const id = window.setTimeout(() => setTimedOut(true), 1600)
    return () => window.clearTimeout(id)
  }, [inView, loaded])

  return (
    <div
      ref={host}
      className={`frame ratio-${ratio} ${plain ? 'frame--plain' : ''} ${
        inView && (loaded || timedOut) ? 'is-revealed' : ''
      } ${className}`}
    >
      <img
        src={commons(file, width)}
        srcSet={`${commons(file, 640)} 640w, ${commons(file, 1024)} 1024w, ${commons(file, width)} ${width}w`}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        {...(parallax ? { 'data-parallax': String(parallax) } : {})}
      />
      {credit ? <span className="frame__credit">{credit}</span> : null}
    </div>
  )
}
