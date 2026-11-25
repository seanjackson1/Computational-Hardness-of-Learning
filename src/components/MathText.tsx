import katex from 'katex'

type MathProps = { children: string; macros?: Record<string, string> }

function renderMath(source: string, macros: MathProps['macros'], displayMode = false) {
  return { __html: katex.renderToString(source, { macros: { ...macros }, displayMode, throwOnError: false, trust: false }) }
}

export function MathInline({ children, macros }: MathProps) {
  const wide = children.length > 52
  return <span className={wide ? 'wide-inline-math' : 'inline-math'} tabIndex={wide ? 0 : undefined} dangerouslySetInnerHTML={renderMath(children, macros)} />
}

export function MathBlock({ children, macros }: MathProps) {
  return <div className="math-scroll" tabIndex={children.length > 65 ? 0 : undefined} dangerouslySetInnerHTML={renderMath(children, macros, true)} />
}
