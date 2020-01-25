import { clamp } from './helper';
import { Options } from './stego';

export type Pixel = [number, number, number, number];

export interface Locator {
  /**
   * channel
   */
  c: number;
  /**
   * top left pixel position
   */
  p: number;
  /**
   * bit position
   */
  b: number;
  /**
   * image width
   */
  w: number;
  /**
   * image height
   */
  h: number;
}

export function cropImg({ width, height }: ImageData, { size }: Options) {
  return [
    Math.floor(width / size) * size,
    Math.floor(height / size) * size,
  ] as const;
}

export function* divideImg(
  { width, height, data }: ImageData,
  { size }: Options
) {
  for (let h = 0; h < height; h += size) {
    for (let w = 0; w < width; w += size) {
      if (h + size <= height && w + size <= width) {
        for (let c = 0; c < 3; c += 1) {
          const block: number[] = [];

          for (let h1 = 0; h1 < size; h1 += 1) {
            for (let w1 = 0; w1 < size; w1 += 1) {
              block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
            }
          }
          yield block;
        }
      }
    }
  }
}

export function visitImgByPixel(
  imgData: ImageData,
  options: Options,
  visitor: (pixel: Pixel, loc: number, imgData: ImageData) => void
) {
  const { width, height, data } = imgData;

  for (let i = 0; i < width * height; i += 1) {
    const p = i * 4;

    visitor([data[p], data[p + 1], data[p + 2], data[p + 3]], i, imgData);
  }
}

export function visitImgByBlock(
  imgData: ImageData,
  options: Options,
  visitor: (block: number[], loc: Locator, imgData: ImageData) => boolean
) {
  const { width: w, height: h } = imgData;
  let c = 0;
  let p = 0;
  let b = 0;

  for (const block of divideImg(imgData, options)) {
    const bitConsumed = visitor(block, { c, p, b, w, h }, imgData);

    c += 1;
    if (bitConsumed) {
      b += 1;
    }
    if (c === 3) {
      p += 1;
      c = 0;
    }
  }
}

export function updateImgByPixel(
  imgData: ImageData,
  options: Options,
  updater: (pixel: Pixel, loc: number, imgData: ImageData) => Pixel
) {
  visitImgByPixel(imgData, options, (pixel, loc) => {
    const p = loc * 4;
    const { data } = imgData;

    [data[p], data[p + 1], data[p + 2], data[p + 3]] = updater(
      pixel,
      loc,
      imgData
    );
  });
}

export function updateImgByBlock(
  imgData: ImageData,
  options: Options,
  updater: (block: number[], loc: Locator, imgData: ImageData) => boolean
) {
  visitImgByBlock(imgData, options, (block, loc) => {
    const bitConsumed = updater(block, loc, imgData);

    if (bitConsumed) {
      const { p, c, w } = loc;
      const { data } = imgData;
      const { size } = options;
      const h1 = Math.floor(p / Math.floor(w / size)) * size;
      const w1 = (p % Math.floor(w / size)) * size;

      for (let i = 0; i < size * size; i += 1) {
        const h2 = Math.floor(i / size);
        const w2 = i % size;

        block[i] = Math.round(block[i]);
        data[((h1 + h2) * w + w1 + w2) * 4 + c] = clamp(block[i], 0, 255);
      }
    }
    return bitConsumed;
  });
}
