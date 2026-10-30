export type BoundInput = { n: number; epsilon: number; delta: number }

export function finiteClassBound({ n, epsilon, delta }: BoundInput): number {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer')
  if (!(epsilon > 0 && epsilon < 1)) throw new RangeError('epsilon must be between 0 and 1')
  if (!(delta > 0 && delta < 1)) throw new RangeError('delta must be between 0 and 1')
  return Math.ceil((n * Math.log(2) + Math.log(1 / delta)) / epsilon)
}
