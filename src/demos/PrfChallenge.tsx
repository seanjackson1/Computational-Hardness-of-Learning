import { useEffect, useRef, useState } from 'react'
import { generateHmacKey, queryHmac, RandomFunctionOracle, validBitString } from '../lib/cryptoOracles'
import type { Bit } from '../lib/gf2'

type Branch = 'PRF' | 'Random'
type Query = { input: string; output: Bit; repeated: boolean }

function chooseBranch(): Branch {
  const byte = new Uint8Array(1); crypto.getRandomValues(byte); return byte[0] & 1 ? 'PRF' : 'Random'
}

export function PrfChallenge() {
  const n = 12
  const [branch, setBranch] = useState<Branch>('Random')
  const [key, setKey] = useState<CryptoKey | null>(null)
  const randomOracle = useRef(new RandomFunctionOracle())
  const [input, setInput] = useState('000000000000')
  const [queries, setQueries] = useState<Query[]>([])
  const [revealed, setRevealed] = useState(false)
  const [message, setMessage] = useState('Start a new challenge, then query the oracle.')
  const supported = Boolean(globalThis.crypto?.subtle)

  const newChallenge = async () => {
    const next = chooseBranch(); setBranch(next); setQueries([]); setRevealed(false); randomOracle.current = new RandomFunctionOracle()
    setKey(next === 'PRF' ? await generateHmacKey() : null); setMessage('Challenge ready. The branch is hidden.')
  }
  useEffect(() => { if (supported) void newChallenge() }, [])

  const query = async () => {
    if (!validBitString(input, n)) return setMessage(`Enter exactly ${n} binary digits.`)
    if (queries.length >= 25) return setMessage('Query limit reached. Make a guess or start again.')
    const repeated = queries.some((item) => item.input === input)
    const output = branch === 'PRF' && key ? await queryHmac(key, input) : randomOracle.current.query(input)
    setQueries((current) => [...current, { input, output, repeated }]); setMessage(`Oracle returned ${output}${repeated ? ' (consistent repeat)' : ''}.`)
  }
  const guess = (guessValue: Branch) => { setRevealed(true); setMessage(`${guessValue === branch ? 'Correct' : 'Not this time'} — the branch was ${branch}.`) }

  if (!supported) return <div className="demo unavailable"><h3>Oracle challenge unavailable</h3><p>Web Crypto requires a secure browser context (HTTPS or localhost).</p></div>
  return (
    <div className="demo">
      <div className="demo-heading"><div><span className="eyebrow">Demo C</span><h3>PRF or random function?</h3></div><span className="status-chip">{queries.length} / 25 queries</span></div>
      <p className="notice">Local educational simulation — not a secure cryptographic challenge.</p>
      <div className="oracle-console">
        <label>12-bit oracle input<input value={input} maxLength={n} inputMode="numeric" onChange={(event) => setInput(event.target.value.replace(/[^01]/g, ''))} /></label>
        <button disabled={revealed} onClick={() => void query()}>Query oracle</button>
        <button className="ghost" onClick={() => void newChallenge()}>New challenge</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
      <div className="query-log" aria-label="Oracle query log">{queries.slice(-8).map((item, index) => <span key={`${item.input}-${index}`}><code>{item.input}</code><b>→ {item.output}</b>{item.repeated && <small>repeat</small>}</span>)}</div>
      <div className="guess-row"><button disabled={revealed} onClick={() => guess('PRF')}>Guess: PRF</button><button disabled={revealed} onClick={() => guess('Random')}>Guess: Random</button><button className="ghost" disabled={revealed} onClick={() => { setRevealed(true); setMessage(`Revealed: ${branch}.`) }}>Reveal</button></div>
    </div>
  )
}
