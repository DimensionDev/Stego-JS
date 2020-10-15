import { Options } from '../utils/stego-params'
import { getPos, Accumulator } from './position'
import { transform, TransformAlgorithm } from '../utils/transform'
import { DEFAULT_PARAM_COPIES } from '../constant'

export type Bit = 0 | 1

function gray_code(n: number): number {
  return n ^ (n >> 1)
}

const URIchars = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'J',
  'H',
  'I',
  'G',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '-',
  '.',
  '_',
  '!',
  '~',
  '*',
  "'",
  '(',
  ')',
  ';',
  ',',
  '/',
  '?',
  ':',
  '@',
  '&',
  '=',
  '+',
  '$',
  '%',
]

const URIcharCode = URIchars.map((c: string, i: number) => gray_code(2 * i))

const char2code = (c: string) => (URIchars.indexOf(c) !== -1 ? URIcharCode[URIchars.indexOf(c)] : 255)

const code2char = (c: number) => (URIcharCode.indexOf(c) !== -1 ? URIchars[URIcharCode.indexOf(c)] : '')

export function str2codes(text: string): number[] {
  const codes: number[] = []
  Array.from(text).map((char) => {
    const URIcodes = Array.from(encodeURI(char))
    URIcodes.map((URIcode) => codes.push(URIcharCode[URIchars.indexOf(URIcode)]))
  })
  return codes
}

function codes2bits(codes: number[], copies: number): Bit[] {
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
  codes.map((code) => {
    const byte: Bit[] = []
    let reminder: Bit = 0
    do {
      reminder = (code % 2) as Bit
      byte.push(reminder)
      code = code - Math.floor(code / 2) - reminder
    } while (code > 1)

    byte.push(code as Bit)
    while (byte.length < 8) {
      byte.push(0)
    }
    pushByte(byte.reverse(), 3 * Math.ceil(copies / 3))
  })
  return bits
}

export function str2bits(text: string, copies: number): Bit[] {
  const codes = str2codes(text)
  return codes2bits(codes, copies)
}

