import { BlockMath, InlineMath } from 'react-katex'

const fallback = (error: Error) => <code className="math-error" title={error.message}>Formula unavailable</code>

export function MathInline({ children }: { children: string }) {
  return <InlineMath math={children} renderError={fallback} />
}

export function MathBlock({ children }: { children: string }) {
  return <div className="math-scroll"><BlockMath math={children} renderError={fallback} /></div>
}
