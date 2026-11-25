import { useMemo, useState } from 'react'
import { dotGF2, solveGF2, type Bit } from '../lib/gf2'

type Observation = { x: Bit[]; y: Bit; rank: number }

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

  const reset = (size = n) => {
    setObservations([])
    setRevealed(false)
    setInput('0'.repeat(size))
    setPrediction('')
  }
  const restart = (size = n) => {
    setSecret(randomBits(size))
    reset(size)
  }
  const sample = (count: number) => {
    const newInputs = Array.from({ length: count }, () => randomBits(n))
    setObservations((current) => {
      const updated = [...current]
      for (const x of newInputs) {
        const y = dotGF2(x, secret)
        const rank = updated[updated.length - 1]?.rank === n ? n : solveGF2(
          [...updated.map((row) => row.x), x], [...updated.map((row) => row.y), y], n,
        ).rank
        updated.push({ x, y, rank })
      }
      return updated
    })
    setPrediction('')
  }
  const predict = () => {
    if (!/^[01]+$/.test(input) || input.length !== n) return setPrediction(`Enter exactly ${n} bits.`)
    if (!result.unique || !result.solution) return setPrediction('Multiple consistent secrets — collect more independent equations.')
    const x = input.split('').map(Number) as Bit[]
    setPrediction(`Prediction: ${dotGF2(x, result.solution)} · Actual: ${dotGF2(x, secret)}`)
  }

  return (
    <div className="demo">
      <div className="demo-heading"><h3>Learn a parity function</h3><span className={`status-chip ${result.unique ? 'success' : ''}`}>Rank {result.rank} / {n}</span></div>
      <div className="toolbar">
        <label className="select-label">Dimensions<select value={n} onChange={(event) => { const size = Number(event.target.value); setN(size); restart(size) }}>{[4, 5, 6, 7, 8].map((size) => <option key={size}>{size}</option>)}</select></label>
        <button type="button" onClick={() => restart()}>New secret</button><button type="button" onClick={() => sample(1)}>Sample one</button><button type="button" onClick={() => sample(5)}>Sample five</button><button type="button" className="ghost" onClick={() => setRevealed(true)}>Reveal secret</button><button type="button" className="ghost" onClick={() => reset()}>Reset samples</button>
      </div>
      <div className="rank-track" role="progressbar" aria-label="Equation rank" aria-valuemin={0} aria-valuemax={n} aria-valuenow={result.rank}><span style={{ width: `${(result.rank / n) * 100}%` }} /></div>
      <p className="demo-status" aria-live="polite">{result.unique ? `Unique secret recovered: ${result.solution?.join('')}` : 'Multiple consistent secrets'}</p>
      {revealed && <p className="reveal">Hidden secret: <code>{secret.join('')}</code></p>}
      <div className="equation-table" role="region" aria-label="Observed parity equations" tabIndex={0}>
        <table><thead><tr><th>#</th><th>Input x</th><th>Label</th><th>Rank after row</th></tr></thead><tbody>
          {observations.length === 0 ? <tr><td colSpan={4}>No samples yet.</td></tr> : observations.map((row, index) => <tr key={index}><td>{index + 1}</td><td><code>{row.x.join('')}</code></td><td>{row.y}</td><td>{row.rank}</td></tr>)}
        </tbody></table>
      </div>
      <form className="prediction-row" onSubmit={(event) => { event.preventDefault(); predict() }}><label>Test input<input value={input} maxLength={n} inputMode="numeric" autoComplete="off" onChange={(event) => { setInput(event.target.value.replace(/[^01]/g, '')); setPrediction('') }} /></label><button type="submit">Predict</button></form>
      {prediction && <p className="demo-status" aria-live="polite">{prediction}</p>}
    </div>
  )
}
