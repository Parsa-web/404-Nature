interface Props {
  /** Set when a section uses aria-labelledby to reference this heading. */
  id?: string
  eyebrow?: string
  title: string
  text?: string
  children?: React.ReactNode
}

export function SectionTitle({ id, eyebrow, title, text, children }: Props) {
  return (
    <header className="section-head reveal">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id} style={{ marginTop: eyebrow ? '0.9rem' : 0 }}>{title}</h2>
      </div>
      {text ? (
        <p className="reveal" data-reveal-delay={140}>
          {text}
        </p>
      ) : null}
      {children}
    </header>
  )
}
