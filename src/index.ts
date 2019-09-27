import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import { buf2Img, img2Buf } from './helper';
import { updateImg, decolorImg, clipImg, walkImg } from './image';
import {
  mergeBits,
  createBits,
  str2bits,
  setBit,
  getBit,
  Bit,
  bits2str,
} from './bit';

export interface Options {
  size: number;
  pass?: string;
  copies: number;
  tolerance: number;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {
  text: string;
  clip: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
}

export interface DecodeOptions extends Options {}

export async function encode(imgBuf: Buffer, options: EncodeOptions) {
  const {
    text,
    size,
    clip,
    copies,
    grayscaleAlgorithm,
    transformAlgorithm,
  } = options;
  const imageData = await buf2Img(imgBuf);
  const { width, height } = imageData;
  const sizeOfBlocks = Math.floor(width / size) * Math.floor(height / size);
  const textBits = str2bits(text, copies);
  const bits = mergeBits(
    createBits(sizeOfBlocks),
    textBits,
    createBits(8 * copies).fill(1) // end of message
  );

  if (textBits.length + 8 * copies > sizeOfBlocks) {
    process.stderr.write(
      'bits overflow! try to shrink text or reduce copies.\n'
    );
  }
  if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE) {
    decolorImg(imageData, options);
  }
  if (clip > 0) {
    clipImg(imageData, options);
  }
  walkImg(imageData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    setBit(re, bits, loc, options);
    inverseTransform(re, im, transformAlgorithm, options);
    updateImg(imageData, re, loc, options);
  });
  return img2Buf(imageData);
}

export async function decode(imgBuf: Buffer, options: DecodeOptions) {
  const { size, copies, transformAlgorithm } = options;
  const imageData = await buf2Img(imgBuf);
  const bits: Array<Bit> = [];

  walkImg(imageData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    bits.push(getBit(re, loc, options));
  });
  return bits2str(bits, copies);
}
