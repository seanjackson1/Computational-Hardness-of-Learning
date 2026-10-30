import { useMemo, useState } from 'react'
import { finiteClassBound } from '../lib/finiteClassBound'
import { MathBlock } from '../components/MathText'

export function SampleBoundCalculator({ compact = false }: { compact?: boolean }) {
  const [n, setN] = useState(12)
  const [epsilon, setEpsilon] = useState(0.1)
  const [delta, setDelta] = useState(0.05)
  const bound = useMemo(() => finiteClassBound({ n, epsilon, delta }), [n, epsilon, delta])

  return (
    <div className={`demo ${compact ? 'compact' : ''}`}>
      <div className="demo-heading">
        <div><span className="eyebrow">Live calculator</span><h3>Finite-class sample bound</h3></div>
        <span className="status-chip">Sufficient bound</span>
      </div>
      <div className="calculator-layout">
        <div className="control-stack">
          <label>Key length <output>{n}</output><input type="range" min="2" max="40" value={n} onChange={(event) => setN(Number(event.target.value))} /></label>
          <label>Epsilon <output>{epsilon.toFixed(2)}</output><input type="range" min="0.01" max="0.5" step="0.01" value={epsilon} onChange={(event) => setEpsilon(Number(event.target.value))} /></label>
          <label>Delta <output>{delta.toFixed(3)}</output><input type="range" min="0.001" max="0.5" step="0.001" value={delta} onChange={(event) => setDelta(Number(event.target.value))} /></label>
        </div>
        <div className="bound-result" aria-live="polite"><span>m ≥</span><strong>{bound}</strong><small>examples</small></div>
      </div>
      <MathBlock>{`m = \\left\\lceil\\frac{${n}\\ln 2 + \\ln(1/${delta})}{${epsilon}}\\right\\rceil = ${bound}`}</MathBlock>
    </div>
  )
}
