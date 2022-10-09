import { AlgorithmVersion, DecodeOptions, EncodeOptions } from './stego-params.js'

export interface EncodedImageData {
  data: ImageData
  height: number
  width: number
}

export type Encoder = (imgData: ImageData, maskData: ImageData, options: EncodeOptions) => Promise<EncodedImageData>
export type Decoder = (imgData: ImageData, maskData: ImageData, options: DecodeOptions) => Promise<string>

export interface Methods {
  toImageData(data: ArrayBuffer): Promise<ImageData>
  toBuffer(imgData: ImageData, height?: number, width?: number): Promise<ArrayBuffer>
  preprocessImage(data: ImageData): ImageData
}

interface ProxyOptions {
  algoithms: Record<
    AlgorithmVersion,
    {
      encode: Encoder
      decode: Decoder
    }
  >
  methods: Methods
}

export function proxy({ algoithms, methods }: ProxyOptions) {
  return {
    async encode(image: ArrayBuffer, mask: ArrayBuffer, options: EncodeOptions) {
      const { data, height, width } = await algoithms[options.version].encode(
        methods.preprocessImage(await methods.toImageData(image)),
        methods.preprocessImage(await methods.toImageData(mask)),
        options,
      )
      return methods.toBuffer(data, height, width)
    },
    async decode(image: ArrayBuffer, mask: ArrayBuffer, options: DecodeOptions) {
      return algoithms[options.version].decode(
        await methods.toImageData(image),
        await methods.toImageData(mask),
        options,
      )
    },
  }
}
