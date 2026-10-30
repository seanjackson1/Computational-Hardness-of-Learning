import type { ReactNode } from 'react'
import { sections } from '../content/sections'

export function AuthorPlaceholder({ label = 'Author explanation pending', note }: { label?: string; note: string }) {
  return (
    <div className="author-placeholder">
      <span className="eyebrow">Student writing area</span>
      <strong>{label}</strong>
      <p>{note}</p>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function Section({ id, number, title, kicker, children }: { id: string; number: string; title: string; kicker: string; children: ReactNode }) {
  const index = sections.findIndex((section) => section.id === id)
  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <header className="section-header">
        <span className="section-number">{number}</span>
        <div><p className="eyebrow">{kicker}</p><h2 id={`${id}-title`}>{title}</h2></div>
      </header>
      {children}
      <nav className="section-nav" aria-label={`${title} navigation`}>
        {index > 0 ? <a href={`#${sections[index - 1].id}`}>← {sections[index - 1].shortTitle}</a> : <span />}
        {index < sections.length - 1 ? <a href={`#${sections[index + 1].id}`}>{sections[index + 1].shortTitle} →</a> : <a href="#top">Back to top ↑</a>}
      </nav>
    </section>
  )
}

export function Stepper({ title, steps }: { title: string; steps: { label: string; formula?: ReactNode }[] }) {
  return (
    <Card className="stepper">
      <div className="card-heading"><span className="eyebrow">Proof skeleton</span><h3>{title}</h3></div>
      <ol className="steps">
        {steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.label}</strong>{step.formula}<small>TODO(author): proof explanation</small></div></li>)}
      </ol>
    </Card>
  )
}
