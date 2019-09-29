import { Options } from '.';
import { Accumulator } from './position';
export declare type Bit = 0 | 1;
export interface Loc {
    c: number;
    p: number;
    b: number;
}
export declare function str2bits(text: string, copies: number): Bit[];
export declare function bits2str(bits: Bit[], copies: number): string;
export declare function mergeBits(dest: Bit[], ...src: Bit[][]): Bit[];
export declare function createBits(size: number): Bit[];
export declare function getBit(block: number[], acc: Accumulator, loc: Loc, options: Options): Bit;
export declare function setBit(block: number[], bits: Bit[], acc: Accumulator, loc: Loc, options: Options): void;
