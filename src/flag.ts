import { Result } from 'meow';
import { EncodeOptions, DecodeOptions } from './stego';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';

export interface Flags {
  help: boolean;
  version: boolean;
  encode: boolean;
  decode: boolean;
  message: string;
  narrow: number;
  size: number;
  copies: number;
  pass?: string;
  tolerance: number;
  grayscale: GrayscaleAlgorithm;
  transform: TransformAlgorithm;
  noCropEdgePixels: boolean;
}

export function normalizeFlags(flags: Result['flags']) {
  const { encode, decode, size, narrow, copies, tolerance } = flags;

  return {
    ...flags,
    narrow: parseInt(narrow, 10),
    size: parseInt(size, 10),
    copies: parseInt(copies, 10),
    tolerance: parseInt(tolerance, 10),
    encode: encode && !decode,
    decode,
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
  noCropEdgePixels,
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
    noCropEdgePixels,
  } as EncodeOptions & DecodeOptions;
}
