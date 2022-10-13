import { JsColorType, Transformer } from '@napi-rs/image'
import { randomFillSync } from 'crypto'
import { createAPI } from './utils/expose.js'
import { preprocessImage } from './utils/image.js'

export { getImageType } from './utils/helper.js'
export * from './utils/types.js'
export * from './constant.js'

export const { encode, decode } = createAPI({
  async toImageData(data) {
    let transformer = new Transformer(Buffer.from(new Uint8Array(data)))
    let { width, height, colorType } = await transformer.metadata()

    if (colorType !== JsColorType.Rgba8 && colorType !== JsColorType.Rgb8) {
      transformer = new Transformer(await transformer.png())
      ;({ width, height, colorType } = await transformer.metadata())
    }

    if (colorType !== JsColorType.Rgba8 && colorType !== JsColorType.Rgb8) {
      throw new TypeError('Cannot convert the given image to rgba8 format.')
    }
    let rgb: Uint8ClampedArray = new Uint8ClampedArray(await transformer.rawPixels())
    if (colorType === JsColorType.Rgb8) rgb = rgb_to_rgba(rgb)

    const imageData: ImageData = {
      width,
      height,
      colorSpace: 'srgb',
      data: rgb,
    }
    return imageData
  },
  async toPNG(imgData, height = imgData.height, width = imgData.width) {
    return new Uint8Array(
      (await Transformer.fromRgbaPixels(imgData.data, width, height).crop(0, 0, width, height).png()).buffer,
    )
  },
  preprocessImage(data) {
    return preprocessImage(data, (width, height) => ({
      height,
      width,
      colorSpace: 'srgb',
      data: new Uint8ClampedArray(width * height * 4),
    }))
  },
  defaultRandomSource(buffer) {
    return randomFillSync(buffer)
  },
})

function rgb_to_rgba(array: Uint8ClampedArray) {
  const next = new Uint8ClampedArray((array.length / 3) * 4)
  for (var old_index = 0, new_index = 0; old_index < array.length; old_index += 3, new_index += 4) {
    next[new_index] = array[old_index]
    next[new_index + 1] = array[old_index + 1]
    next[new_index + 2] = array[old_index + 2]
    next[new_index + 3] = 255
  }
  if (new_index !== next.length) throw new Error('rgb_to_rgba error')
  return next
}
