import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import { buf2Img } from './canvas';
import { updateImg, decolorImg, narrowImg, walkImg } from './image';
import {
  mergeBits,
  createBits,
  str2bits,
  setBit,
  getBit,
  Bit,
  bits2str,
} from './bit';
import { createAcc } from './position';
import { img2Buf } from './canvas';

export interface Options {
  size: number;
  pass?: string;
  copies: number;
  tolerance: number;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {
  text: string;
  narrow: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
  noClipEdgePixels: boolean;
}

export interface DecodeOptions extends Options {}

export async function encode(imgBuf: Buffer, options: EncodeOptions) {
  const {
    text,
    size,
    narrow,
    copies,
    grayscaleAlgorithm,
    transformAlgorithm,
    noClipEdgePixels,
  } = options;
  const imgData = await buf2Img(imgBuf);
  const { width, height } = imgData;
  const sizeOfRowBlocks = Math.floor(width / size);
  const sizeOfColumnBlocks = Math.floor(height / size);
  const sizeOfBlocks = sizeOfRowBlocks * sizeOfColumnBlocks * 3;
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

  walkImg(imgData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    setBit(re, bits, acc, loc, options);
    inverseTransform(re, im, transformAlgorithm, options);
    updateImg(imgData, re, loc, options);
  });
  return img2Buf(
    imgData,
    noClipEdgePixels ? width : sizeOfRowBlocks * size,
    noClipEdgePixels ? height : sizeOfColumnBlocks * size
  );
}

export async function decode(imgBuf: Buffer, options: DecodeOptions) {
  const { size, copies, transformAlgorithm } = options;
  const imgData = await buf2Img(imgBuf);
  const bits: Bit[] = [];
  const acc = createAcc(options);

  walkImg(imgData, options, (block, loc) => {
    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    bits.push(getBit(re, acc, loc, options));
  });
  return bits2str(bits, copies);
}
