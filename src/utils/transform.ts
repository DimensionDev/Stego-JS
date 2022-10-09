import FFT from '../fft/index.js'
import * as DCT from '../dct/index.js'
import { fastDctLee } from '../dct/fastdct.js'
import { Options } from './stego-params.js'

export enum TransformAlgorithm {
  FFT1D = 'FFT1D',
  FFT2D = 'FFT2D',
  DCT = 'DCT',
  FastDCT = 'fastDCT',
}

export function transform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options) {
  switch (algorithm) {
    case TransformAlgorithm.FFT1D:
      FFT.init(size)
      FFT.fft1d(re, im)
      break
    case TransformAlgorithm.FFT2D:
      FFT.init(size)
      FFT.fft2d(re, im)
      break
    case TransformAlgorithm.DCT:
      DCT.dct(re, size)
      break
    case TransformAlgorithm.FastDCT:
      fastDctLee.transform(re)
      break
    default:
      throw new Error(`unknown algorithm in transform: ${algorithm}`)
  }
}

export function inverseTransform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options) {
  switch (algorithm) {
    case TransformAlgorithm.FFT1D:
      FFT.init(size)
      FFT.ifft1d(re, im)
      break
    case TransformAlgorithm.FFT2D:
      FFT.init(size)
      FFT.ifft2d(re, im)
      break
    case TransformAlgorithm.DCT:
      DCT.idct(re, size)
      break
    case TransformAlgorithm.FastDCT:
      fastDctLee.inverseTransform(re)
      break
    default:
      throw new Error(`unknown algorithm in inverseTransform: ${algorithm}`)
  }
}
