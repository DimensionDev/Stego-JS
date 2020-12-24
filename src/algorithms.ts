import { AlgorithmVersion, DecodeOptions, EncodeOptions } from './utils/stego-params'

import * as v1 from './v1'
import * as v2 from './v2'

export interface EncodedImageData {
  data: ImageData
  height: number
  width: number
}

export type Encoder = (imgData: ImageData, maskData: ImageData, options: EncodeOptions) => Promise<EncodedImageData>
export type Decoder = (imgData: ImageData, maskData: ImageData, options: DecodeOptions) => Promise<string>

const algorithms: Record<AlgorithmVersion, { encode: Encoder; decode: Decoder }> = {
  [AlgorithmVersion.V1]: v1,
  [AlgorithmVersion.V2]: v2,
}

export default algorithms
