import { useEffect, useRef, useState } from 'react'
import { commons } from '../utils/images'

interface Props {
  file: string
  alt: string
  /** Second frame revealed through the distortion (e.g. the damaged state). */
  shiftFile?: string
  credit?: string
  eager?: boolean
  /** Average gap between distortion bursts, in ms. */
  interval?: number
  className?: string
}

/**
 * Cinematic hero image that briefly tears into a second frame.
 * Used to carry the "healthy -> damaged" transition without a video file.
 */
export function GlitchImage({ file, alt, shiftFile, credit, eager, interval = 11000, className = '' }: Props) {
  const [active, setActive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const t = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let next: number | undefined
    const schedule = () => {
      // Irregular, infrequent bursts: the image is a damaged record, not a loop.
      next = window.setTimeout(() => {
        if (!document.hidden) {
          setActive(true)
          t.current = window.setTimeout(() => setActive(false), 620)
        }
        schedule()
      }, interval * (0.75 + Math.random() * 0.7))
    }
    schedule()

    return () => {
      window.clearTimeout(next)
      window.clearTimeout(t.current)
    }
  }, [interval])

  const slice = shiftFile ?? file
  return (
    <div className={`glitch-img ${active ? 'is-glitching' : ''} ${className}`}>
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
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1.4s var(--ease-cine)' }}
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
