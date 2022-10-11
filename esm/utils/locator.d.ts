import { Options } from './stego-params.js';
export interface Locator {
    /**
     * channel
     */
    readonly c: number;
    /**
     * block position
     */
    readonly p: number;
    /**
     * bit position
     */
    readonly b: number;
    /**
     * image width
     */
    readonly w: number;
    /**
     * image height
     */
    readonly h: number;
}
/**
 * Locator to coord of top left pixel inside block
 * @param locator
 * @param options
 */
export declare function loc2coord({ p, w }: Locator, { size }: Options): readonly [number, number];
/**
 * Locator to pixel index
 * @param locator
 * @param options
 * @param x1 x coord of top left pixel inside block
 * @param y1 y coord of top left pixel inside block
 * @param index the index of pixel inside block
 */
export declare function loc2idx({ w, c }: Locator, { size }: Options, x1: number, y1: number, index: number): number;
//# sourceMappingURL=locator.d.ts.map