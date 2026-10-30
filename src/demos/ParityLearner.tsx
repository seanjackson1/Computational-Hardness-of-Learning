import { useMemo, useState } from 'react'
import { dotGF2, solveGF2, type Bit } from '../lib/gf2'

type Observation = { x: Bit[]; y: Bit }

function randomBits(length: number): Bit[] {
  const values = new Uint8Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => (value & 1) as Bit)
}

export function ParityLearner() {
  const [n, setN] = useState(5)
  const [secret, setSecret] = useState<Bit[]>(() => randomBits(5))
  const [observations, setObservations] = useState<Observation[]>([])
  const [revealed, setRevealed] = useState(false)
  const [input, setInput] = useState('00000')
  const [prediction, setPrediction] = useState<string>('')
  const result = useMemo(() => solveGF2(observations.map(({ x }) => x), observations.map(({ y }) => y), n), [observations, n])

  const restart = (size = n) => {
    setSecret(randomBits(size)); setObservations([]); setRevealed(false); setInput('0'.repeat(size)); setPrediction('')
  }
  const sample = (count: number) => {
    setObservations((current) => [...current, ...Array.from({ length: count }, () => { const x = randomBits(n); return { x, y: dotGF2(x, secret) } })])
  }
  const predict = () => {
    if (!/^[01]+$/.test(input) || input.length !== n) return setPrediction(`Enter exactly ${n} bits.`)
    if (!result.unique || !result.solution) return setPrediction('Multiple consistent secrets — collect more independent equations.')
    const x = input.split('').map(Number) as Bit[]
    setPrediction(`Prediction: ${dotGF2(x, result.solution)} · Actual: ${dotGF2(x, secret)}`)
  }

  return (
    <div className="demo">
      <div className="demo-heading"><div><span className="eyebrow">Demo B</span><h3>Learn a parity function</h3></div><span className={`status-chip ${result.unique ? 'success' : ''}`}>rank {result.rank} / {n}</span></div>
      <div className="toolbar">
        <label className="select-label">Dimensions<select value={n} onChange={(event) => { const size = Number(event.target.value); setN(size); restart(size) }}>{[4, 5, 6, 7, 8].map((size) => <option key={size}>{size}</option>)}</select></label>
        <button onClick={() => restart()}>New secret</button><button onClick={() => sample(1)}>Sample one</button><button onClick={() => sample(5)}>Sample five</button><button className="ghost" onClick={() => setRevealed(true)}>Reveal secret</button>
      </div>
      <div className="rank-track" aria-label={`Equation rank ${result.rank} of ${n}`}><span style={{ width: `${(result.rank / n) * 100}%` }} /></div>
      <p className="demo-status" aria-live="polite">{result.unique ? `Unique secret recovered: ${result.solution?.join('')}` : 'Multiple consistent secrets'}</p>
      {revealed && <p className="reveal">Hidden secret: <code>{secret.join('')}</code></p>}
      <div className="equation-table" role="region" aria-label="Observed parity equations" tabIndex={0}>
        <table><thead><tr><th>#</th><th>Input x</th><th>Label</th><th>Rank after row</th></tr></thead><tbody>
          {observations.length === 0 ? <tr><td colSpan={4}>No samples yet.</td></tr> : observations.map((row, index) => <tr key={`${row.x.join('')}-${index}`}><td>{index + 1}</td><td><code>{row.x.join('')}</code></td><td>{row.y}</td><td>{solveGF2(observations.slice(0, index + 1).map(({ x }) => x), observations.slice(0, index + 1).map(({ y }) => y), n).rank}</td></tr>)}
        </tbody></table>
      </div>
      <div className="prediction-row"><label>Test input<input value={input} maxLength={n} inputMode="numeric" onChange={(event) => setInput(event.target.value.replace(/[^01]/g, ''))} /></label><button onClick={predict}>Predict</button></div>
      {prediction && <p className="demo-status" aria-live="polite">{prediction}</p>}
    </div>
  )
}
