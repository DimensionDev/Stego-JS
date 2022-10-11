import { DecodeOptions, EncodeOptions } from './stego-params.js';
export interface EncodedImageData {
    readonly data: ImageData;
    readonly height: number;
    readonly width: number;
}
export declare type Encoder = (imgData: ImageData, maskData: Uint8ClampedArray, options: EncodeOptions) => Promise<EncodedImageData>;
export declare type Decoder = (imgData: ImageData, maskData: Uint8ClampedArray, options: DecodeOptions) => Promise<string>;
export interface IO {
    toImageData(data: ArrayBufferLike | ArrayLike<number>): Promise<ImageData>;
    toPNG(imgData: ImageData, height?: number, width?: number): Promise<Uint8Array>;
    preprocessImage(data: ImageData): ImageData;
}
export declare function createAPI({ preprocessImage, toPNG: toBuffer, toImageData }: IO): {
    encode(image: ArrayBuffer, mask: ArrayBuffer, options: EncodeOptions): Promise<Uint8Array>;
    decode(image: ArrayBuffer, mask: ArrayBuffer, options: DecodeOptions): Promise<string>;
};
//# sourceMappingURL=expose.d.ts.map