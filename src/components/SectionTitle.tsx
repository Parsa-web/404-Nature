interface Props {
  eyebrow?: string
  title: string
  text?: string
  children?: React.ReactNode
}

export function SectionTitle({ eyebrow, title, text, children }: Props) {
  return (
    <header className="section-head reveal">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 style={{ marginTop: eyebrow ? '0.9rem' : 0 }}>{title}</h2>
      </div>
      {text ? <p>{text}</p> : null}
      {children}
    </header>
  )
}
