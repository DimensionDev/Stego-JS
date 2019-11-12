import { clamp } from './helper';
import { grayscale, narrow } from './grayscale';
import { Options, EncodeOptions } from './stego';
import { isPixelVisibleAt, isBlockVisibleAt } from './mask';

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

export function updateImg(
  { data }: ImageData,
  block: number[],
  { p, c, w }: Locator,
  { size }: Options
) {
  const h1 = Math.floor(p / Math.floor(w / size)) * size;
  const w1 = (p % Math.floor(w / size)) * size;

  for (let i = 0; i < block.length; i += 1) {
    const h2 = Math.floor(i / size);
    const w2 = i % size;

    data[((h1 + h2) * w + w1 + w2) * 4 + c] = clamp(
      Math.round(block[i]),
      0,
      255
    );
  }
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

export function decolorImg(
  { width, height, data }: ImageData,
  options: EncodeOptions
) {
  for (let i = 0; i < width * height; i += 1) {
    if (isPixelVisibleAt(i, options)) {
      const p = i * 4;
      const g = grayscale(
        data[p],
        data[p + 1],
        data[p + 2],
        options.grayscaleAlgorithm
      );

      data[p] = g;
      data[p + 1] = g;
      data[p + 2] = g;
    }
  }
}

export function narrowImg(
  { width, height, data }: ImageData,
  { narrow: narrowSize }: EncodeOptions
) {
  for (let i = 0; i < width * height; i += 1) {
    const p = i * 4;

    data[p] = narrow(data[p], narrowSize);
    data[p + 1] = narrow(data[p + 1], narrowSize);
    data[p + 2] = narrow(data[p + 2], narrowSize);
  }
}

export function visitImg(
  imgData: ImageData,
  options: Options,
  callback: (block: number[], loc: Locator) => void
) {
  const gen = divideImg(imgData, options);
  const { width, height } = imgData;
  let c = 0;
  let p = 0;
  let b = 0;

  while (true) {
    const { value } = gen.next();

    if (!value) {
      break;
    }

    const loc = {
      c,
      p,
      b,
      w: width,
      h: height,
    };

    if (isBlockVisibleAt(loc, options)) {
      callback(value, loc);
      c += 1;
      b += 1;
      if (c === 3) {
        c = 0;
        p += 1;
      }
    } else {
      p += 1;
      gen.next();
      gen.next();
    }
  }
}
