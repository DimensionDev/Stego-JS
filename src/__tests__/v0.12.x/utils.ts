import { AlgorithmVersion, Options } from '../../utils/stego-params'
import { TransformAlgorithm, transform, inverseTransform } from '../../utils/transform'
import { clamp } from '../../utils/helper'
import { setBit as setBitV2, getBit as getBitV2, Bit } from '../../v0.12.x/bit'
import { createAcc } from '../../v0.12.x/position'
import { DEFAULT_COPIES, DEFAULT_TOLERANCE, DEFAULT_SIZE } from '../../constant'

export function createOptions(transformAlgorithm: TransformAlgorithm) {
  return {
    version: AlgorithmVersion.V2,
    size: DEFAULT_SIZE,
    copies: DEFAULT_COPIES,
    tolerance: DEFAULT_TOLERANCE['0.12.x'][transformAlgorithm],
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
