import { Options } from '../utils/stego-params.js';
import { Accumulator } from './position.js';
export declare type Bit = 0 | 1;
export declare function str2codes(text: string): number[];
export declare function codes2bits(codes: number[], copies: number): Bit[];
export declare function str2bits(text: string, copies: number): Bit[];
export declare function bits2str(richBits: readonly {
    readonly bit: Bit;
    readonly diff: number;
}[], copies: number, verbose?: boolean): string;
export declare function param2bits(options: Options): Bit[];
export declare function bits2param(bits: Bit[]): number;
export declare function mergeBits(dest: Bit[], ...src: Bit[][]): Bit[];
export declare function getBit(block: number[], acc: Accumulator, options: Options): {
    bit: Bit;
    diff: number;
};
export declare function setBit(block: number[], bit: Bit, options: Options, tolerance: number): void;
//# sourceMappingURL=bit.d.ts.map