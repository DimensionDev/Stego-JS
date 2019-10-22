import { Result } from 'meow';
import { EncodeOptions, DecodeOptions } from '.';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
export interface Flags {
    help: boolean;
    version: boolean;
    encode: boolean;
    decode: boolean;
    message: string;
    narrow: number;
    size: number;
    copies: number;
    pass?: string;
    tolerance: number;
    grayscale: GrayscaleAlgorithm;
    transform: TransformAlgorithm;
    noClipEdgePixels: boolean;
}
export declare function normalizeFlags(flags: Result['flags']): Flags;
export declare function validateFlags({ encode, message, size, copies, tolerance, grayscale, transform, }: Flags): "" | "-m, --message is required" | "-s, --size should be a postive radix-2 number" | "-c, --copies should be a postive odd number" | "-t, --tolerance should be a positive number between [0-128]" | "unknown grayscale algorithm" | "unknown transform algorithm";
export declare function flags2Options({ message, pass, narrow, size, copies, tolerance, grayscale, transform, noClipEdgePixels, }: Flags): EncodeOptions & DecodeOptions;
