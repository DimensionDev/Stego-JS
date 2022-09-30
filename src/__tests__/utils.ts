import { DEFAULT_COPIES, DEFAULT_SIZE, DEFAULT_TOLERANCE } from '../../constant'
import { clamp } from '../../utils/helper'
import { AlgorithmVersion, Options } from '../../utils/stego-params'
import { inverseTransform, transform, TransformAlgorithm } from '../../utils/transform'
import { Bit, getBit as getBitV2, setBit as setBitV2 } from '../../v2/bit'
import { createAcc } from '../../v2/position'

export function createOptions(transformAlgorithm: TransformAlgorithm) {
  return {
    version: AlgorithmVersion.V2,
    size: DEFAULT_SIZE,
    copies: DEFAULT_COPIES,
    tolerance: DEFAULT_TOLERANCE[AlgorithmVersion.V2][transformAlgorithm],
    transformAlgorithm: transformAlgorithm,
  } as Options
}

export function encodeBitbyBlock(bit: Bit, block: number[], transformAlgorithm: TransformAlgorithm, options: Options) {
  const im = new Array(options.size * options.size)
  transform(block, im.fill(0), transformAlgorithm, options)
  setBitV2(block, bit, options, options.tolerance)
  inverseTransform(block, im, transformAlgorithm, options)
}

export function decodeBitbyBlock(block: number[], transformAlgorithm: TransformAlgorithm, options: Options): Bit {
  const im = new Array(options.size * options.size)
  const acc = createAcc(options)
  transform(block, im.fill(0), transformAlgorithm, options)
  return getBitV2(block, acc, options).bit
}

export function normalizeBlock(block: number[]) {
  for (let i = 0; i < block.length; i += 1) block[i] = clamp(Math.round(block[i]), 0, 255)
}
