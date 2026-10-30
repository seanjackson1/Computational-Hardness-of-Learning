import type { Bit } from './gf2'

export function validBitString(input: string, length: number) {
  return input.length === length && /^[01]+$/.test(input)
}

export class RandomFunctionOracle {
  private values = new Map<string, Bit>()

  query(input: string): Bit {
    const known = this.values.get(input)
    if (known !== undefined) return known
    const byte = new Uint8Array(1)
    crypto.getRandomValues(byte)
    const value = (byte[0] & 1) as Bit
    this.values.set(input, value)
    return value
  }
}

export async function generateHmacKey() {
  return crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

export async function queryHmac(key: CryptoKey, input: string): Promise<Bit> {
  const bytes = new TextEncoder().encode(input)
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes))
  return ((digest[0] >> 7) & 1) as Bit
}
