import { TransformAlgorithm } from './utils/transform'
import { AlgorithmVersion } from './utils/stego-params'

export const CLI_NAME = 'stego-js'

export const MAX_WIDTH = 1960

export const DEFAULT_NARROW = 0
export const DEFAULT_COPIES = 3
export const DEFAULT_PARAM_COPIES = 9
export const DEFAULT_SIZE = 8
export const TOLERANCE_NOT_SET = -1
export const DEFAULT_TOLERANCE: Record<string, Record<string, number>> = {
  [AlgorithmVersion.V1]: {
    [TransformAlgorithm.DCT]: 100,
    [TransformAlgorithm.fastDCT]: 500,
    [TransformAlgorithm.FFT1D]: 128,
    [TransformAlgorithm.FFT2D]: 500,
  },
  [AlgorithmVersion.V2]: {
    [TransformAlgorithm.DCT]: 10,
    [TransformAlgorithm.fastDCT]: 100,
    [TransformAlgorithm.FFT1D]: 30,
    [TransformAlgorithm.FFT2D]: 150,
  },
}
export const MAX_TOLERANCE: Record<string, number> = {
  [TransformAlgorithm.DCT]: 5000,
  [TransformAlgorithm.fastDCT]: 5000,
  [TransformAlgorithm.FFT1D]: 5000,
  [TransformAlgorithm.FFT2D]: 50000,
}
export const DEFAULT_FAKE_MASK_PIXELS = false
export const DEFAULT_EXHAUST_PIXELS = true
export const DEFAULT_CROP_EDGE_PIXELS = true
export const DEFAULT_ALGORITHM_VERSION = '0.12.x'

export const DEFAULT_MASK = [
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a,
  0x00,
  0x00,
  0x00,
  0x0d,
  0x49,
  0x48,
  0x44,
  0x52,
  0x00,
  0x00,
  0x00,
  0x01,
  0x00,
  0x00,
  0x00,
  0x01,
  0x08,
  0x04,
  0x00,
  0x00,
  0x00,
  0xb5,
  0x1c,
  0x0c,
  0x02,
  0x00,
  0x00,
  0x00,
  0x0b,
  0x49,
  0x44,
  0x41,
  0x54,
  0x78,
  0xda,
  0x63,
  0xfc,
  0xff,
  0x1f,
  0x00,
  0x03,
  0x03,
  0x02,
  0x00,
  0xef,
  0xa2,
  0xa7,
  0x5b,
  0x00,
  0x00,
  0x00,
  0x00,
  0x49,
  0x45,
  0x4e,
  0x44,
  0xae,
  0x42,
  0x60,
  0x82,
]

export const SEED = [
  76221,
  13388,
  20800,
  80672,
  15974,
  87005,
  71203,
  84444,
  16928,
  51335,
  94092,
  83586,
  37656,
  2240,
  26283,
  1887,
  93419,
  96857,
  20866,
  21797,
  42065,
  39781,
  50192,
  24399,
  98969,
  54274,
  38815,
  45159,
  36824,
]
