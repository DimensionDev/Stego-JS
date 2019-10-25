import { Options } from './index';
export declare enum TransformAlgorithm {
    FFT1D = "FFT1D",
    FFT2D = "FFT2D",
    DCT = "DCT"
}
export declare function transform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options): void;
export declare function inverseTransform(re: number[], im: number[], algorithm: TransformAlgorithm, { size }: Options): void;
