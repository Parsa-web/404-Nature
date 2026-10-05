import { useEffect } from 'react'

/**
 * Adds `is-in` to every `.reveal` element once it enters the viewport.
 * One shared observer per route render keeps this cheap.
 */
export function useReveal(deps: unknown[] = []): void {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    if (!nodes.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay ?? 0)
          window.setTimeout(() => el.classList.add('is-in'), delay)
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
