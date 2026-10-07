import { IMAGES, commons } from '../utils/images'

/**
 * Wrong records bleeding into the hero.
 *
 * Three rectangular pieces of other archive photographs — a dried wetland, a
 * Hyrcanian forest, Anzali in 1992 — clipped inside the hero and displaced
 * like corrupted image data. They are not cards: no border, no radius, no
 * container; CSS only ever shows them during an archive intrusion.
 *
 * The layers mount a few seconds after the hero settles so their files are
 * decoded before the first event needs them, and they never carry meaning for
 * assistive technology.
 */
const PIECES = [IMAGES.hamounDry, IMAGES.hyrcanianB, IMAGES.anzali1992]

export function ArchiveFragments() {
  return (
    <div className="hero__frag" aria-hidden="true">
      {PIECES.map((file, i) => (
        <span
          key={file}
          className={`hero__frag-piece hero__frag-piece--${i + 1}`}
          style={{ backgroundImage: `url(${commons(file, 1100)})` }}
        />
      ))}
    </div>
  )
}
