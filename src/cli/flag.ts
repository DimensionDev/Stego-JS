import { resolve as resolvePath } from 'path'
import { EncodeOptions, DecodeOptions, AlgorithmVersion } from '../utils/stego-params.js'
import { GrayscaleAlgorithm } from '../utils/grayscale.js'
import { TransformAlgorithm } from '../utils/transform.js'
import {
  DEFAULT_ALGORITHM_VERSION,
  DEFAULT_COPIES,
  DEFAULT_CROP_EDGE_PIXELS,
  DEFAULT_SIZE,
  DEFAULT_NARROW,
  DEFAULT_FAKE_MASK_PIXELS,
  DEFAULT_EXHAUST_PIXELS,
  TOLERANCE_NOT_SET,
  DEFAULT_TOLERANCE,
  MAX_TOLERANCE,
} from '../constant.js'
import { TypedFlags } from 'meow'

export interface Flags {
  algorithmVersion: AlgorithmVersion
  help: boolean
  version: boolean
  encode: boolean
  decode: boolean
  message: string
  mask: string
  narrow: number
  size: number
  copies: number
  pass?: string
  tolerance: number
  grayscale: GrayscaleAlgorithm
  transform: TransformAlgorithm
  exhaustPixels: boolean
  cropEdgePixels: boolean
  fakeMaskPixels: boolean
  verbose: boolean
}

export const flags = {
  algorithmVersion: {
    type: 'string',
    default: DEFAULT_ALGORITHM_VERSION,
  },
  help: {
    type: 'boolean',
    default: false,
    alias: 'h',
  },
  version: {
    type: 'boolean',
    default: false,
    alias: 'v',
  },
  encode: {
    type: 'boolean',
    default: false,
    alias: 'e',
  },
  decode: {
    type: 'boolean',
    default: false,
    alias: 'd',
  },
  message: {
    type: 'string',
    default: '',
    alias: 'm',
  },
  mask: {
    type: 'string',
    default: '',
    alias: 'k',
  },
  narrow: {
    type: 'number',
    default: DEFAULT_NARROW,
    alias: 'i',
  },
  size: {
    type: 'number',
    default: DEFAULT_SIZE,
    alias: 's',
  },
  copies: {
    type: 'number',
    default: DEFAULT_COPIES,
    alias: 'c',
  },
  pass: {
    type: 'string',
    default: '',
    alias: 'p',
  },
  tolerance: {
    type: 'number',
    default: TOLERANCE_NOT_SET,
    alias: 't',
  },
  grayscale: {
    type: 'string',
    default: GrayscaleAlgorithm.NONE,
    alias: 'g',
  },
  transform: {
    type: 'string',
    default: TransformAlgorithm.FFT1D,
    alias: 'f',
  },
  exhaustPixels: {
    type: 'boolean',
    default: DEFAULT_EXHAUST_PIXELS,
  },
  cropEdgePixels: {
    type: 'boolean',
    default: DEFAULT_CROP_EDGE_PIXELS,
  },
  fakeMaskPixels: {
    type: 'boolean',
    default: DEFAULT_FAKE_MASK_PIXELS,
  },
  verbose: {
    type: 'boolean',
    default: false,
  },
} as const

export function normalizeFlags(rawFlags: TypedFlags<typeof flags>) {
  const { encode, decode, mask, tolerance, transform } = rawFlags
  return {
    ...rawFlags,
    tolerance:
      tolerance === TOLERANCE_NOT_SET
        ? DEFAULT_TOLERANCE[rawFlags.algorithmVersion as AlgorithmVersion][transform as TransformAlgorithm]
        : tolerance,
    encode: encode && !decode,
    decode,
    mask: mask ? resolvePath(process.cwd(), mask) : '',
  } as Flags
}

export function validateFlags({
  algorithmVersion,
  encode,
  message,
  size,
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags) {
  const radix = Math.log(size) / Math.log(2)
  if (!Object.values(AlgorithmVersion).includes(algorithmVersion)) {
    return 'unsupported algorithm version: ' + algorithmVersion
  }
  if (!message && encode) {
    return '-m, --message is required'
  }
  if (isNaN(size) || size <= 0 || radix !== Math.floor(radix) || radix > 15) {
    return '-s, --size should be a postive radix-2 number'
  }
  if (isNaN(copies) || copies <= 0 || copies % 2 === 0 || copies > 31) {
    return '-c, --copies should be a postive odd number and less than 31'
  }
  // the validation for transform algorithm should prior to tolerance,
  // because tolerance validation depends on transform algorithm
  if (!Object.values(TransformAlgorithm).includes(transform)) {
    return 'unknown transform algorithm'
  }
  if (isNaN(tolerance) || tolerance <= 0 || tolerance > MAX_TOLERANCE[transform]) {
    // Is it okay?
    return `-t, --tolerance should be a positive number between [0-${MAX_TOLERANCE[transform]}] for algorithm ${transform}`
  }
  if (!Object.values(GrayscaleAlgorithm).includes(grayscale)) {
    return 'unknown grayscale algorithm'
  }

  return ''
}

export function flags2Options({
  algorithmVersion,
  message = '',
  pass = '',
  narrow,
  size,
  copies,
  tolerance,
  grayscale,
  transform,
  exhaustPixels,
  cropEdgePixels,
  fakeMaskPixels,
  verbose,
}: Flags) {
  return {
    version: algorithmVersion,
    text: message,
    mask: [],
    pass,
    narrow,
    size,
    copies,
    tolerance,
    grayscaleAlgorithm: grayscale,
    transformAlgorithm: transform,
    exhaustPixels,
    cropEdgePixels,
    fakeMaskPixels,
    verbose,
  } as EncodeOptions & DecodeOptions
}
