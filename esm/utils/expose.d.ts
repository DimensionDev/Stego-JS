import { DecodeOptions, EncodeOptions, RandomSource } from './stego-params.js';
export interface EncodedImageData {
    readonly data: ImageData;
    readonly height: number;
    readonly width: number;
}
export type Encoder = (imgData: ImageData, maskData: Uint8ClampedArray, options: EncodeOptions, defaultRandomSource: RandomSource) => Promise<EncodedImageData>;
export type Decoder = (imgData: ImageData, maskData: Uint8ClampedArray, options: DecodeOptions) => Promise<string>;
export interface IO {
    toImageData(data: ArrayBufferLike | ArrayLike<number>): Promise<ImageData>;
    toPNG(imgData: ImageData, height?: number, width?: number): Promise<Uint8Array>;
    preprocessImage(data: ImageData): ImageData;
    defaultRandomSource(buffer: Uint8Array): Uint8Array;
}
export declare function createAPI(_: IO): {
    encode(image: ArrayBufferLike | ArrayLike<number>, mask: ArrayBufferLike | ArrayLike<number>, options: EncodeOptions): Promise<Uint8Array<ArrayBufferLike>>;
    decode(image: ArrayBufferLike | ArrayLike<number>, mask: ArrayBufferLike | ArrayLike<number>, options: DecodeOptions): Promise<string>;
};
//# sourceMappingURL=expose.d.ts.map