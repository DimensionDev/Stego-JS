import { Options } from './stego';
import { getPos, Accumulator } from './position';
import { Locator } from './locator';

export type Bit = 0 | 1;

export function str2bits(text: string, copies: number): Bit[] {
  const chars = Array.from(text);
  const bits: Bit[] = [];
  const pushByte = (byte: Bit[], n: number) => {
    for (let i = 0; i < 8; i += 1) {
      let j = 0;

      while (j++ < n) {
        bits.push(byte[i]);
      }
    }
  };

  for (let i = 0; i < chars.length; i += 1) {
    const codes = Array.from(encodeURI(chars[i]));

    for (let j = 0; j < codes.length; j += 1) {
      const byte: Bit[] = [];
      let reminder: Bit = 0;
      let code = codes[j].charCodeAt(0);

      do {
        reminder = (code % 2) as Bit;
        byte.push(reminder);
        code = code - Math.floor(code / 2) - reminder;
      } while (code > 1);
      byte.push(code as Bit);
      while (byte.length < 8) {
        byte.push(0);
      }
      pushByte(byte.reverse(), copies);
    }
  }
  return bits;
}

export function bits2str(bits: Bit[], copies: number) {
  let k = 128;
  let temp = 0;
  const chars: string[] = [];
  const candidates: Bit[] = [];
  const elect = () =>
    candidates.filter(c => c === 1).length >= copies / 2 ? 1 : 0;

  for (let i = 0; i < bits.length; i += 1) {
    candidates.push(bits[i]);

    if (candidates.length === copies) {
      temp += elect() * k;
      k /= 2;
      candidates.length = 0;

      // end of message
      if (temp === 255) {
        break;
      }
      if (k < 1) {
        chars.push(String.fromCharCode(temp));
        temp = 0;
        k = 128;
      }
    }
  }
  try {
    return decodeURI(chars.join(''));
  } catch (e) {
    console.warn("Error when decoding:  " + e);
    return '';
  }
}

export function mergeBits(dest: Bit[], ...src: Bit[][]) {
  let k = 0;

  for (let i = 0; i < src.length; i += 1) {
    const bits = src[i];

    for (let j = 0; j < bits.length && k < dest.length; j += 1, k += 1) {
      dest[k] = bits[j];
    }
  }
  return dest;
}

export function createBits(size: number) {
  const bits: Bit[] = new Array(size).fill(0);

  for (let i = 0; i < size; i += 1) {
    bits[i] = Math.floor(Math.random() * 2) as Bit;
  }
  return bits;
}

export function getBit(
  block: number[],
  acc: Accumulator,
  loc: Locator,
  options: Options
) {
  const [pos1, pos2] = getPos(acc, loc, options);
  const { tolerance } = options;

  return ((block[pos1] > block[pos2]) ? 1 : 0) as Bit;
}

export function setBit(
  block: number[],
  bits: Bit[],
  acc: Accumulator,
  loc: Locator,
  options: Options
) {
  const [pos1, pos2] = getPos(acc, loc, options);
  const { tolerance } = options;
  let v1 = block[pos1];
  let v2 = block[pos2];
  
  // amplifier the difference between v1 and v2
  // (v1 < v2) ? v1 -= tolerance : v2 -= tolerance;
  [v1, v2] = v1 < v2? [v1 - tolerance, v2] : [v1, v2 - tolerance];


  if (bits[loc.b]) {//bit '1':  block[pos1] > block[pos2]
    [block[pos1], block[pos2]] = (v1 < v2) ? [v2, v1] : [v1, v2];
  } else {    // bit '0':  block[pos1] < block[pos2]
    [block[pos1], block[pos2]] = (v1 < v2) ? [v1, v2] : [v2, v1];
  }
}
