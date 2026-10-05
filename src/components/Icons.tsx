interface P {
  size?: number
  className?: string
}

export const SearchIcon = ({ size = 18, className }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const MenuIcon = ({ size = 18, className }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const CloseIcon = ({ size = 18, className }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/** Arrow pointing to the reading direction end (left in RTL). */
export const ArrowIcon = ({ size = 16, className }: P) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 12H4M10 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
