import { EncodeOptions } from '../utils/stego-params.js';
export { decodeImg as decode } from './stego.js';
export declare function encode(imgData: ImageData, maskData: Uint8ClampedArray, options: EncodeOptions): Promise<{
    data: ImageData;
    width: number;
    height: number;
}>;
//# sourceMappingURL=index.d.ts.map