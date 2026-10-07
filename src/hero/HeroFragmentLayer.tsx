import { commons } from '../utils/images'
import type { FragmentSlot } from './useHeroArchive'

/**
 * Wrong records bleeding into the hero.
 *
 * Rectangular pieces of other archive photographs, clipped inside the media
 * layer and displaced like corrupted image data. They are not cards: no
 * border, no radius, no shadow, no backdrop, no container. Positions come from
 * percentage-based poses, so a piece can never escape the viewport at any
 * width. CSS only ever reveals them while an intrusion is running.
 */
export function HeroFragmentLayer({ slots }: { slots: FragmentSlot[] }) {
  return (
    <div className="ha-frag" aria-hidden="true">
      {slots.map((slot, i) => (
        <span
          key={`${slot.src}-${i}`}
          className={`ha-frag__piece ha-frag__piece--${i + 1}`}
          data-pose={slot.pose}
          style={{ backgroundImage: `url(${commons(slot.src, 1100)})` }}
        />
      ))}
    </div>
  )
}
