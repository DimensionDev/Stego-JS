import { Locator } from './image';
import { Options } from './stego';

export enum Visibility {
  Visible = 0,
  Hidden = 1,
}

export function createMask({ width, height, data }: ImageData) {
  const mask = [];

  for (let i = 0; i < width * height; i += 1) {
    mask.push(data[i * 4] > 127 ? Visibility.Visible : Visibility.Hidden);
  }
  return mask;
}

export function isBlockVisibleAt({ p, w }: Locator, { mask, size }: Options) {
  const h1 = Math.floor(p / Math.floor(w / size)) * size;
  const w1 = (p % Math.floor(w / size)) * size;

  for (let i = 0; i < size * size; i += 1) {
    const h2 = Math.floor(i / size);
    const w2 = i % size;

    if (mask[(h1 + h2) * w + w1 + w2] === Visibility.Hidden) {
      return false;
    }
  }
  return true;
}

export function isPixelVisibleAt(index: number, { mask }: Options) {
  return mask[index] !== Visibility.Hidden;
}
