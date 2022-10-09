import { readFile } from 'fs/promises'
import { toMatchFile } from 'jest-file-snapshot'
import { join } from 'path'
import { encode, decode, TransformAlgorithm, GrayscaleAlgorithm, AlgorithmVersion, DEFAULT_MASK } from '../src/node'
import { expect, test } from 'vitest'
expect.extend({ toMatchFile })

const original = readFile(join(__dirname, './original.png'))
const mask = new Uint8Array(DEFAULT_MASK).buffer
const snapshot1 = join(__dirname, './__file__snapshot__/v1-snapshot-0.png')
const snapshot2 = join(__dirname, './__file__snapshot__/v2-snapshot-0.png')
const text =
  'Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications.'

test('old version', async () => {
  const decodedText = await decode(
    await readFile(join(__dirname, './__file__snapshot__/old-58b44e37-baaa-477a-bb10-0cb0102adc7d.png')),
    mask,
    {
      size: 8,
      copies: 3,
      tolerance: 241,
      transformAlgorithm: TransformAlgorithm.FFT1D,
      pass: 'Hello World',
      version: AlgorithmVersion.V1,
    },
  )
  expect(decodedText).toMatchInlineSnapshot(
    `"Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications."`,
  )
})

test('old version', async () => {
  const decodedText = await decode(
    await readFile(join(__dirname, './__file__snapshot__/old-b04e0423-5ced-4d77-8275-a56a870c1b81.png')),
    mask,
    {
      size: 8,
      copies: 3,
      tolerance: 241,
      transformAlgorithm: TransformAlgorithm.FFT2D,
      pass: 'Hello World',
      version: AlgorithmVersion.V2,
    },
  )
  expect(decodedText).toMatchInlineSnapshot(
    `"Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications."`,
  )
})

test('v1', async () => {
  const outImage = await encode(await original, mask, {
    size: 8,
    narrow: 0,
    copies: 3,
    tolerance: 128,
    exhaustPixels: true,
    cropEdgePixels: false,
    fakeMaskPixels: false,
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    text: text,
    version: AlgorithmVersion.V1,
  })
  // Note: the algorithm currently is non-deterministic.
  // TODO: refactor to move random source out.
  // expect(new Uint8Array(outImage)).toMatchFile(snapshot1)

  const decodedText = await decode(outImage, mask, {
    size: 8,
    copies: 3,
    tolerance: 128,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    version: AlgorithmVersion.V1,
  })
  expect(decodedText).toBe(text)
})

test('v2', async () => {
  const outImage = await encode(await original, mask, {
    size: 8,
    narrow: 0,
    copies: 3,
    tolerance: 400,
    exhaustPixels: false,
    cropEdgePixels: false,
    fakeMaskPixels: false,
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    transformAlgorithm: TransformAlgorithm.FFT2D,
    pass: 'Hello World',
    text: text,
    version: AlgorithmVersion.V2,
  })
  // Note: the algorithm currently is non-deterministic.
  // TODO: refactor to move random source out.
  // expect(new Uint8Array(outImage)).toMatchFile(snapshot2)

  const decodedText = await decode(outImage, mask, {
    size: 8,
    copies: 3,
    tolerance: 400,
    transformAlgorithm: TransformAlgorithm.FFT2D,
    pass: 'Hello World',
    version: AlgorithmVersion.V2,
  })
  expect(decodedText).toBe(text)
})
