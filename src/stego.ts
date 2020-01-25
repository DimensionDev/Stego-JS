import { GrayscaleAlgorithm, grayscale, narrow } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import {
  cropImg,
  updateImgByBlock,
  updateImgByPixel,
  visitImgByBlock,
} from './image';
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
import { isPixelVisibleAt, isBlockVisibleAt } from './mask';

export interface Options {
  pass?: string;
  size: number;
  copies: number;
  tolerance: number;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {
  text: string;
  narrow: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
  noExhaustPixels: boolean;
  noCropEdgePixels: boolean;
}

export interface DecodeOptions extends Options {}

export async function encodeImg(
  imgData: ImageData,
  maskData: ImageData,
  options: EncodeOptions
) {
  const {
    text,
    size,
    narrow: narrowSize,
    copies,
    grayscaleAlgorithm,
    transformAlgorithm,
    noExhaustPixels,
  } = options;
  const [width, height] = cropImg(imgData, options);
  const sizeOfBlocks = width * height * 3;
  const textBits = str2bits(text, copies);
  const bits = mergeBits(
    createBits(noExhaustPixels ? textBits.length : sizeOfBlocks),
    textBits,
    createBits(8 * copies).fill(1) // the end of message
  );

  if (textBits.length + 8 * copies > sizeOfBlocks) {
    process.stderr.write(
      'bits overflow! try to shrink text or reduce copies.\n'
    );
  }
  if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE || narrowSize > 0) {
    updateImgByPixel(imgData, options, ([r, g, b, a], loc) => {
      if (!isPixelVisibleAt(maskData, loc, options)) {
        return [r, g, b, a];
      }

      // decolor
      if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE) {
        const y = grayscale(r, g, b, grayscaleAlgorithm);

        r = y;
        g = y;
        b = y;
      }

      // narrow color value
      if (narrowSize > 0) {
        r = narrow(r, narrowSize);
        g = narrow(g, narrowSize);
        b = narrow(b, narrowSize);
      }
      return [r, g, b, a];
    });
  }

  const acc = createAcc(options);

  updateImgByBlock(imgData, options, (block, loc) => {
    if (noExhaustPixels && loc.b > bits.length) {
      return;
    }
    if (!isBlockVisibleAt(maskData, loc, options)) {
      return;
    }

    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    setBit(re, bits, acc, loc, options);
    inverseTransform(re, im, transformAlgorithm, options);
  });
  return imgData;
}

export async function decodeImg(
  imgData: ImageData,
  maskData: ImageData,
  options: DecodeOptions
) {
  const { size, copies, transformAlgorithm } = options;
  const bits: Bit[] = [];
  const acc = createAcc(options);

  visitImgByBlock(imgData, options, (block, loc) => {
    if (!isBlockVisibleAt(maskData, loc, options)) {
      return;
    }

    const re = block;
    const im = new Array(size * size).fill(0);

    transform(re, im, transformAlgorithm, options);
    bits.push(getBit(re, acc, loc, options));
  });
  return bits2str(bits, copies);
}
