import { Options } from '.';
export declare type Bit = 0 | 1;
export interface Loc {
    c: number;
    p: number;
    b: number;
}
export declare function str2bits(text: string, copies: number): Array<Bit>;
export declare function bits2str(bits: Array<Bit>, copies: number): string;
export declare function mergeBits(dest: Array<Bit>, ...src: Array<Array<Bit>>): Bit[];
export declare function createBits(size: number): Bit[];
export declare function getBit(block: number[], loc: Loc, options: Options): Bit;
export declare function setBit(block: number[], bits: Array<Bit>, loc: Loc, options: Options): void;
