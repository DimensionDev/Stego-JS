import { GrayscaleAlgorithm, grayscale, narrow } from '../utils/grayscale'
import { transform, inverseTransform, TransformAlgorithm } from '../utils/transform'
import { EncodeOptions, DecodeOptions } from '../utils/stego-params'
import {
  cropImg,
  updateImgByBlock,
  updateImgByPixel,
  visitImgByBlock,
  updateImgByPixelAt,
  updateImgByPixelChannelAt,
} from '../utils/image'
import {
  mergeBits,
  createBits,
  str2bits,
  str2codes,
  setBit,
  getBit,
  bits2str,
  param2bits,
  Bit,
  bits2param,
} from './bit'
import { createAcc, getPos } from './position'
import { isPixelVisibleAt, isBlockVisibleAt } from '../utils/mask'
import { rand, shuffleGroupBy3, unshuffleGroupBy3 } from '../utils/helper'
import { loc2idx, loc2coord } from '../utils/locator'
import { DEFAULT_PARAM_COPIES, SEED } from '../constant'

function getCharfromIdx(idx: number, copies: number, text: string): string {
  const charId = Math.floor(idx / (8 * copies))
  const bitId = idx % (8 * copies)
  const codes = Array.from(encodeURI(text))
  if (charId > codes.length) return 'OUT_OF_BOUND' + '(charId: ' + charId + ')'
  else return codes[charId] + '(charId: ' + charId + ', bitId: ' + bitId + ')'
}

export async function encodeImg(imgData: ImageData, maskData: ImageData, options: EncodeOptions) {
  const { text, size, narrow: narrowSize, copies, grayscaleAlgorithm, transformAlgorithm, exhaustPixels } = options
  const [width, height] = cropImg(imgData, options)
  const sizeOfBlocks = (width * height * 3) / (size * size)
  const textBits = str2bits(text, copies)
  const paramsBits = param2bits(options)
  const bits = mergeBits(
    createBits(sizeOfBlocks),
    paramsBits,
    textBits,
    createBits(8 * copies).fill(1), // the end of message
  )
  if (options.verbose) {
    console.warn(
      '---------------------------\n' +
        'Image data: width ' +
        width +
        ' height ' +
        height +
        '\nTransform algorithm: ' +
        options.transformAlgorithm +
        '\nAlgorithm version: v0.12.x\n' +
        'Param copies: ' +
        options.copies +
        '\nParam bits: ' +
        paramsBits +
        '\nEncode text: ' +
        text +
        '\nText codes: ' +
        str2codes(text) +
        '\nText bits: ' +
        textBits +
        '\n---------------------------\n\n',
    )
  }

  const encodeLen = textBits.length + 8 * copies

  if (encodeLen > sizeOfBlocks) {
    process.stderr.write('bits overflow! try to shrink text or reduce copies.\n')
  }
  if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE || narrowSize > 0) {
    updateImgByPixel(imgData, options, ([r, g, b, a], loc) => {
      if (!isPixelVisibleAt(maskData, loc, options)) {
        return [r, g, b, a]
      }

      // decolor
      if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE) {
        const y = grayscale(r, g, b, grayscaleAlgorithm)

        r = y
        g = y
        b = y
      }

      // narrow color value
      if (narrowSize > 0) {
        r = narrow(r, narrowSize)
        g = narrow(g, narrowSize)
        b = narrow(b, narrowSize)
      }
      return [r, g, b, a]
    })
  }

  const im = new Array(size * size)

  let blockId = -1

  const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v: number, i: number) => i)
  shuffleGroupBy3(shuffleArr, SEED) // shuffle by binding 3 blocks together (RGB)
  const encodedId = shuffleArr.map((v: number, i: number) => {
    if (i < encodeLen) return v
  })

  updateImgByBlock(imgData, options, (block, loc) => {
    // Remove transparency for PNG. Even though we do not encode alpha channel,
    // the social media compression on transparant image can casue the information loss.
    if (loc.c === 0) {
      const [x, y] = loc2coord(loc, options)
      for (let i = 0; i < size * size; i += 1) {
        const idx = loc2idx(loc, options, x, y, i)
        updateImgByPixelChannelAt(imgData, idx, 3, 255)
      }
    }

    blockId += 1

    if (!exhaustPixels && !(blockId in encodedId)) {
      return false
    }

    if (!isBlockVisibleAt(maskData, loc, options)) {
      if (options.fakeMaskPixels && loc.c === 0) {
        const [x, y] = loc2coord(loc, options)
        const g = rand(10, 127)

        updateImgByPixelAt(imgData, options, [g, g, g, 255], loc2idx(loc, options, x, y, rand(0, 64)))
      }
      return false
    }

    if (options.verbose) {
      console.warn('Encode on image block (blockId: ' + blockId + '): ' + block)
    }
    transform(block, im.fill(0), transformAlgorithm, options)
    const tolerance = () => {
      const x = ((blockId * size) / 3) % loc.w
      const y = Math.floor((blockId * size) / 3 / loc.w) * size
      let t = options.tolerance

      if (x <= 8 || x > loc.w - 2 * size || y <= size || y > loc.h - 2 * size) t = 1.5 * t
      if (options.verbose) {
        console.warn('Encode with tolerance: ' + t + ' (Image size is width: ' + loc.w + ' height:' + loc.h + ')')
      }
      return t
    }
    const t = tolerance()

    let diff1 = 0
    let maxRetry = 5
    while (true) {
      setBit(block, bits[shuffleArr[loc.b]], options, t)
      const [pos1, pos2] = getPos(options)
      diff1 = diff1 === 0 ? block[pos1] - block[pos2] : diff1
      if (options.verbose) {
        const bitOrigin =
          shuffleArr[loc.b] < paramsBits.length
            ? 'PARAM_BITS'
            : getCharfromIdx(shuffleArr[loc.b] - paramsBits.length, copies, text)
        console.warn('Encode bit: ' + bits[shuffleArr[loc.b]] + ' From char: ' + bitOrigin)
        console.warn(block)
      }

      inverseTransform(block, im, transformAlgorithm, options)

      const imgBlock = block.map((v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v)))
      transform(imgBlock, im.fill(0), transformAlgorithm, options)

      const newDiff = imgBlock[pos1] - imgBlock[pos2]
      if (options.verbose)
        console.warn(
          'After encode, the params diff is: ' +
            newDiff +
            ' (' +
            imgBlock[pos1] +
            '-' +
            imgBlock[pos2] +
            ') diff1: ' +
            diff1,
        )
      if (Math.abs(newDiff) < Math.abs(diff1 * 0.8)) {
        if (options.verbose)
          console.warn('Repeat set bit with tolerance: ' + t + ' (max repeat times: ' + maxRetry + ')')
        if ((maxRetry -= 1) === 0) {
          break
        }
        // block = imgBlock;
        for (let i = 0; i < size * size; i += 1) block[i] = imgBlock[i]
        continue
      }
      break
    }

    return true
  })
  return imgData
}

