import { RandomSource } from './stego-params.js';
export declare function clamp(v: number, min: number, max: number): number;
export declare function hash(input: string): number;
export declare function hashCode(input: string, mod: number, inArray: number[]): readonly [number, string];
export declare function shuffleGroupBy3<T>(numbers: T[], seed: readonly number[], unshuffle?: boolean): void;
export declare function unshuffleGroupBy3<T>(numbers: T[], seed: readonly number[]): void;
export declare function shuffle<T>(numbers: T[], seed: readonly number[], unshuffle?: boolean): void;
export declare function filterIndices(size: number, predicator: (i: number) => boolean): number[];
export declare function squareCircleIntersect(size: number, radius: number): number[];
export declare function getImageType(buf: ArrayLike<number>): "image/jpeg" | "image/png" | undefined;
export type Bit = 0 | 1;
export declare function randomBits(randomSource: RandomSource, size: number): Bit[];
/**
 * generate a number from range [min, max] (both inclusive)
 */
export declare function rand(randomSource: RandomSource, min: number, max: number): number;
//# sourceMappingURL=helper.d.ts.map