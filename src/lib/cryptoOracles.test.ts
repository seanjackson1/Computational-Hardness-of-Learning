import { describe, expect, it } from 'vitest'
import { generateHmacKey, queryHmac, RandomFunctionOracle, validBitString } from './cryptoOracles'

describe('browser oracle primitives', () => {
  it('accepts only bit strings of the requested length', () => {
    expect(validBitString('0011', 4)).toBe(true)
    expect(validBitString('001', 4)).toBe(false)
    expect(validBitString('00a1', 4)).toBe(false)
  })

  it('retains answers to repeated random-function inputs', () => {
    const oracle = new RandomFunctionOracle()
    const first = oracle.query('0011')
    const second = oracle.query('1100')
    expect([0, 1]).toContain(first)
    expect(oracle.query('0011')).toBe(first)
    expect(oracle.query('1100')).toBe(second)
  })

  it('uses a non-extractable HMAC key and returns the same bit on repeat queries', async () => {
    const key = await generateHmacKey()
    expect(key.extractable).toBe(false)
    const output = await queryHmac(key, '0011')
    expect([0, 1]).toContain(output)
    expect(await queryHmac(key, '0011')).toBe(output)
  })
})
