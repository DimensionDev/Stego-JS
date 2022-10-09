import { Options } from '../utils/stego-params.js'
import { TransformAlgorithm } from '../utils/transform.js'
import { hashCode, squareCircleIntersect } from '../utils/helper.js'
import { Locator } from '../utils/locator.js'

export interface Accumulator {
  /**
   * previous bit position
   */
  prevPos: number
  /**
   * previous hash code
   */
  prevCode: string
  /**
   * available indices
   */
  indices: number[]
}

export function createAcc({ size, transformAlgorithm }: Options) {
  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return {
        prevPos: -1,
        prevCode: '',
        indices: squareCircleIntersect(size, 3),
      }
    default:
      return {
        prevPos: -1,
        prevCode: '',
        indices: [],
      }
  }
}

export function getPosFromAcc(acc: Accumulator, { c }: Locator, { pass }: Options) {
  const { prevCode, prevPos, indices } = acc

  if (c !== 0) {
    return prevPos
  }

  const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, [])

  acc.prevCode = code
  acc.prevPos = indices[index]
  return indices[index]
}

export function getPos(acc: Accumulator, loc: Locator, options: Options) {
  const { pass, size, transformAlgorithm } = options

  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return pass ? getPosFromAcc(acc, loc, options) : (size * size + size) / 2
    case TransformAlgorithm.FFT2D:
    case TransformAlgorithm.DCT:
    case TransformAlgorithm.FastDCT:
      return 0
    default:
      throw new Error(`unknown algorithm: ${transformAlgorithm}`)
  }
}
