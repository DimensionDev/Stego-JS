import { Options } from '../utils/stego-params';
import { Locator } from '../utils/locator';
export interface Accumulator {
    /**
     * previous bit position
     */
    prevPos: number;
    /**
     * previous hash code
     */
    prevCode: string;
    /**
     * available indices
     */
    indices: number[];
}
export declare function createAcc({ size, transformAlgorithm }: Options): {
    prevPos: number;
    prevCode: string;
    indices: number[];
};
export declare function getPosFromAcc(acc: Accumulator, { c }: Locator, { pass }: Options): number;
export declare function getPos(options: Options): Array<number>;
