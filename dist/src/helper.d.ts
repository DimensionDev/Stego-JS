/// <reference types="node" />
import { Readable } from 'stream';
export declare function rs2Buf(rs: Readable): Promise<Buffer>;
export declare function buf2Img(imageBuf: Buffer): Promise<ImageData>;
export declare function img2Buf(imageData: ImageData): Buffer;
export declare function clamp(v: number, min: number, max: number): number;
export declare function hash(input: string): number;
export declare function hashCode(input: string, mod: number, inArray: number[]): readonly [number, string];
export declare function shuffle(nums: number[], seed: number[], unshuffle?: boolean): void;
export declare function unshuffle(nums: number[], seed: number[]): void;
export declare function rgb2yuv(r: number, g: number, b: number): number[];
export declare function yuv2rgb(y: number, cb: number, cr: number): number[];
export declare function filterIndices(size: number, predicator: (i: number) => boolean): number[];
export declare function squareTopLeftCircleExclude(size: number, radius: number): number[];
export declare function squareBottomRightCircleExclude(size: number, radius: number): number[];
export declare function squareCircleIntersect(size: number, radius: number): number[];
