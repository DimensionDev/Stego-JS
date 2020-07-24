import { resolve as resolvePath } from 'path';
import { EncodeOptions, DecodeOptions } from './stego';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import {
  DEFAULT_SIZE,
  DEFAULT_NARROW,
  DEFAULT_COPIES,
  DEFAULT_TOLERANCE,
  DEFAULT_FAKE_MASK_PIXELS,
  DEFAULT_EXHAUST_PIXELS,
  DEFAULT_CROP_EDGE_PIXELS,
} from './constant';
import { TypedFlags } from 'meow';

export interface Flags {
  help: boolean;
  version: boolean;
  encode: boolean;
  decode: boolean;
  message: string;
  mask: string;
  narrow: number;
  size: number;
  copies: number;
  pass?: string;
  tolerance: number;
  grayscale: GrayscaleAlgorithm;
  transform: TransformAlgorithm;
  exhaustPixels: boolean;
  cropEdgePixels: boolean;
  fakeMaskPixels: boolean;
}

export const flags = {
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
    default: DEFAULT_TOLERANCE,
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
} as const;

export function normalizeFlags(rawFlags: TypedFlags<typeof flags>) {
  const { encode, decode, mask } = rawFlags;

  return {
    ...rawFlags,
    encode: encode && !decode,
    decode,
    mask: mask ? resolvePath(process.cwd(), mask) : '',
  } as Flags;
}

export function validateFlags({
  encode,
  message,
  size,
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags) {
  const radix = Math.log(size) / Math.log(2);

  if (!message && encode) {
    return '-m, --message is required';
  }
  if (isNaN(size) || size <= 0 || radix !== Math.floor(radix)) {
    return '-s, --size should be a postive radix-2 number';
  }
  if (isNaN(copies) || copies <= 0 || copies % 2 === 0) {
    return '-c, --copies should be a postive odd number';
  }
  if (isNaN(tolerance) || tolerance <= 0 || tolerance > 128) {
    return '-t, --tolerance should be a positive number between [0-128]';
  }
  if (!Object.values(GrayscaleAlgorithm).includes(grayscale)) {
    return 'unknown grayscale algorithm';
  }
  if (!Object.values(TransformAlgorithm).includes(transform)) {
    return 'unknown transform algorithm';
  }
  return '';
}

export function flags2Options({
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
}: Flags) {
  return {
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
  } as EncodeOptions & DecodeOptions;
}
