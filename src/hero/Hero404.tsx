const TEXT = '۴۰۴'

/**
 * The 404 as a character in the failing system, not a heading.
 *
 * base   — the only always-visible layer; never destroyed, never unreadable
 * ghost  — an echo that lags behind the base during a failure
 * s1..s3 — horizontal strips that tile the number exactly, so displacing one
 *          reads as a tear rather than a doubled image
 * c1..c3 — one column per glyph, so a single character can slip out of place
 * scan   — a single line that crosses the number during detection
 *
 * Every layer carries the same glyphs. Whatever the hero is doing, "۴۰۴" is
 * still on screen.
 */
export function Hero404({ onPointerEnter }: { onPointerEnter?: () => void }) {
  return (
    <span className="n404 hero__404" onPointerEnter={onPointerEnter}>
      <span className="n404__base">{TEXT}</span>
      <span className="n404__ghost" aria-hidden="true">{TEXT}</span>
      <span className="n404__slice n404__slice--1" aria-hidden="true">{TEXT}</span>
      <span className="n404__slice n404__slice--2" aria-hidden="true">{TEXT}</span>
      <span className="n404__slice n404__slice--3" aria-hidden="true">{TEXT}</span>
      <span className="n404__col n404__col--1" aria-hidden="true">{TEXT}</span>
      <span className="n404__col n404__col--2" aria-hidden="true">{TEXT}</span>
      <span className="n404__col n404__col--3" aria-hidden="true">{TEXT}</span>
      <span className="n404__scan" aria-hidden="true" />
    </span>
  )
}
