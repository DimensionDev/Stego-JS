import { GrayscaleAlgorithm, grayscale, narrow } from './grayscale';
import { TransformAlgorithm, transform, inverseTransform } from './transform';
import {
  cropImg,
  updateImgByBlock,
  updateImgByPixel,
  visitImgByBlock,
  updateImgByPixelAt,
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
import { rand } from './helper';
import { loc2idx, loc2coord } from './locator';

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
  exhaustPixels: boolean;
  cropEdgePixels: boolean;
  fakeMaskPixels: boolean;
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
    exhaustPixels,
  } = options;
  const [width, height] = cropImg(imgData, options);
  const sizeOfBlocks = width * height * 3;
  const textBits = str2bits(text, copies);
  const bits = mergeBits(
    createBits(exhaustPixels ? sizeOfBlocks : textBits.length + 8 * copies),
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
  const im = new Array(size * size);

  updateImgByBlock(imgData, options, (block, loc) => {
    if (!exhaustPixels && loc.b >= bits.length) {
      return false;
    }
    if (!isBlockVisibleAt(maskData, loc, options)) {
      if (options.fakeMaskPixels && loc.c === 0) {
        const [x, y] = loc2coord(loc, options);
        const g = rand(10, 127);

        updateImgByPixelAt(
          imgData,
          options,
          [g, g, g, 255],
          loc2idx(loc, options, x, y, rand(0, 64))
        );
      }
      return false;
    }
    transform(block, im.fill(0), transformAlgorithm, options);
    setBit(block, bits, acc, loc, options);
    inverseTransform(block, im, transformAlgorithm, options);
    return true;
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
  const im = new Array(size * size);

  visitImgByBlock(imgData, options, (block, loc) => {
    if (!isBlockVisibleAt(maskData, loc, options)) {
      return false;
    }
    transform(block, im.fill(0), transformAlgorithm, options);
    bits.push(getBit(block, acc, loc, options));
    return true;
  });
  return bits2str(bits, copies);
}
