import { Options } from '../utils/stego-params.js';
import { Locator } from '../utils/locator.js';
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
    readonly indices: number[];
}
export declare function createAcc({ size, transformAlgorithm }: Options): {
    prevPos: number;
    prevCode: string;
    indices: number[];
};
export declare function getPosFromAcc(acc: Accumulator, { c }: Locator, { pass }: Options): number;
export declare function getPos(acc: Accumulator, loc: Locator, options: Options): number;
//# sourceMappingURL=position.d.ts.map