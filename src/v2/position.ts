import { Options } from '../utils/stego-params.js'
import { TransformAlgorithm } from '../utils/transform.js'

export function getPos(options: Options): [pos1: number, pos2: number] {
  const { size, transformAlgorithm } = options

  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return [3 * size + 1, 2 * size + 2]
    case TransformAlgorithm.FFT2D:
      return [3 * size + 1, 2 * size + 2]
    case TransformAlgorithm.DCT:
      return [3 * size + 1, 2 * size + 2]
    case TransformAlgorithm.FastDCT:
      return [3 * size + 1, 2 * size + 2]
    default:
      const _: never = transformAlgorithm
      throw new Error(`unknown algorithm in getPos: ${transformAlgorithm}`)
  }
}
