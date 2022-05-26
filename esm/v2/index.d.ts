import { EncodeOptions } from '../utils/stego-params';
export { decodeImg as decode } from './stego';
export declare function encode(imgData: ImageData, maskData: ImageData, options: EncodeOptions): Promise<{
    data: ImageData;
    width: number;
    height: number;
}>;
//# sourceMappingURL=index.d.ts.map