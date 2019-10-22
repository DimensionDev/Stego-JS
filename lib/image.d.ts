import { Loc } from './bit';
import { Options, EncodeOptions } from '.';
export declare function updateImg(imgData: ImageData, block: number[], { p, c }: Loc, { size }: Options): void;
export declare function divideImg(imgData: ImageData, { size }: Options): Generator<number[], void, unknown>;
export declare function decolorImg(imgData: ImageData, { grayscaleAlgorithm }: EncodeOptions): void;
export declare function narrowImg(imgData: ImageData, { narrow: narrowSize }: EncodeOptions): void;
export declare function walkImg(imgData: ImageData, options: Options, callback: (block: number[], loc: Loc) => void): void;