function correctCharCode(rawCode: { bit: Bit; diff: number }[][], charCodes: number[], verbose: boolean): number {
  if (verbose) {
    const bits = rawCode.map((bits) => bits.map((richBits) => richBits.bit))
    const diffs = rawCode.map((bits) => bits.map((richBits) => richBits.diff))
    console.warn('[debug][rawcode] bits: ' + bits + '\n' + diffs)
  }
  let code = rawCode
    .slice()
    .reverse()
    .reduce((res, richBits, id) => {
      // correct raw bit
      const copies = richBits.length
      const nBit1 = richBits.filter((c) => c.bit === 1).length

      if (nBit1 === 0) return res
      if (nBit1 !== copies) {
        const conditionalSum = (richBits: { bit: Bit; diff: number }[], v: Bit) =>
          richBits.reduce((res, e) => (e.bit === v ? res + e.diff : res), 0)
        const diff1 = Math.abs(conditionalSum(richBits, 1)) / nBit1
        const diff0 = Math.abs(conditionalSum(richBits, 0)) / (copies - nBit1)
        if (verbose) {
          console.warn('diff1: ' + diff1 + ' diff0: ' + diff1)
        }
        if (diff1 > 2 * diff0 || nBit1 > copies / 2)
          // bit 1
          res += 1 << id
      } else {
        res += 1 << id
      }
      // done
      return res
    }, 0)
  if (code !== 255 && URIcharCode.indexOf(code) === -1) {
    const percentChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map((c) =>
      char2code(c),
    )

    const l = charCodes.length
    let inPercent = false
    if ((l > 1 && charCodes[l - 1] === char2code('%')) || (l > 2 && charCodes[l - 2] === char2code('%')))
      inPercent = true

    const countBit1 = (n: number) => {
      let count = 0
      while (n) {
        count += n & 1
        n >>= 1
      }
      return count
    }

    code = URIcharCode.reduce((res, c) => {
      if (inPercent) {
        if (percentChars.indexOf(c) === -1) return res
        else if (percentChars.indexOf(res) === -1) return c
      }
      const dec2byte = (dec: number) => {
        const byte = Array.from(dec.toString(2))
        while (byte.length < 8) {
          byte.splice(0, 0, '0')
        }
        return byte.map((n) => Number(n))
      }

      const diff = (rawCode: { bit: Bit; diff: number }[][], comp: number) => {
        const compBits = dec2byte(comp)
        let bitDiff = 0
        let paramDiff = 0
        const w = [0.45, 0.35, 0.2]
        for (let i = 0; i < rawCode.length; i += 1) {
          const rbit = rawCode[i].filter((c) => c.bit === 1).length
          const absbitDiff = Math.abs(rbit - compBits[i] * rawCode[i].length)
          bitDiff += absbitDiff
          paramDiff += rawCode[i].reduce(
            (diff, b, bitId) => (b.bit !== compBits[i] ? Math.abs(b.diff) * w[bitId % 3] + diff : diff),
            0,
          )
        }
        // paramDiff /= bitDiff;
        if (verbose) {
          console.warn(
            comp +
              ' ' +
              code2char(comp) +
              ' ' +
              compBits +
              ' bit difference: ' +
              bitDiff +
              ' param difference: ' +
              paramDiff +
              '\n',
          )
        }
        return [bitDiff, paramDiff]
      }

      if (countBit1(code ^ res) < countBit1(code ^ c)) return res
      else if (countBit1(code ^ res) > countBit1(code ^ c)) return c
      else {
        const [resDiff, cDiff] = [diff(rawCode, res), diff(rawCode, c)]
        if (resDiff[1] < cDiff[1]) return res
        else if (resDiff[1] > cDiff[1]) return c
        else {
          if (resDiff[0] < cDiff[0]) return res
          else return c
        }
      }
    }, 255)
  }
  if (verbose) {
    const bits = rawCode.map((bits) => bits.map((richBits) => richBits.bit))
    const diffs = rawCode.map((bits) => bits.map((richBits) => richBits.diff))
    console.warn('elected ' + code + ' (' + code2char(code) + ') with bits: ' + bits + '\n' + diffs)
  }

  return code
}

export function bits2str(richBits: { bit: Bit; diff: number }[], copies: number, verbose: boolean) {
  let k = 128
  let tempCharCode = 0
  const tempRawBits: { bit: Bit; diff: number }[][] = []
  const charCodes: number[] = []
  const candidates: { bit: Bit; diff: number }[] = []

  for (let i = 0; i < richBits.length; i += 1) {
    candidates.push(richBits[i])

    if (verbose) {
      console.warn('bit: ' + richBits[i].bit)
      console.warn('charId: ' + Math.floor(i / (8 * copies)) + ', bitId: ' + (i % (8 * copies)))
    }

    if (candidates.length === copies) {
      tempRawBits.push(candidates.slice())
      k /= 2
      candidates.length = 0

      if (k < 1) {
        tempCharCode = correctCharCode(tempRawBits, charCodes, verbose)
        // end of message
        if (tempCharCode === 255) {
          break
        }
        if (verbose) {
          console.warn('bit index: ' + i + ' char: ' + code2char(tempCharCode) + ' temp: ' + tempCharCode + '\n')
        }
        charCodes.push(tempCharCode)
        tempCharCode = 0
        tempRawBits.length = 0
        k = 128
      }

      if (copies % 3 !== 0) {
        //consume more bits
        i += 3 - (copies % 3)
      }
    }
  }
  if (verbose) console.warn('Before correctURI: ' + charCodes)
  const chars = charCodes.map((c: number) => code2char(c))

  try {
    return decodeURI(chars.join(''))
  } catch (e) {
    console.warn('Error when decoding:  ' + e)
    return ''
  }
}

function int2halfbyte(n: number, copies: number): Bit[] {
  // reverse order
  const bytes = Array.from(n.toString(2))
    .reverse()
    .map((n) => Number(n)) as Bit[]
  while (bytes.length < 4) bytes.push(0)
  const res: Bit[] = []
  for (let i = 0; i < bytes.length; i += 1) {
    for (let j = 0; j < copies; j += 1) {
      res.push(bytes[i])
    }
  }
  return res
}

