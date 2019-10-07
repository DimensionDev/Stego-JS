import { Result } from 'meow';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import { EncodeOptions, DecodeOptions } from '.';
export interface Flags {
    help: boolean;
    version: boolean;
    encode: boolean;
    decode: boolean;
    message: string;
    size: number;
    copies: number;
    pass?: string;
    tolerance: number;
    grayscale: GrayscaleAlgorithm;
    transform: TransformAlgorithm;
}
export declare function normalize(flags: Result['flags']): Flags;
export declare function validate({ encode, message, size, copies, tolerance, grayscale, transform, }: Flags): "" | "-m, --message is required" | "-s, --size should be a postive radix-2 number" | "-c, --copies should be a postive odd number" | "-t, --tolerance should be a positive number between [0-128]" | "unknown grayscale algorithm" | "unknown transform algorithm";
export declare function flags2Options({ message, size, pass, copies, tolerance, grayscale, transform, }: Flags): EncodeOptions & DecodeOptions;
export declare function run(): Promise<void>;
export declare const version: string;
