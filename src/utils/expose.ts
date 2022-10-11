import { AlgorithmVersion, DecodeOptions, EncodeOptions } from './stego-params.js'
import * as v1 from '../v1/index.js'
import * as v2 from '../v2/index.js'

export interface EncodedImageData {
  readonly data: ImageData
  readonly height: number
  readonly width: number
}

export type Encoder = (
  imgData: ImageData,
  maskData: Uint8ClampedArray,
  options: EncodeOptions,
) => Promise<EncodedImageData>
export type Decoder = (imgData: ImageData, maskData: Uint8ClampedArray, options: DecodeOptions) => Promise<string>

export interface IO {
  toImageData(data: ArrayBufferLike | ArrayLike<number>): Promise<ImageData>
  toBuffer(imgData: ImageData, height?: number, width?: number): Promise<Uint8ClampedArray>
  preprocessImage(data: ImageData): ImageData
}

const algorithms = {
  [AlgorithmVersion.V1]: v1,
  [AlgorithmVersion.V2]: v2,
}
export function createAPI({ preprocessImage, toBuffer, toImageData }: IO) {
  return {
    async encode(image: ArrayBuffer, mask: ArrayBuffer, options: EncodeOptions) {
      const { data, height, width } = await algorithms[options.version].encode(
        preprocessImage(await toImageData(image)),
        preprocessImage(await toImageData(mask)).data,
        options,
      )
      return toBuffer(data, height, width)
    },
    async decode(image: ArrayBuffer, mask: ArrayBuffer, options: DecodeOptions) {
      return algorithms[options.version].decode(await toImageData(image), (await toImageData(mask)).data, options)
    },
  }
}
