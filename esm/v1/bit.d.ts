import { Options } from '../utils/stego-params.js';
import { Accumulator } from './position.js';
import { Locator } from '../utils/locator.js';
export declare type Bit = 0 | 1;
export declare function str2bits(text: string, copies: number): Bit[];
export declare function bits2str(bits: Bit[], copies: number): string;
export declare function mergeBits(dest: Bit[], ...src: Bit[][]): Bit[];
export declare function getBit(block: readonly number[], acc: Accumulator, loc: Locator, options: Options): Bit;
export declare function setBit(block: number[], bits: readonly Bit[], acc: Accumulator, loc: Locator, options: Options): void;
//# sourceMappingURL=bit.d.ts.map