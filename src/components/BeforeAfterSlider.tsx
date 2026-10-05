import { useCallback, useRef, useState } from 'react'
import { commons } from '../utils/images'
import type { Comparison } from '../data/types'

/**
 * Real drag-based image comparison. Works with mouse, touch and keyboard
 * (an invisible range input carries the accessible semantics).
 */
export function BeforeAfterSlider({ data }: { data: Comparison }) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = box.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // `pos` is always a percentage from the physical left edge, independent of
    // the RTL document direction, so the clip and the handle can never disagree.
    const ratio = (clientX - rect.left) / rect.width
    setPos(Math.min(100, Math.max(0, ratio * 100)))
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    box.current?.setPointerCapture(e.pointerId)
    move(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    move(e.clientX)
  }
  const stop = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (box.current?.hasPointerCapture(e.pointerId)) box.current.releasePointerCapture(e.pointerId)
  }

  return (
    <figure style={{ margin: 0 }}>
      <div
        className="ba"
        ref={box}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        style={{ ['--pos' as string]: `${pos}%` }}
      >
        {/* RTL timeline: the past sits on the right, today on the left. The base
            layer is "today" and the clipped overlay reveals the past. */}
        <img className="ba__img" src={commons(data.after.file, 1600)} alt={data.after.alt} loading="lazy" decoding="async" />
        <img
          className="ba__img ba__past"
          src={commons(data.before.file, 1600)}
          alt={data.before.alt}
          loading="lazy"
          decoding="async"
        />
        <span className="ba__tag ba__tag--after">{data.afterLabel}</span>
        <span className="ba__tag ba__tag--before">{data.beforeLabel}</span>
        <span className="ba__handle" style={{ left: `${pos}%` }}>
          <span className="ba__knob">↔</span>
        </span>
        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`مقایسه تصویر: ${data.beforeLabel} در برابر ${data.afterLabel}`}
        />
      </div>
      <figcaption className="ba-note">
        {data.note}
        <br />
        <span style={{ opacity: 0.7 }}>
          {data.before.credit} / {data.after.credit}
        </span>
      </figcaption>
    </figure>
  )
}