export async function decodeImg(imgData: ImageData, maskData: ImageData, options: DecodeOptions) {
  const { size, transformAlgorithm } = options
  const richBits: { bit: Bit; diff: number }[] = []
  const acc = createAcc(options)
  const im = new Array(size * size)

  const [width, height] = cropImg(imgData, options)
  const sizeOfBlocks = (width * height * 3) / (size * size)
  const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v: number, i: number) => i)
  shuffleGroupBy3(shuffleArr, SEED)

  let blockId = 0
  visitImgByBlock(imgData, options, (block, loc) => {
    if (!isBlockVisibleAt(maskData, loc, options)) {
      return false
    }
    transform(block, im.fill(0), transformAlgorithm, options)
    if (options.verbose && blockId >= 4 * DEFAULT_PARAM_COPIES) {
      const i = blockId - 4 * DEFAULT_PARAM_COPIES
      console.warn(
        'charId: ' +
          Math.floor(shuffleArr[i] / (8 * options.copies)) +
          ', bitId: ' +
          (shuffleArr[i] % (8 * options.copies)),
      )
      console.warn('bit: ' + getBit(block, acc, options).bit, block)
    }
    // let { bit, diff } = getBit(block, acc, options);
    richBits.push(getBit(block, acc, options))

    blockId += 1

    return true
  })

  unshuffleGroupBy3(richBits, SEED)

  const copiesBits: Bit[] = richBits.slice(0, 4 * DEFAULT_PARAM_COPIES).map((v) => v.bit)
  const copies = bits2param(copiesBits)

  if (options.verbose) {
    console.warn('copies is ' + copies)
  }
  // return bits2str(bits, 3, options.verbose);
  return bits2str(richBits.slice(4 * DEFAULT_PARAM_COPIES), copies, options.verbose)
}
