import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import { buf2Img, img2Buf, blob2Img, img2Blob } from './canvas';
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

export async function encode(img: Buffer | Blob, options: EncodeOptions) {
  const {
    text,
    size,
    narrow,
    copies,
    grayscaleAlgorithm,
    transformAlgorithm,
    noClipEdgePixels,
  } = options;
  const imgData =
    process.env.PLATFORM === 'node'
      ? await buf2Img(img as Buffer)
      : await blob2Img(img as Blob);
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
  if (process.env.PLATFORM === 'node') {
    return img2Buf(
      imgData,
      noClipEdgePixels ? width : sizeOfRowBlocks * size,
      noClipEdgePixels ? height : sizeOfColumnBlocks * size
    );
  }
  return img2Blob(
    imgData,
    noClipEdgePixels ? width : sizeOfRowBlocks * size,
    noClipEdgePixels ? height : sizeOfColumnBlocks * size
  );
}

export async function decode(img: Buffer | Blob, options: DecodeOptions) {
  const { size, copies, transformAlgorithm } = options;
  const imgData =
    process.env.PLATFORM === 'node'
      ? await buf2Img(img as Buffer)
      : await blob2Img(img as Blob);
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
