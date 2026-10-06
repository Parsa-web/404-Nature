import { useEffect, useRef } from 'react'

/**
 * Drives the hero as one coherent "system error" event:
 *
 *   black + noise -> 404 renders badly -> hard glitch impact ->
 *   image + typography stabilise -> documentary calm
 *
 * The choreography itself is CSS (transform / opacity / clip-path only, so it
 * stays on the compositor). This hook only:
 *   1. arms it on the first frame after mount, so every layer starts together;
 *   2. writes a 0..1 scroll-out progress var used to lift the hero away.
 *
 * Both are skipped when the user prefers reduced motion.
 */
export function useHeroSequence<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) {
      el.dataset.seq = 'stable'
      return
    }

    // The full error event is a first-impression device. Coming back to the
    // home page later in the same session plays a short, calm entrance
    // instead of replaying the failure.
    const seen = sessionStorage.getItem('hero-seq') === '1'
    let raf0 = 0
    let done: number | undefined
    if (seen) {
      el.classList.add('hero--quick')
      el.dataset.seq = 'stable'
    } else {
      // Arm on the next frame so all layers share one start time.
      raf0 = requestAnimationFrame(() => {
        el.dataset.seq = 'run'
      })
      // Mark the sequence finished so idle micro-glitches can take over.
      done = window.setTimeout(() => {
        if (ref.current) ref.current.dataset.seq = 'stable'
        sessionStorage.setItem('hero-seq', '1')
      }, 1900)
    }

    // --- scroll-out ------------------------------------------------------
    let ticking = false
    let last = -1
    const write = () => {
      ticking = false
      const h = el.offsetHeight || 1
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)))
      const v = Math.round(p * 100) / 100
      if (v !== last) {
        last = v
        el.style.setProperty('--ho', String(v))
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(write)
    }
    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (raf0) cancelAnimationFrame(raf0)
      window.clearTimeout(done)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return ref
}
