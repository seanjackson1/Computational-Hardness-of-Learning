import { describe, expect, it } from 'vitest'
import { dotGF2, solveGF2, type Bit } from './gf2'

describe('solveGF2', () => {
  it('recovers a unique secret from full-rank equations', () => {
    const secret: Bit[] = [1, 0, 1]
    const rows: Bit[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    const result = solveGF2(rows, rows.map((row) => dotGF2(row, secret)), 3)
    expect(result.unique).toBe(true)
    expect(result.solution).toEqual(secret)
  })

  it('keeps dependent equations underdetermined', () => {
    const result = solveGF2([[1, 1], [1, 1]], [0, 0], 2)
    expect(result.rank).toBe(1)
    expect(result.unique).toBe(false)
  })

  it('detects inconsistent systems', () => {
    expect(solveGF2([[1], [1]], [0, 1], 1).inconsistent).toBe(true)
  })
})
