import { GrayscaleAlgorithm } from './grayscale.js';
import { TransformAlgorithm } from './transform.js';
export declare enum AlgorithmVersion {
    V1 = "V1",
    V2 = "V2"
}
export interface Options {
    readonly version: AlgorithmVersion;
    readonly pass?: string;
    readonly size: number;
    readonly copies: number;
    readonly tolerance: number;
    readonly transformAlgorithm: TransformAlgorithm;
    readonly verbose?: boolean;
}
export interface EncodeOptions extends Options {
    readonly text: string;
    readonly narrow: number;
    readonly grayscaleAlgorithm: GrayscaleAlgorithm;
    readonly exhaustPixels: boolean;
    readonly cropEdgePixels: boolean;
    readonly fakeMaskPixels: boolean;
}
export declare type DecodeOptions = Options;
//# sourceMappingURL=stego-params.d.ts.map