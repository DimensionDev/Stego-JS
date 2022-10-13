import { GrayscaleAlgorithm } from './grayscale.js'
import { TransformAlgorithm } from './transform.js'

export enum AlgorithmVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export interface Options {
  readonly version: AlgorithmVersion
  readonly pass?: string
  readonly size: number
  readonly copies: number
  readonly tolerance: number
  readonly transformAlgorithm: TransformAlgorithm
  readonly verbose?: boolean
}

/** crypto.getRandomValues.bind(crypto) is OK */
export type RandomSource = (array: Uint8Array) => Uint8Array
export interface EncodeOptions extends Options {
  readonly text: string
  readonly narrow: number
  readonly grayscaleAlgorithm: GrayscaleAlgorithm
  readonly exhaustPixels: boolean
  readonly cropEdgePixels: boolean
  readonly fakeMaskPixels: boolean
  readonly randomSource?: RandomSource
}

export type DecodeOptions = Options
