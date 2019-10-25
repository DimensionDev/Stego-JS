import FFT from './fft/index.js';
import * as DCT from './dct';
import { Options } from './stego';

export enum TransformAlgorithm {
  FFT1D = 'FFT1D',
  FFT2D = 'FFT2D',
  DCT = 'DCT',
}

export function transform(
  re: number[],
  im: number[],
  algorithm: TransformAlgorithm,
  { size }: Options
) {
  switch (algorithm) {
    case TransformAlgorithm.FFT1D:
      FFT.init(size);
      FFT.fft1d(re, im);
      break;
    case TransformAlgorithm.FFT2D:
      FFT.init(size);
      FFT.fft2d(re, im);
      break;
    case TransformAlgorithm.DCT:
      DCT.dct(re, size);
      break;
    default:
      throw new Error(`unknown algorithm: ${algorithm}`);
  }
}

export function inverseTransform(
  re: number[],
  im: number[],
  algorithm: TransformAlgorithm,
  { size }: Options
) {
  switch (algorithm) {
    case TransformAlgorithm.FFT1D:
      FFT.init(size);
      FFT.ifft1d(re, im);
      break;
    case TransformAlgorithm.FFT2D:
      FFT.init(size);
      FFT.ifft2d(re, im);
      break;
    case TransformAlgorithm.DCT:
      DCT.idct(re, size);
      break;
    default:
      throw new Error(`unknown algorithm: ${algorithm}`);
  }
}
