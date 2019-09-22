import { Readable } from 'stream';
import { createCanvas, Image } from 'canvas';

export function rs2Buf(rs: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const bufs: Array<Uint8Array> = [];

    rs.on('data', c => bufs.push(c));
    rs.on('end', () => resolve(Buffer.concat(bufs)));
    rs.on('error', err => reject(err));
  });
}

export function buf2Img(imageBuf: Buffer) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const { width, height } = image;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0, width, height);
      resolve(ctx.getImageData(0, 0, width, height));
    };
    image.onerror = err => reject(err);
    image.dataMode = Image.MODE_IMAGE;
    image.src = imageBuf;
  });
}

export function img2Buf(imageData: ImageData) {
  const { width, height } = imageData;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer('image/png');
}

export function clamp(v: number, min: number, max: number) {
  if (v < min) {
    console.warn(`clamp min: ${v}`);
    return min;
  }
  if (v > max) {
    console.warn(`clamp max: ${v}`);
    return max;
  }
  return v;
}

export function hash(input: string) {
  const len = input.length;
  let code = 0;

  if (len === 0) return code;
  for (let i = 0; i < len; i += 1) {
    const char = input.charCodeAt(i);

    code = (code << 5) - code + char;
    code = code & code; // Convert to 32bit integer
  }
  return code;
}

export function hashCode(input: string, mod: number, inArray: number[]) {
  let prob = 1;
  let code = hash(input);
  let index = Math.abs(code) % mod;

  while (inArray[index]) {
    index = (index + prob * prob) % mod;
    prob = prob > mod / 2 ? 1 : prob + 1;
  }
  inArray[index] = 1;
  return [index, String(code)] as const;
}

export function shuffle(
  nums: number[],
  seed: number[],
  unshuffle: boolean = false
) {
  const len = nums.length;
  const swap = (a: number, b: number) =>
    ([nums[a], nums[b]] = [nums[b], nums[a]]);

  for (
    let i = unshuffle ? len - 1 : 0;
    (unshuffle && i >= 0) || (!unshuffle && i < len);
    i += unshuffle ? -1 : 1
  ) {
    swap(seed[i % seed.length] % len, i);
  }
}

export function unshuffle(nums: number[], seed: number[]) {
  return shuffle(nums, seed, true);
}

export function rgb2yuv(r: number, g: number, b: number) {
  return [
    (77 / 256) * r + (150 / 256) * g + (29 / 256) * b,
    -(44 / 256) * r - (87 / 256) * g + (131 / 256) * b + 128,
    (131 / 256) * r - (110 / 256) * g - (21 / 256) * b + 128,
  ];
}

export function yuv2rgb(y: number, cb: number, cr: number) {
  return [
    y + 1.4075 * (cr - 128),
    y - 0.3455 * (cb - 128) - 0.7169 * (cr - 128),
    y + 1.779 * (cb - 128),
  ];
}
