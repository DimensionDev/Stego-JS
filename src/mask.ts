import { Locator } from './image';
import { Options } from './stego';

export function isBlockVisibleAt(
  { data }: ImageData,
  { p, w }: Locator,
  { size }: Options
) {
  const h1 = Math.floor(p / Math.floor(w / size)) * size;
  const w1 = (p % Math.floor(w / size)) * size;

  for (let i = 0; i < size * size; i += 1) {
    const h2 = Math.floor(i / size);
    const w2 = i % size;
    const value = data[((h1 + h2) * w + w1 + w2) * 4];

    if (typeof value !== 'undefined' && value < 127) {
      return false;
    }
  }
  return true;
}

export function isPixelVisibleAt(
  { data }: ImageData,
  loc: number,
  options: Options
) {
  const value = data[loc * 4];

  return typeof value === 'undefined' || value > 127;
}
