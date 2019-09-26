/// <reference types="node" />
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
export interface Options {
    text: string;
    clip: number;
    size: number;
    pass?: string;
    copies: number;
    tolerance: number;
    grayscaleAlgorithm: GrayscaleAlgorithm;
    transformAlgorithm: TransformAlgorithm;
}
export interface EncodeOptions extends Options {
}
export interface DecodeOptions extends Options {
}
export declare function encode(imgBuf: Buffer, options: EncodeOptions): Promise<Buffer>;
export declare function decode(imgBuf: Buffer, options: EncodeOptions): Promise<string>;
