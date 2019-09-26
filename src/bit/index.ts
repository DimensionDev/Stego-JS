import { Options } from '..';

export type Bit = 0 | 1;

export interface Loc {
  c: number; // channel
  p: number; // pixel position
  b: number; // bit or block position
}

export function str2bits(text: string, copies: number): Array<Bit> {
  const chars = text.split('');
  const bits: Array<Bit> = [];
  const pushByte = (byte: Array<Bit>, n: number) => {
    for (let i = 0; i < 8; i += 1) {
      let j = 0;

      while (j++ < n) {
        bits.push(byte[i]);
      }
    }
  };

  for (let i = 0; i < chars.length; i += 1) {
    const codes = encodeURI(chars[i]).split('');

    for (let j = 0; j < codes.length; j += 1) {
      const byte: Array<Bit> = [];
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

export function bits2str(bits: Array<Bit>, copies: number) {
  let k = 128;
  let temp = 0;
  const chars: string[] = [];
  const candidates: Array<Bit> = [];
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
  return decodeURI(chars.join(''));
}

export function mergeBits(dest: Array<Bit>, ...src: Array<Array<Bit>>) {
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
  const bits: Array<Bit> = new Array(size).fill(0);

  for (let i = 0; i < size; i += 1) {
    bits[i] = Math.floor(Math.random() * 2) as Bit;
  }
  return bits;
}

export function getBit(
  block: number[],
  pwd: string,
  { c, p, b }: Loc,
  { size, tolerance }: Options
) {
  const position = size * size; // getPositionInBlock(algorithm, pwd, b, c, size);

  return Math.abs(Math.round(block[position] / tolerance) % 2) as Bit;
}

export function setBit(
  block: number[],
  bit: Bit,
  { c, p, b }: Loc,
  { size, pass, tolerance }: Options
) {
  const position = size * size; // getPositionInBlock(algorithm, pass, b, c, size);
  const v = Math.floor(block[position] / tolerance);

  if (bit) {
    block[position] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance;
  } else {
    block[position] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance;
  }
}
