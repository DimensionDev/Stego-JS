import { Options } from '.';
import { Loc } from './bit';
import { TransformAlgorithm } from './transform';
import { hashCode, squareCircleIntersect } from './helper';

export interface Accumulator {
  prevPos: number; // previous bit position
  prevCode: string; // previous hash code
  indices: number[]; // available indices
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

export function getPosFromAcc(acc: Accumulator, { c }: Loc, { pass }: Options) {
  const { prevCode, prevPos, indices } = acc;

  if (c !== 0) {
    return prevPos;
  }

  const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, []);

  acc.prevCode = code;
  acc.prevPos = indices[index];
  return indices[index];
}

export function getPos(acc: Accumulator, loc: Loc, options: Options) {
  const { transformAlgorithm } = options;

  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return getPosFromAcc(acc, loc, options);
    case TransformAlgorithm.FFT2D:
      return 0;
    case TransformAlgorithm.DCT:
      return 0;
    default:
      throw new Error(`unknown algortihm: ${transformAlgorithm}`);
  }
}
