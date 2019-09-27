import { Loc } from './bit';
import { Options, EncodeOptions } from '.';
export declare function updateImg(imageData: ImageData, block: Array<number>, { p, c }: Loc, { size }: Options): void;
export declare function divideImg(imageData: ImageData, { size }: Options): Generator<number[], void, unknown>;
export declare function decolorImg(imageData: ImageData, { grayscaleAlgorithm }: EncodeOptions): void;
export declare function clipImg(imageData: ImageData, { clip: clipSize }: EncodeOptions): void;
export declare function walkImg(imageData: ImageData, options: Options, callback: (block: Array<number>, loc: Loc) => void): void;
