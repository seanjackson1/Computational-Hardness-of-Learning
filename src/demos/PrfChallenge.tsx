import { useCallback, useEffect, useRef, useState } from 'react'
import { generateHmacKey, queryHmac, RandomFunctionOracle, validBitString } from '../lib/cryptoOracles'
import type { Bit } from '../lib/gf2'

type Branch = 'PRF' | 'Random'
type Query = { input: string; output: Bit; repeated: boolean }
type Round = { branch: 'PRF'; key: CryptoKey } | { branch: 'Random'; oracle: RandomFunctionOracle }

const inputLength = 4
const queryLimit = 25
const defaultInput = '0'.repeat(inputLength)

function chooseBranch(): Branch {
  return crypto.getRandomValues(new Uint8Array(1))[0] & 1 ? 'PRF' : 'Random'
}

export function PrfChallenge() {
  const round = useRef<Round | null>(null)
  const roundId = useRef(0)
  const queryInFlight = useRef(false)
  const [phase, setPhase] = useState<'starting' | 'ready' | 'revealed' | 'error'>('starting')
  const [pending, setPending] = useState(false)
  const [input, setInput] = useState(defaultInput)
  const [queries, setQueries] = useState<Query[]>([])
  const [message, setMessage] = useState('Starting challenge…')
  const supported = Boolean(globalThis.crypto?.subtle)

  const newChallenge = useCallback(async () => {
    const id = ++roundId.current
    round.current = null
    queryInFlight.current = false
    setPending(false)
    setPhase('starting')
    setInput(defaultInput)
    setQueries([])
    setMessage('Starting challenge…')

    try {
      const branch = chooseBranch()
      const next: Round = branch === 'PRF'
        ? { branch, key: await generateHmacKey() }
        : { branch, oracle: new RandomFunctionOracle() }
      if (roundId.current !== id) return
      round.current = next
      setPhase('ready')
      setMessage('Challenge ready.')
    } catch {
      if (roundId.current !== id) return
      setPhase('error')
      setMessage('Could not start the challenge. Try a new round.')
    }
  }, [])

  useEffect(() => {
    if (supported) void newChallenge()
    return () => { roundId.current += 1 }
  }, [newChallenge, supported])

  async function query() {
    const current = round.current
    if (phase !== 'ready' || !current || queryInFlight.current || queries.length >= queryLimit) return
    if (!validBitString(input, inputLength)) {
      setMessage(`Enter exactly ${inputLength} binary digits.`)
      return
    }

    queryInFlight.current = true
    setPending(true)
    const id = roundId.current
    try {
      const repeated = queries.some((item) => item.input === input)
      const output = current.branch === 'PRF' ? await queryHmac(current.key, input) : current.oracle.query(input)
      if (roundId.current !== id) return
      setQueries((previous) => [...previous, { input, output, repeated }])
      setMessage(`Oracle returned ${output}${repeated ? ' (repeat)' : ''}.`)
    } catch {
      if (roundId.current === id) setMessage('Query failed. Try again or start a new challenge.')
    } finally {
      if (roundId.current === id) {
        queryInFlight.current = false
        setPending(false)
      }
    }
  }

  function finish(guess?: Branch) {
    if (phase !== 'ready' || !round.current || queryInFlight.current) return
    const { branch } = round.current
    setPhase('revealed')
    setMessage(guess === undefined
      ? `Revealed: ${branch}.`
      : `${guess === branch ? 'Correct' : 'Incorrect'}. The branch was ${branch}.`)
  }

  function generateInput() {
    const bits = crypto.getRandomValues(new Uint8Array(inputLength))
    const generated = Array.from(bits, (bit) => bit & 1).join('')
    setInput(generated)
    setMessage(`Random input: ${generated}.`)
  }

  if (!supported) return <div className="demo unavailable"><h3>Oracle challenge unavailable</h3><p>Open this page over HTTPS or on localhost to use Web Crypto.</p></div>

  const canGuess = phase === 'ready' && !pending
  const canQuery = canGuess && queries.length < queryLimit
  return (
    <div className="demo">
      <div className="demo-heading"><h3>PRF or random function?</h3><span className="status-chip">{queries.length} / {queryLimit} queries</span></div>
      <form className="oracle-console" onSubmit={(event) => { event.preventDefault(); void query() }}>
        <label>{inputLength}-bit oracle input<input value={input} maxLength={inputLength} inputMode="numeric" spellCheck={false} autoComplete="off" onChange={(event) => setInput(event.target.value.replace(/[^01]/g, ''))} /></label>
        <button type="button" className="ghost" disabled={!canQuery} onClick={generateInput}>Random input</button>
        <button type="submit" disabled={!canQuery}>Query oracle</button>
        <button type="button" className="ghost" disabled={phase === 'starting'} onClick={() => void newChallenge()}>New challenge</button>
      </form>
      <p className="demo-status" role="status">{message}{phase === 'ready' && queries.length === queryLimit ? ' Query limit reached.' : ''}</p>
      <ol className="query-log" aria-label="Oracle query log">
        {queries.map((item, index) => <li key={index}><code>{item.input}</code><b>Output: {item.output}</b>{item.repeated && <small>Repeat</small>}</li>)}
      </ol>
      <div className="guess-row"><button type="button" disabled={!canGuess} onClick={() => finish('PRF')}>Guess: PRF</button><button type="button" disabled={!canGuess} onClick={() => finish('Random')}>Guess: Random</button><button type="button" className="ghost" disabled={!canGuess} onClick={() => finish()}>Reveal</button></div>
    </div>
  )
}
