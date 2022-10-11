export declare function rand(min: number, max: number): number;
export declare function clamp(v: number, min: number, max: number): number;
export declare function hash(input: string): number;
export declare function hashCode(input: string, mod: number, inArray: number[]): readonly [number, string];
export declare function shuffleGroupBy3<T>(numbers: T[], seed: readonly number[], unshuffle?: boolean): void;
export declare function unshuffleGroupBy3<T>(numbers: T[], seed: readonly number[]): void;
export declare function shuffle<T>(numbers: T[], seed: readonly number[], unshuffle?: boolean): void;
export declare function filterIndices(size: number, predicator: (i: number) => boolean): number[];
export declare function squareCircleIntersect(size: number, radius: number): number[];
export declare function getImageType(buf: ArrayLike<number>): "image/jpeg" | "image/png" | undefined;
//# sourceMappingURL=helper.d.ts.map