function halfbyte2int(bits: Bit[], copies: number): number {
  // bits in reverse order
  let k = 1
  let temp = 0
  for (let i = 0; i < bits.length / DEFAULT_PARAM_COPIES; i += 1) {
    const candidates: Bit[] = []
    for (let j = 0; j < DEFAULT_PARAM_COPIES; j += 1) {
      candidates.push(bits[i * DEFAULT_PARAM_COPIES + j])
    }
    const elect = () => (candidates.filter((c) => c === 1).length >= DEFAULT_PARAM_COPIES / 2 ? 1 : 0)
    temp += k * elect()

    k <<= 1
  }
  return temp
}

export function param2bits(options: Options): Bit[] {
  return int2halfbyte((options.copies - 1) / 2, DEFAULT_PARAM_COPIES) // 4 bit * copies
}

export function bits2param(bits: Bit[]) {
  const copies = 1 + halfbyte2int(bits, DEFAULT_PARAM_COPIES) * 2
  return copies
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

export function createBits(size: number) {
  const bits: Bit[] = new Array(size).fill(0)

  for (let i = 0; i < size; i += 1) {
    bits[i] = Math.floor(Math.random() * 2) as Bit
  }
  return bits
}

export function getBit(block: number[], acc: Accumulator, options: Options) {
  const [pos1, pos2] = getPos(options)
  if (options.verbose) console.warn('decoded value: ', block[pos1], block[pos2])
  const diff = block[pos1] - block[pos2]
  return { bit: (diff > 0 ? 1 : 0) as Bit, diff: diff }
}

export function setBit(block: number[], bit: Bit, options: Options, tolerance: number) {
  const [pos1, pos2] = getPos(options)
  let v1 = block[pos1]
  let v2 = block[pos2]

  // amplify the difference between v1 and v2
  // [v1, v2] = v1 < v2? [v1, v2 + tolerance] : [v1 + tolerance, v2];

  // const t = rand(0, tolerance);
  const t0 = Math.abs(v1 - v2)
  // const t0 = tolerance / 2;
  // const [t1, t2] = [t, (tolerance - t0 - t)];
  // const [t1, t2] = (t0 > tolerance) ? [0, 0] : [t, (tolerance - t0 - t)];
  const t =
    t0 > 1.5 * tolerance
      ? 0.5 * tolerance
      : t0 < 0.3 * tolerance
      ? 1.5 * tolerance
      : t0 < 0.5 * tolerance
      ? 1.2 * tolerance
      : tolerance
  // const [t1, t2] = [0, 0];

  ;[v1, v2] = v1 < v2 ? [v1 - t / 2, v2 + t / 2] : [v1 + t / 2, v2 - t / 2]
  // [v1, v2] = v1 < v2? [v1, v2 + t] : [v1 + t, v2]; //black?
  // [v1, v2] = v1 < v2? [v1 - t, v2] : [v1, v2 - t]; //white?

  if (options.verbose) console.warn('encoded value: ', v1, v2)

  if (bit) {
    //bit '1':  block[pos1] > block[pos2]
    ;[block[pos1], block[pos2]] = v1 < v2 ? [v2, v1] : [v1, v2]
    if (options.transformAlgorithm === TransformAlgorithm.FFT2D)
      // coefficients of fft2d are sysmetric to (size - 1 / 2, )
      [block[72 - pos1], block[72 - pos2]] = v1 < v2 ? [v2, v1] : [v1, v2]
  } else {
    // bit '0':  block[pos1] < block[pos2]
    ;[block[pos1], block[pos2]] = v1 < v2 ? [v1, v2] : [v2, v1]
    if (options.transformAlgorithm === TransformAlgorithm.FFT2D)
      // coefficients of fft2d are sysmetric to (size - 1 / 2, )
      [block[72 - pos1], block[72 - pos2]] = v1 < v2 ? [v1, v2] : [v2, v1]
  }
}
