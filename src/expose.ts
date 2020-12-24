import algoithms from './algorithms'
import { DecodeOptions, EncodeOptions } from './utils/stego-params'

export interface Methods {
  toImageData(data: ArrayBuffer): Promise<ImageData>
  toBuffer(imgData: ImageData, height?: number, width?: number): Promise<ArrayBuffer>
  preprocessImage(data: ImageData): ImageData
}

export function makeEncoder(methods: Methods) {
  return async (image: ArrayBuffer, mask: ArrayBuffer, options: EncodeOptions) => {
    const { data, height, width } = await algoithms[options.version].encode(
      methods.preprocessImage(await methods.toImageData(image)),
      methods.preprocessImage(await methods.toImageData(mask)),
      options,
    )
    return methods.toBuffer(data, height, width)
  }
}

export function makeDecoder(methods: Methods) {
  return async (image: ArrayBuffer, mask: ArrayBuffer, options: DecodeOptions) => {
    return algoithms[options.version].decode(await methods.toImageData(image), await methods.toImageData(mask), options)
  }
}
