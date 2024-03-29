import { SEED } from '../src/constant.js'
import { rand, shuffleGroupBy3, unshuffleGroupBy3 } from '../src/utils/helper.js'
import { Options } from '../src/utils/stego-params.js'
import { TransformAlgorithm } from '../src/utils/transform.js'
import { Bit, bits2param, param2bits } from '../src/v2/bit.js'
import { createOptions, decodeBitbyBlock, encodeBitbyBlock, normalizeBlock } from './utils.js'
import { expect, test } from 'vitest'
import { randomFillSync } from 'crypto'

const testAlgs = [
  TransformAlgorithm.FFT1D,
  TransformAlgorithm.FFT2D,
  TransformAlgorithm.DCT,
  TransformAlgorithm.FastDCT,
]
const bits: Bit[] = [0, 1]
const testOptions = testAlgs.map(createOptions)

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
        const block = Array.apply(null, new Array(option.size * option.size)).map(() =>
          rand((u8) => randomFillSync(u8), 0, 255),
        )
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
