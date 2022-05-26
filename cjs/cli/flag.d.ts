import { EncodeOptions, AlgorithmVersion } from '../utils/stego-params';
import { GrayscaleAlgorithm } from '../utils/grayscale';
import { TransformAlgorithm } from '../utils/transform';
import { TypedFlags } from 'meow';
export interface Flags {
    algorithmVersion: AlgorithmVersion;
    help: boolean;
    version: boolean;
    encode: boolean;
    decode: boolean;
    message: string;
    mask: string;
    narrow: number;
    size: number;
    copies: number;
    pass?: string;
    tolerance: number;
    grayscale: GrayscaleAlgorithm;
    transform: TransformAlgorithm;
    exhaustPixels: boolean;
    cropEdgePixels: boolean;
    fakeMaskPixels: boolean;
    verbose: boolean;
}
export declare const flags: {
    readonly algorithmVersion: {
        readonly type: "string";
        readonly default: AlgorithmVersion.V2;
    };
    readonly help: {
        readonly type: "boolean";
        readonly default: false;
        readonly alias: "h";
    };
    readonly version: {
        readonly type: "boolean";
        readonly default: false;
        readonly alias: "v";
    };
    readonly encode: {
        readonly type: "boolean";
        readonly default: false;
        readonly alias: "e";
    };
    readonly decode: {
        readonly type: "boolean";
        readonly default: false;
        readonly alias: "d";
    };
    readonly message: {
        readonly type: "string";
        readonly default: "";
        readonly alias: "m";
    };
    readonly mask: {
        readonly type: "string";
        readonly default: "";
        readonly alias: "k";
    };
    readonly narrow: {
        readonly type: "number";
        readonly default: 0;
        readonly alias: "i";
    };
    readonly size: {
        readonly type: "number";
        readonly default: 8;
        readonly alias: "s";
    };
    readonly copies: {
        readonly type: "number";
        readonly default: 3;
        readonly alias: "c";
    };
    readonly pass: {
        readonly type: "string";
        readonly default: "";
        readonly alias: "p";
    };
    readonly tolerance: {
        readonly type: "number";
        readonly default: -1;
        readonly alias: "t";
    };
    readonly grayscale: {
        readonly type: "string";
        readonly default: GrayscaleAlgorithm.NONE;
        readonly alias: "g";
    };
    readonly transform: {
        readonly type: "string";
        readonly default: TransformAlgorithm.FFT1D;
        readonly alias: "f";
    };
    readonly exhaustPixels: {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly cropEdgePixels: {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly fakeMaskPixels: {
        readonly type: "boolean";
        readonly default: false;
    };
    readonly verbose: {
        readonly type: "boolean";
        readonly default: false;
    };
};
export declare function normalizeFlags(rawFlags: TypedFlags<typeof flags>): Flags;
export declare function validateFlags({ algorithmVersion, encode, message, size, copies, tolerance, grayscale, transform, }: Flags): string;
export declare function flags2Options({ algorithmVersion, message, pass, narrow, size, copies, tolerance, grayscale, transform, exhaustPixels, cropEdgePixels, fakeMaskPixels, verbose, }: Flags): EncodeOptions & import("../utils/stego-params").Options;
//# sourceMappingURL=flag.d.ts.map