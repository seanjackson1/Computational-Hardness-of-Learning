export type Bit = 0 | 1

export type GF2Solution = {
  rank: number
  unique: boolean
  inconsistent: boolean
  solution: Bit[] | null
}

export function dotGF2(a: Bit[], b: Bit[]): Bit {
  return a.reduce((value, bit, index) => (value ^ (bit & b[index])) as Bit, 0 as Bit)
}

export function solveGF2(rows: Bit[][], labels: Bit[], width: number): GF2Solution {
  const matrix = rows.map((row, index) => [...row, labels[index]] as Bit[])
  let pivotRow = 0
  const pivotColumns: number[] = []

  for (let column = 0; column < width && pivotRow < matrix.length; column += 1) {
    const match = matrix.findIndex((row, index) => index >= pivotRow && row[column] === 1)
    if (match === -1) continue
    ;[matrix[pivotRow], matrix[match]] = [matrix[match], matrix[pivotRow]]
    for (let row = 0; row < matrix.length; row += 1) {
      if (row !== pivotRow && matrix[row][column] === 1) {
        for (let j = column; j <= width; j += 1) matrix[row][j] = (matrix[row][j] ^ matrix[pivotRow][j]) as Bit
      }
    }
    pivotColumns.push(column)
    pivotRow += 1
  }

  const inconsistent = matrix.some((row) => row.slice(0, width).every((value) => value === 0) && row[width] === 1)
  if (inconsistent) return { rank: pivotColumns.length, unique: false, inconsistent: true, solution: null }

  const solution = Array<Bit>(width).fill(0)
  pivotColumns.forEach((column, index) => { solution[column] = matrix[index][width] })
  return { rank: pivotColumns.length, unique: pivotColumns.length === width, inconsistent: false, solution }
}
