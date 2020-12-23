import { GrayscaleAlgorithm } from './grayscale'
import { TransformAlgorithm } from './transform'

export enum AlgorithmVersion {
  V1,
  V2,
}

export interface Options {
  version: AlgorithmVersion
  pass?: string
  size: number
  copies: number
  tolerance: number
  transformAlgorithm: TransformAlgorithm
  verbose: boolean
}

export interface EncodeOptions extends Options {
  text: string
  narrow: number
  grayscaleAlgorithm: GrayscaleAlgorithm
  exhaustPixels: boolean
  cropEdgePixels: boolean
  fakeMaskPixels: boolean
}

export type DecodeOptions = Options
