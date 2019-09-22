import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import { buf2Img, img2Buf } from './helper';
import { applyBlock, divideImg } from './stego';

export interface Options {
  pass?: string;
  clip: number;
  copies: number;
  size: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {}

export interface DecodeOptions extends Options {}

export async function encode(
  imgBuf: Buffer,
  { size, transformAlgorithm }: EncodeOptions
) {
  const imageData = await buf2Img(imgBuf);

  let c = 0;
  let i = 0;

  for (const block of divideImg(imageData, size)) {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, size, transformAlgorithm);
    // set bits
    inverseTransform(re, im, size, transformAlgorithm);
    applyBlock(imageData, re, size, i, c);

    // update location for next block
    c += 1;
    if (c === 3) {
      i += 1;
      c = 0;
    }
  }
  return img2Buf(imageData);
}

export function decode(imgBuf: Buffer, options: DecodeOptions) {}
