import { EncodeOptions, DecodeOptions, RandomSource } from '../utils/stego-params.js';
export declare function encodeImg(imgData: ImageData, maskData: Uint8ClampedArray, options: EncodeOptions, defaultRandomSource: RandomSource): Promise<ImageData>;
export declare function decodeImg(imgData: ImageData, maskData: Uint8ClampedArray, options: DecodeOptions): Promise<string>;
//# sourceMappingURL=stego.d.ts.map