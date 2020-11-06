import { Options } from '../../utils/stego-params'
import { TransformAlgorithm } from '../../utils/transform'
import { rand, unshuffleGroupBy3, shuffleGroupBy3 } from '../../utils/helper'
import { SEED } from '../../constant'
import { Bit, param2bits, bits2param } from '../../v0.12.x/bit'

import { createOptions, decodeBitbyBlock, encodeBitbyBlock, normalizeBlock } from './utils'

const testAlgs = [
  TransformAlgorithm.FFT1D,
  TransformAlgorithm.FFT2D,
  TransformAlgorithm.DCT,
  TransformAlgorithm.fastDCT,
]
const bits = [0, 1] as Bit[]
const testOptions = testAlgs.map((transformAlgorithm) => createOptions(transformAlgorithm))

// block level test
test('block with all the same values', () => {
  const testBlockValues = [0, 127, 255]
  for (const option of testOptions) {
    for (const v of testBlockValues) {
      for (const bit of bits) {
        const block = new Array(option.size * option.size).fill(v)
        testEncodeAndDecodeBlock(bit, block, option, option.transformAlgorithm)
      }
    }
  }
})

test('block with random values', () => {
  const testSize = 10
  for (const option of testOptions) {
    for (let v = 0; v < testSize; v += 1) {
      for (const bit of bits) {
        const block = Array.apply(null, new Array(option.size * option.size)).map(() => rand(0, 255))
        testEncodeAndDecodeBlock(bit, block, option, option.transformAlgorithm)
      }
    }
  }
})

function testEncodeAndDecodeBlock(bit: Bit, block: number[], options: Options, transformAlgorithm: TransformAlgorithm) {
  encodeBitbyBlock(bit, block, transformAlgorithm, options)
  normalizeBlock(block)
  const res = decodeBitbyBlock(block, transformAlgorithm, options)
  expect(bit).toEqual(res)
}

// test function
test('params to bits', () => {
  for (const option of testOptions) {
    const bits = param2bits(option)

    const copies = bits2param(bits)
    expect(copies).toEqual(option.copies)
  }
})

test('shuffle group by 3', () => {
  const length = 3 * 20
  const nums = new Array(length).fill(0).map((v: number, i: number) => i)
  const shuffledNums = nums.slice()
  shuffleGroupBy3(shuffledNums, SEED)
  unshuffleGroupBy3(shuffledNums, SEED)
  expect(shuffledNums).toEqual(nums)
  for (let i = 0; i < length; i += 3) {
    expect(shuffledNums[i + 1]).toEqual(shuffledNums[i] + 1)
    expect(shuffledNums[i + 2]).toEqual(shuffledNums[i] + 2)
  }
})
