import { Result } from 'meow';
import { EncodeOptions, DecodeOptions } from '.';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';

export interface Flags {
  help: boolean;
  version: boolean;
  encode: boolean;
  decode: boolean;
  message: string;
  clip: number;
  size: number;
  copies: number;
  pass?: string;
  tolerance: number;
  grayscale: GrayscaleAlgorithm;
  transform: TransformAlgorithm;
}

export function normalizeFlags(flags: Result['flags']) {
  const { encode, decode, size, clip, copies, tolerance } = flags;

  return {
    ...flags,
    clip: parseInt(clip, 10),
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
  clip,
  size,
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags) {
  return {
    text: message,
    pass,
    clip,
    size,
    copies,
    tolerance,
    grayscaleAlgorithm: grayscale,
    transformAlgorithm: transform,
  } as EncodeOptions & DecodeOptions;
}
