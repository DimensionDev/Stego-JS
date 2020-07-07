import { Options } from './stego';
import { TransformAlgorithm } from './transform';
import { hashCode, squareCircleIntersect } from './helper';
import { Locator } from './locator';

export interface Accumulator {
  /**
   * previous bit position
   */
  prevPos: number;
  /**
   * previous hash code
   */
  prevCode: string;
  /**
   * available indices
   */
  indices: number[];
}

export function createAcc({ size, transformAlgorithm }: Options) {
  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return {
        prevPos: -1,
        prevCode: '',
        indices: squareCircleIntersect(size, 3),
      };
    default:
      return {
        prevPos: -1,
        prevCode: '',
        indices: [],
      };
  }
}

export function getPosFromAcc(
  acc: Accumulator,
  { c }: Locator,
  { pass }: Options
) {
  const { prevCode, prevPos, indices } = acc;

  if (c !== 0) {
    return prevPos;
  }

  const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, []);

  acc.prevCode = code;
  acc.prevPos = indices[index];
  return indices[index];
}

export function getPos(acc: Accumulator, loc: Locator, options: Options) {
  const { pass, size, transformAlgorithm } = options;

  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      // return [1, (size * size + size) / 2];
      return [4 * size + 2, 3 * size + 3];
      // return pass ? getPosFromAcc(acc, loc, options) : (size * size + size) / 2;
    case TransformAlgorithm.FFT2D:
      // return [1, (size * size + size) / 2];
      // return [4 * size + 2, 3 * size + 3];
      return [4 * size + 2, 3 * size + 3];
      // return [1, (size * size + size) / 2];
    case TransformAlgorithm.DCT:
      return [4 * size + 2, 3 * size + 3];
      // return [1, (size * size + size) / 2];
    default:
      throw new Error(`unknown algortihm: ${transformAlgorithm}`);
  }
}
