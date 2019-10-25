import { Options } from './index';
import { Loc } from './bit';
export interface Accumulator {
    prevPos: number;
    prevCode: string;
    indices: number[];
}
export declare function createAcc({ size, transformAlgorithm }: Options): {
    prevPos: number;
    prevCode: string;
    indices: number[];
};
export declare function getPosFromAcc(acc: Accumulator, { c }: Loc, { pass }: Options): number;
export declare function getPos(acc: Accumulator, loc: Loc, options: Options): number;
