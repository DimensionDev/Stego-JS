import { Result } from 'meow';
import { resolve as resolvePath } from 'path';
import { EncodeOptions, DecodeOptions } from './stego';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import {
  TOLERANCE_NOT_SET,
  DEFAULT_DCT_TOLERANCE,
  DEFAULT_FFT1D_TOLERANCE,
  DEFAULT_FFT2D_TOLERANCE,
} from './constant';

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

export function normalizeFlags(flags: Result['flags']) {
  const { encode, decode, size, narrow, copies, tolerance, mask } = flags;
  let t = tolerance;
  
  if (tolerance === TOLERANCE_NOT_SET)
    switch(flags.transform) {
      case TransformAlgorithm.FFT1D:
        t = DEFAULT_FFT1D_TOLERANCE;
        break;
      case TransformAlgorithm.FFT2D:
        t = DEFAULT_FFT2D_TOLERANCE;
        break;
      case TransformAlgorithm.DCT:
        t = DEFAULT_DCT_TOLERANCE;
        break;
      default:
        break;
    }
  else
    t = parseInt(tolerance, 10);
  return {
    ...flags,
    narrow: parseInt(narrow, 10),
    size: parseInt(size, 10),
    copies: parseInt(copies, 10),
    tolerance: t,
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
  if (isNaN(tolerance) || tolerance <= 0 || tolerance > 1000) { //Is it okay?
    return '-t, --tolerance should be a positive number between [0-1000]';
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
