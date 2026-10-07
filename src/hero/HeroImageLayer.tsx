import { useState } from 'react'
import { commons } from '../utils/images'
import { GHOST_SOURCE } from './heroConfig'

interface Props {
  file: string
  alt: string
  credit?: string
}

/**
 * The environmental record itself.
 *
 * One real photograph, plus layers that only exist so the photograph can come
 * apart: three horizontal bands cut from the same frame (tearing), one
 * rectangular region that can break out of alignment (frame break), a ghost of
 * an earlier frame still sitting in memory, and a single restrained chroma
 * pair. All of them are copies of project imagery — nothing is invented, and
 * nothing looks like a UI element.
 */
export function HeroImageLayer({ file, alt, credit }: Props) {
  const [loaded, setLoaded] = useState(false)
  const band = { backgroundImage: `url(${commons(file, 1600)})` }

  return (
    <div className="ha-img" data-loaded={loaded ? 'true' : 'false'}>
      <img
        className="ha-img__base"
        src={commons(file, 2000)}
        srcSet={`${commons(file, 900)} 900w, ${commons(file, 1600)} 1600w, ${commons(file, 2000)} 2000w`}
        sizes="100vw"
        alt={alt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <span className="ha-img__ghost" aria-hidden="true" style={{ backgroundImage: `url(${commons(GHOST_SOURCE, 1400)})` }} />
      <span className="ha-img__band ha-img__band--1" aria-hidden="true" style={band} />
      <span className="ha-img__band ha-img__band--2" aria-hidden="true" style={band} />
      <span className="ha-img__band ha-img__band--3" aria-hidden="true" style={band} />
      <span className="ha-img__break" aria-hidden="true" style={band} />
      <span className="ha-img__chroma ha-img__chroma--a" aria-hidden="true" style={band} />
      <span className="ha-img__chroma ha-img__chroma--b" aria-hidden="true" style={band} />
      {credit ? <span className="frame__credit">{credit}</span> : null}
    </div>
  )
}
