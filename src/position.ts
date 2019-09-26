import { Options } from '.';
import { Loc } from './bit';
import { TransformAlgorithm } from './transform';

export function getPositionInBlock(
  loc: Loc,
  { size, transformAlgorithm }: Options
) {
  switch (transformAlgorithm) {
    case TransformAlgorithm.FFT1D:
      return size * size;
    case TransformAlgorithm.FFT2D:
      return 0;
  }
}
