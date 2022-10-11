import { clamp } from './helper.js'
import { Options } from './stego-params.js'
import { Locator, loc2idx, loc2coord } from './locator.js'
import { lanczos } from '@rgba-image/lanczos'
import { MAX_WIDTH } from '../constant.js'

import { transform } from '../utils/transform.js'

export type Pixel = [r: number, g: number, b: number, a: number]

export function preprocessImage(
  imageData: ImageData,
  getScaled: (w: number, h: number) => ImageData | null,
): ImageData {
  if (imageData.width <= MAX_WIDTH && imageData.height <= MAX_WIDTH) return imageData
  const scale = MAX_WIDTH / Math.max(imageData.width, imageData.height)
  const [w, h] = [imageData.width * scale, imageData.height * scale]
  const scaled = getScaled(w, h)
  if (scaled) {
    lanczos(imageData, scaled)
    return scaled
  } else return imageData
}

export function cropImg({ width, height }: ImageData, { size }: Options) {
  return [Math.floor(width / size) * size, Math.floor(height / size) * size] as const
}

export function* divideImg({ width, height, data }: ImageData, { size, verbose }: Options) {
  for (let h = 0; h < height; h += size) {
    for (let w = 0; w < width; w += size) {
      if (h + size <= height && w + size <= width) {
        for (let c = 0; c < 3; c += 1) {
          const block: number[] = []
          for (let h1 = 0; h1 < size; h1 += 1) {
            for (let w1 = 0; w1 < size; w1 += 1) {
              block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c]
            }
          }
          if (verbose) console.warn('height: ' + h + ' width: ' + w)
          yield block
        }
      }
    }
  }
}

export function visitImgByPixel(imgData: ImageData, visitor: (pixel: Pixel, loc: number, imgData: ImageData) => void) {
  const { width, height, data } = imgData

  for (let i = 0; i < width * height; i += 1) {
    const p = i * 4

    visitor([data[p], data[p + 1], data[p + 2], data[p + 3]], p, imgData)
  }
}

export function visitImgByBlock(
  imgData: ImageData,
  options: Options,
  visitor: (block: number[], loc: Locator, imgData: ImageData) => boolean,
) {
  const { width: w, height: h } = imgData
  let c = 0
  let p = 0
  let b = 0

  for (const block of divideImg(imgData, options)) {
    const bitConsumed = visitor(block, { c, p, b, w, h }, imgData)

    c += 1
    if (bitConsumed) {
      b += 1
    }
    if (c === 3) {
      p += 1
      c = 0
    }
  }
}

export function updateImgByPixel(imgData: ImageData, updater: (pixel: Pixel, loc: number) => Pixel) {
  visitImgByPixel(imgData, (pixel, loc) => updateImgByPixelAt(imgData.data, updater(pixel, loc), loc))
}

export function updateImgByBlock(
  imgData: ImageData,
  options: Options,
  updater: (block: number[], loc: Locator, imgData: ImageData) => boolean,
) {
  visitImgByBlock(imgData, options, (block, loc) => {
    const bitConsumed = updater(block, loc, imgData)

    if (bitConsumed) {
      updateImgByBlockAt(imgData.data, options, block, loc)
      if (options.verbose) {
        console.warn('inversed block: ' + block)
        const im = new Array(options.size * options.size)
        transform(block, im.fill(0), options.transformAlgorithm, options)
        console.warn(block[25], block[18])
      }
    }
    return bitConsumed
  })
}

export function updateImgByPixelChannelAt(imgData: ImageData, loc: number, channel: number, value: number) {
  const { data } = imgData
  data[loc + channel] = value
}

export function updateImgByPixelAt(data: Uint8ClampedArray, pixel: Pixel, loc: number) {
  data[loc + 0] = pixel[0]
  data[loc + 1] = pixel[1]
  data[loc + 2] = pixel[2]
  data[loc + 3] = pixel[3]
}

export function updateImgByBlockAt(data: Uint8ClampedArray, options: Options, block: number[], loc: Locator) {
  const { size } = options
  const [x1, y1] = loc2coord(loc, options)

  for (let i = 0; i < size * size; i += 1) {
    block[i] = clamp(Math.round(block[i]), 0, 255)
    data[loc2idx(loc, options, x1, y1, i)] = block[i]
  }
}
