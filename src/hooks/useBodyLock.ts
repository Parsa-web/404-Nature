import { useEffect } from 'react'

/** Locks page scroll while an overlay is open. */
export function useBodyLock(locked: boolean): void {
  useEffect(() => {
    document.body.classList.toggle('is-locked', locked)
    return () => document.body.classList.remove('is-locked')
  }, [locked])
}
