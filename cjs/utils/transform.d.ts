import { Options } from './stego-params';
export declare enum TransformAlgorithm {
    FFT1D = "FFT1D",
    FFT2D = "FFT2D",
    DCT = "DCT",
    FastDCT = "fastDCT"
}
export declare function transform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options): void;
export declare function inverseTransform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options): void;
//# sourceMappingURL=transform.d.ts.map