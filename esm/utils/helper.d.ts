/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Readable } from 'stream';
export declare function rs2Buf(rs: Readable): Promise<Buffer>;
export declare function rand(min: number, max: number): number;
export declare function clamp(v: number, min: number, max: number): number;
export declare function hash(input: string): number;
export declare function hashCode(input: string, mod: number, inArray: number[]): readonly [number, string];
export declare function shuffleGroupBy3(nums: any[], seed: number[], unshuffle?: boolean): void;
export declare function unshuffleGroupBy3(nums: any[], seed: number[]): void;
export declare function shuffle(nums: any[], seed: any[], unshuffle?: boolean): void;
export declare function unshuffle(nums: any[], seed: any[]): void;
export declare function rgb2yuv(r: number, g: number, b: number): number[];
export declare function yuv2rgb(y: number, cb: number, cr: number): number[];
export declare function filterIndices(size: number, predicator: (i: number) => boolean): number[];
export declare function squareTopLeftCircleExclude(size: number, radius: number): number[];
export declare function squareBottomRightCircleExclude(size: number, radius: number): number[];
export declare function squareCircleIntersect(size: number, radius: number): number[];
export declare function isJPEG(buf: Uint8Array): boolean;
export declare function isPNG(buf: Uint8Array): boolean;
export declare function imgType(buf: Uint8Array): "image/jpeg" | "image/png" | undefined;
//# sourceMappingURL=helper.d.ts.map