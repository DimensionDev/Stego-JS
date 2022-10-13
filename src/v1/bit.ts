import { Options } from '../utils/stego-params.js'
import { getPos, Accumulator } from './position.js'
import { Locator } from '../utils/locator.js'

export type Bit = 0 | 1

export function str2bits(text: string, copies: number): Bit[] {
  const chars = Array.from(text)
  const bits: Bit[] = []
  const pushByte = (byte: Bit[], n: number) => {
    for (let i = 0; i < 8; i += 1) {
      let j = 0
      while (j < n) {
        bits.push(byte[i])
        j += 1
      }
    }
  }

  for (let i = 0; i < chars.length; i += 1) {
    const codes = Array.from(encodeURI(chars[i]))

    for (let j = 0; j < codes.length; j += 1) {
      const byte: Bit[] = []
      let reminder: Bit = 0
      let code = codes[j].charCodeAt(0)

      do {
        reminder = (code % 2) as Bit
        byte.push(reminder)
        code = code - Math.floor(code / 2) - reminder
      } while (code > 1)
      byte.push(code as Bit)
      while (byte.length < 8) {
        byte.push(0)
      }
      pushByte(byte.reverse(), copies)
    }
  }
  return bits
}

export function bits2str(bits: Bit[], copies: number) {
  let k = 128
  let temp = 0
  const chars: string[] = []
  const candidates: Bit[] = []
  const elect = () => (candidates.filter((c) => c === 1).length >= copies / 2 ? 1 : 0)

  for (let i = 0; i < bits.length; i += 1) {
    candidates.push(bits[i])

    if (candidates.length === copies) {
      temp += elect() * k
      k /= 2
      candidates.length = 0

      // end of message
      if (temp === 255) {
        break
      }
      if (k < 1) {
        chars.push(String.fromCharCode(temp))
        temp = 0
        k = 128
      }
    }
  }
  try {
    return decodeURI(chars.join(''))
  } catch (e) {
    return ''
  }
}

export function mergeBits(dest: Bit[], ...src: Bit[][]) {
  let k = 0

  for (let i = 0; i < src.length; i += 1) {
    const bits = src[i]

    for (let j = 0; j < bits.length && k < dest.length; j += 1, k += 1) {
      dest[k] = bits[j]
    }
  }
  return dest
}

export function getBit(block: readonly number[], acc: Accumulator, loc: Locator, options: Options) {
  const pos = getPos(acc, loc, options)
  const { tolerance } = options

  return Math.abs(Math.round(block[pos] / tolerance) % 2) as Bit
}

export function setBit(block: number[], bits: readonly Bit[], acc: Accumulator, loc: Locator, options: Options) {
  const pos = getPos(acc, loc, options)
  const { tolerance } = options
  const v = Math.floor(block[pos] / tolerance)

  if (bits[loc.b]) {
    block[pos] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance
  } else {
    block[pos] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance
  }
}
