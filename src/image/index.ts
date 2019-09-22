import { clamp } from '../helper';
import { GrayscaleAlgorithm, grayscale, clip } from '../grayscale';

export function applyBlock(
  imageData: ImageData,
  block: Array<number>,
  size: number,
  index: number,
  channel: number
) {
  const { width } = imageData;
  const length = block.length;
  const h1 = Math.floor(index / Math.floor(width / size)) * size;
  const w1 = (index % Math.floor(width / size)) * size;

  for (let i = 0; i < length; i += 1) {
    const h2 = Math.floor(i / size);
    const w2 = i % size;

    imageData.data[((h1 + h2) * width + w1 + w2) * 4 + channel] = clamp(
      Math.round(block[i]),
      0,
      255
    );
  }
}

export function* divideImg(imageData: ImageData, size: number) {
  const { width, height, data } = imageData;

  for (let h = 0; h < height; h += size) {
    for (let w = 0; w < width; w += size) {
      for (let c = 0; c < 3; c += 1) {
        const block: Array<number> = [];

        for (let h1 = 0; h1 < size; h1 += 1) {
          for (let w1 = 0; w1 < size; w1 += 1) {
            if (h + h1 < height && w + w1 < width) {
              block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
            } else {
              break;
            }
          }
        }
        if (block.length === size * size) {
          yield block;
        }
      }
    }
  }
}

export function decolorImg(
  imageData: ImageData,
  algorithm: GrayscaleAlgorithm
) {
  const { width, height, data } = imageData;
  const length = width * height;

  for (let i = 0; i < length; i += 1) {
    const p = i * 4;
    const g = grayscale(data[p], data[p + 1], data[p + 2], algorithm);

    data[p] = g;
    data[p + 1] = g;
    data[p + 2] = g;
  }
}

export function clipImg(imageData: ImageData, size: number) {
  const { width, height, data } = imageData;
  const length = width * height;

  for (let i = 0; i < length; i += 1) {
    const p = i * 4;

    data[p] = clip(data[p], size);
    data[p + 1] = clip(data[p + 1], size);
    data[p + 2] = clip(data[p + 2], size);
  }
}
