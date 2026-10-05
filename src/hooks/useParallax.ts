import { useEffect } from 'react'

/**
 * Extremely subtle parallax for a handful of large environmental images.
 *
 * Opt in by adding `data-parallax="<strength-in-px>"` to an element: the hook
 * keeps a `--py` offset in sync and the stylesheet composes it into that
 * element's transform. Only elements currently in the viewport are written to,
 * all work happens in one rAF-throttled scroll handler, and nothing triggers
 * layout. Disabled for reduced motion and for narrow/touch viewports.
 */
export function useParallax(deps: unknown[] = []): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) return

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    if (!nodes.length) return

    const visible = new Set<HTMLElement>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement
          if (e.isIntersecting) visible.add(el)
          else visible.delete(el)
        })
      },
      { rootMargin: '15% 0px' },
    )
    nodes.forEach((n) => io.observe(n))

    let frame = 0
    const apply = () => {
      frame = 0
      const vh = window.innerHeight
      visible.forEach((el) => {
        const strength = Number(el.dataset.parallax) || 0
        const rect = el.getBoundingClientRect()
        // -1 (just below the fold) .. 1 (just above it)
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
        // Published as a variable so CSS can compose it with reveal/zoom transforms.
        el.style.setProperty('--py', `${(-progress * strength).toFixed(2)}px`)
      })
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      nodes.forEach((n) => n.style.removeProperty('--py'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
