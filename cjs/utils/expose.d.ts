import { AlgorithmVersion, DecodeOptions, EncodeOptions } from './stego-params';
export interface EncodedImageData {
    data: ImageData;
    height: number;
    width: number;
}
export declare type Encoder = (imgData: ImageData, maskData: ImageData, options: EncodeOptions) => Promise<EncodedImageData>;
export declare type Decoder = (imgData: ImageData, maskData: ImageData, options: DecodeOptions) => Promise<string>;
export interface Methods {
    toImageData(data: ArrayBuffer): Promise<ImageData>;
    toBuffer(imgData: ImageData, height?: number, width?: number): Promise<ArrayBuffer>;
    preprocessImage(data: ImageData): ImageData;
}
interface ProxyOptions {
    algoithms: Record<AlgorithmVersion, {
        encode: Encoder;
        decode: Decoder;
    }>;
    methods: Methods;
}
export declare function proxy({ algoithms, methods }: ProxyOptions): {
    encode(image: ArrayBuffer, mask: ArrayBuffer, options: EncodeOptions): Promise<ArrayBuffer>;
    decode(image: ArrayBuffer, mask: ArrayBuffer, options: DecodeOptions): Promise<string>;
};
export {};
//# sourceMappingURL=expose.d.ts.map