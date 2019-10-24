import { Readable } from 'stream';

export function rs2Buf(rs: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const bufs: Uint8Array[] = [];

    rs.on('data', c => bufs.push(c));
    rs.on('end', () => resolve(Buffer.concat(bufs)));
    rs.on('error', err => reject(err));
  });
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
  let code = 0;

  if (input.length === 0) return code;
  for (let i = 0; i < input.length; i += 1) {
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
  const swap = (a: number, b: number) =>
    ([nums[a], nums[b]] = [nums[b], nums[a]]);

  for (
    let i = unshuffle ? nums.length - 1 : 0;
    (unshuffle && i >= 0) || (!unshuffle && i < nums.length);
    i += unshuffle ? -1 : 1
  ) {
    swap(seed[i % seed.length] % nums.length, i);
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

export function filterIndices(
  size: number,
  predicator: (i: number) => boolean
) {
  const indices: number[] = [];

  for (let i = 0; i < size * size; i += 1) {
    if (predicator(i)) {
      indices.push(i);
    }
  }
  return indices;
}

export function squareTopLeftCircleExclude(size: number, radius: number) {
  return filterIndices(size, i => {
    const x = Math.floor(i / size);
    const y = i % size;

    return Math.sqrt(y * y + x * x) > radius;
  });
}

export function squareBottomRightCircleExclude(size: number, radius: number) {
  return filterIndices(size, i => {
    const x = Math.floor(i / size);
    const y = i % size;

    return (
      Math.sqrt(Math.pow(size - y - 1, 2) + Math.pow(size - x - 1, 2)) > radius
    );
  });
}

export function squareCircleIntersect(size: number, radius: number) {
  const mid = (size + 1) / 2 - 1;

  return filterIndices(size, i => {
    const x = Math.floor(i / size);
    const y = i % size;

    return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
  });
}
