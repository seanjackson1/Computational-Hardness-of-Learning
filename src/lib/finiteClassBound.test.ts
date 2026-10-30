import { describe, expect, it } from 'vitest'
import { finiteClassBound } from './finiteClassBound'

describe('finiteClassBound', () => {
  it('computes and ceilings the sufficient bound', () => {
    expect(finiteClassBound({ n: 12, epsilon: 0.1, delta: 0.05 })).toBe(114)
  })

  it('grows as epsilon or delta decrease', () => {
    const base = finiteClassBound({ n: 10, epsilon: 0.2, delta: 0.1 })
    expect(finiteClassBound({ n: 10, epsilon: 0.1, delta: 0.1 })).toBeGreaterThan(base)
    expect(finiteClassBound({ n: 10, epsilon: 0.2, delta: 0.01 })).toBeGreaterThan(base)
  })

  it('rejects invalid values', () => {
    expect(() => finiteClassBound({ n: 0, epsilon: 0.1, delta: 0.1 })).toThrow()
    expect(() => finiteClassBound({ n: 10, epsilon: 0, delta: 0.1 })).toThrow()
  })
})
