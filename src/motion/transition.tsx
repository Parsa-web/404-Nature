import { createContext, useContext } from 'react'

export type Phase = 'in' | 'out'

export interface TransitionState {
  phase: Phase
  /** Increments on every committed route swap so enter animations can restart. */
  token: number
}

export const TransitionContext = createContext<TransitionState>({ phase: 'in', token: 0 })

export function useTransition(): TransitionState {
  return useContext(TransitionContext)
}

/** Exit duration must stay in sync with `.page.is-leaving` in motion.css. */
export const EXIT_MS = 280
