import { GrayscaleAlgorithm, grayscale, narrow } from '../utils/grayscale';
import { transform, inverseTransform } from '../utils/transform';
import { EncodeOptions, DecodeOptions } from '../utils/stego-params';
import {
  cropImg,
  updateImgByBlock,
  updateImgByPixel,
  visitImgByBlock,
  updateImgByPixelAt,
  updateImgByPixelChannelAt
} from '../utils/image';
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
import { isPixelVisibleAt, isBlockVisibleAt } from '../utils/mask';
import { rand, shuffle, unshuffle } from '../utils/helper';
import { loc2idx, loc2coord } from '../utils/locator';
import { SEED } from '../constant';

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
  const sizeOfBlocks = width * height * 3 / (size * size);
  const textBits = str2bits(text, copies);
  const bits = mergeBits(
    createBits(sizeOfBlocks),
    textBits,
    createBits(8 * copies).fill(1) // the end of message
  );
  const encodeLen = textBits.length + 8 * copies;
  
  if (encodeLen > sizeOfBlocks) {
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
  
  let blockId = -1;

  const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v:number, i:number)=> i);

  shuffle(shuffleArr, SEED);
  const encodedId = shuffleArr.map((v:number, i:number) => { if (i < encodeLen) return v })

  updateImgByBlock(imgData, options, (block, loc) => {
    // Remove transparency for PNG. Even though we do not encode alpha channel,
    // the compression on transparant image can casue the information loss.
    if (loc.c === 0) {
      const [x, y] = loc2coord(loc, options);
      for (let i = 0; i < size * size; i += 1) {
        const idx = loc2idx(loc, options, x, y, i);
        updateImgByPixelChannelAt(imgData, idx, 3, 255);
      }
    }

    blockId += 1;
    if (!exhaustPixels && !(blockId in encodedId)) {
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
    setBit(block, bits[shuffleArr[loc.b]], acc, options);
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
    bits.push(getBit(block, acc, options));
    
    return true;
  });
  
  unshuffle(bits, SEED);
  return bits2str(bits, copies);
}
