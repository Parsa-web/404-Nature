const TEXT = '۴۰۴'

/**
 * The 404 as a layered signal rather than a heading.
 *
 * base   — the only readable layer; never destroyed
 * ghost  — a permanent, almost invisible echo that wakes up during events
 * s1..s3 — horizontal strips, clipped and displaced during a collapse
 * scan   — a single sweep line that crosses the number
 *
 * All layers share the same glyphs, so the number stays legible even mid-event.
 */
export function Signal404({ onPointerEnter }: { onPointerEnter?: () => void }) {
  return (
    <span className="n404 hero__404" onPointerEnter={onPointerEnter}>
      <span className="n404__base">{TEXT}</span>
      <span className="n404__ghost" aria-hidden="true">
        {TEXT}
      </span>
      <span className="n404__slice n404__slice--1" aria-hidden="true">
        {TEXT}
      </span>
      <span className="n404__slice n404__slice--2" aria-hidden="true">
        {TEXT}
      </span>
      <span className="n404__slice n404__slice--3" aria-hidden="true">
        {TEXT}
      </span>
      <span className="n404__scan" aria-hidden="true" />
    </span>
  )
}
