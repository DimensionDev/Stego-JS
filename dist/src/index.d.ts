/// <reference types="node" />
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
export interface Options {
    size: number;
    pass?: string;
    copies: number;
    tolerance: number;
    transformAlgorithm: TransformAlgorithm;
}
export interface EncodeOptions extends Options {
    text: string;
    clip: number;
    grayscaleAlgorithm: GrayscaleAlgorithm;
}
export interface DecodeOptions extends Options {
}
export declare function encode(imgBuf: Buffer, options: EncodeOptions): Promise<Buffer>;
export declare function decode(imgBuf: Buffer, options: DecodeOptions): Promise<string>;
