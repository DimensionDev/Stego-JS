import { clamp } from './helper';

// more grayscale algorithm:
// http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/

export enum GrayscaleAlgorithm {
  NONE = 'NONE',
  AVERAGE = 'AVG',
  LUMINANCE = 'LUMA',
  LUMINANCE_II = 'LUMA_II',
  DESATURATION = 'DESATURATION',
  MAX_DECOMPOSITION = 'MAX_DE',
  MIN_DECOMPOSITION = 'MIN_DE',
  MID_DECOMPOSITION = 'MID_DE',
  SIGNLE_R = 'R',
  SIGNLE_G = 'G',
  SIGNLE_B = 'B',
}

export function grayscale(
  r: number,
  g: number,
  b: number,
  algorithm: GrayscaleAlgorithm
) {
  switch (algorithm) {
    case GrayscaleAlgorithm.AVERAGE:
      return (r + g + b) / 3;
    case GrayscaleAlgorithm.LUMINANCE:
      return r * 0.3 + g * 0.59 + b * 0.11;
    case GrayscaleAlgorithm.LUMINANCE_II:
      return r * 0.2126 + g * 0.7152 + b * 0.0722;
    case GrayscaleAlgorithm.DESATURATION:
      return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
    case GrayscaleAlgorithm.MAX_DECOMPOSITION:
      return Math.max(r, g, b);
    case GrayscaleAlgorithm.MIN_DECOMPOSITION:
      return Math.min(r, g, b);
    case GrayscaleAlgorithm.MID_DECOMPOSITION:
      return [r, g, b].sort()[1];
    case GrayscaleAlgorithm.SIGNLE_R:
      return r;
    case GrayscaleAlgorithm.SIGNLE_G:
      return g;
    case GrayscaleAlgorithm.SIGNLE_B:
      return b;
    default:
      return 0;
  }
}

export function shades(r: number, g: number, b: number, size: number) {
  const factor = 255 / (clamp(size, 2, 256) - 1);

  return Math.floor((r + g + b) / 3 / factor + 0.5) * factor;
}

export function narrow(gray: number, size: number) {
  return clamp(Math.round(gray), size, 255 - size);
}
