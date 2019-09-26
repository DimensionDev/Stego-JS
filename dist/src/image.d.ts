import { GrayscaleAlgorithm } from './grayscale';
import { Loc } from './bit';
import { Options } from '.';
export declare function updateImg(imageData: ImageData, block: Array<number>, { p, c }: Loc, { size }: Options): void;
export declare function divideImg(imageData: ImageData, size: number): Generator<number[], void, unknown>;
export declare function decolorImg(imageData: ImageData, algorithm: GrayscaleAlgorithm): void;
export declare function clipImg(imageData: ImageData, size: number): void;
export declare function walkImg(imageData: ImageData, size: number, callback: (block: Array<number>, loc: Loc) => void): void;
