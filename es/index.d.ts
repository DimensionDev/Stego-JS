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
    narrow: number;
    grayscaleAlgorithm: GrayscaleAlgorithm;
    noClipEdgePixels: boolean;
}
export interface DecodeOptions extends Options {
}
export declare function encode(img: Buffer | Blob, options: EncodeOptions): Promise<Blob | Buffer>;
export declare function decode(img: Buffer | Blob, options: DecodeOptions): Promise<string>;
