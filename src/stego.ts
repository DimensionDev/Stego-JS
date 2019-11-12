import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import { updateImg, decolorImg, narrowImg, visitImg, cropImg } from './image';
import {
  mergeBits,
  createBits,
  str2bits,
  setBit,
  getBit,
  bits2str,
  Bit,
} from './bit';
import { createAcc } from './position';
import { Visibility, isBlockVisibleAt } from './mask';

export interface Options {
  pass?: string;
  mask: Visibility[];
  size: number;
  copies: number;
  tolerance: number;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {
  text: string;
  narrow: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
  noCropEdgePixels: boolean;
}

export interface DecodeOptions extends Options {}

export async function encodeImg(imgData: ImageData, options: EncodeOptions) {
  const {
    text,
    size,
    narrow,
    copies,
    grayscaleAlgorithm,
    transformAlgorithm,
  } = options;
  const [width, height] = cropImg(imgData, options);
  const sizeOfBlocks = width * height * 3;
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
    decolorImg(imgData, options);
  }
  if (narrow > 0) {
    narrowImg(imgData, options);
  }

  const acc = createAcc(options);

  visitImg(imgData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    setBit(re, bits, acc, loc, options);
    inverseTransform(re, im, transformAlgorithm, options);
    updateImg(imgData, re, loc, options);
  });
  return imgData;
}

export async function decodeImg(imgData: ImageData, options: DecodeOptions) {
  const { size, copies, transformAlgorithm } = options;
  const bits: Bit[] = [];
  const acc = createAcc(options);

  visitImg(imgData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    bits.push(getBit(re, acc, loc, options));
  });
  return bits2str(bits, copies);
}
