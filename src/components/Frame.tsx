import { useState } from 'react'
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
}

/**
 * Single image primitive: lazy loading, fade-in on decode, fixed aspect ratio
 * (so nothing shifts) and an optional credit line.
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
}: FrameProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`frame ratio-${ratio} ${plain ? 'frame--plain' : ''} ${className}`}>
      <img
        src={commons(file, width)}
        srcSet={`${commons(file, 640)} 640w, ${commons(file, 1024)} 1024w, ${commons(file, width)} ${width}w`}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className={loaded ? 'is-loaded' : ''}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {credit ? <span className="frame__credit">{credit}</span> : null}
    </div>
  )
}
