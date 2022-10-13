import { EncodeOptions, RandomSource } from '../utils/stego-params.js'
import { encodeImg } from './stego.js'
import { cropImg } from '../utils/image.js'

export { decodeImg as decode } from './stego.js'

export async function encode(
  imgData: ImageData,
  maskData: Uint8ClampedArray,
  options: EncodeOptions,
  defaultRandomSource: RandomSource,
) {
  const { width, height } = imgData
  const [cropWidth, cropHeight] = cropImg(imgData, options)
  return {
    data: await encodeImg(imgData, maskData, options, defaultRandomSource),
    width: options.cropEdgePixels ? cropWidth : width,
    height: options.cropEdgePixels ? cropHeight : height,
  }
}
