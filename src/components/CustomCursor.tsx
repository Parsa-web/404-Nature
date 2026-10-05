import { useEffect, useRef, useState } from 'react'

/**
 * A small trailing outline that sits behind the native cursor. Desktop pointers
 * only; never rendered for touch or reduced-motion users. Position is written
 * with `transform` inside one rAF loop, so it never triggers layout.
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const ok =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(ok)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ring.current
    if (!el) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let frame = 0
    let idle = true

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (idle) {
        idle = false
        x = targetX
        y = targetY
        el.classList.add('is-visible')
      }
      const hit = (e.target as HTMLElement | null)?.closest?.(
        'a, button, [role="button"], input, .ba, [data-cursor]',
      ) as HTMLElement | null
      el.dataset.mode = hit ? hit.dataset.cursor ?? 'link' : 'default'
    }
    const onLeave = () => el.classList.remove('is-visible')
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')

    const loop = () => {
      // Light easing gives the ring a touch of physical lag.
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return <div className="cursor-ring" ref={ring} data-mode="default" aria-hidden="true" />
}
