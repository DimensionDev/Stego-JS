import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import { Options } from '.';
export interface Flags {
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
export declare function normalize(flags: any): Flags;
export declare function validate({ encode, message, size, copies, grayscale, transform, }: Flags): "" | "-m, --message is required" | "-s, --size should be a postive radix-2 number" | "-c, --copies should be a postive odd number" | "unknown grayscale algorithm" | "unknown transform algorithm";
export declare function flags2Options({ message, size, pass, copies, tolerance, grayscale, transform, }: Flags): Options;
export declare function run(): Promise<void>;
