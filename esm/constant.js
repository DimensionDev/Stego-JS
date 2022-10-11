import { TransformAlgorithm } from './utils/transform.js';
import { AlgorithmVersion } from './utils/stego-params.js';
export const CLI_NAME = 'stego-js';
export const MAX_WIDTH = 1960;
export const DEFAULT_NARROW = 0;
export const DEFAULT_COPIES = 3;
export const DEFAULT_PARAM_COPIES = 9;
export const DEFAULT_SIZE = 8;
export const TOLERANCE_NOT_SET = -1;
export const DEFAULT_TOLERANCE = Object.freeze({
    [AlgorithmVersion.V1]: {
        [TransformAlgorithm.DCT]: 100,
        [TransformAlgorithm.FastDCT]: 500,
        [TransformAlgorithm.FFT1D]: 128,
        [TransformAlgorithm.FFT2D]: 500,
    },
    [AlgorithmVersion.V2]: {
        [TransformAlgorithm.DCT]: 10,
        [TransformAlgorithm.FastDCT]: 100,
        [TransformAlgorithm.FFT1D]: 30,
        [TransformAlgorithm.FFT2D]: 150,
    },
});
export const MAX_TOLERANCE = Object.freeze({
    [TransformAlgorithm.DCT]: 5000,
    [TransformAlgorithm.FastDCT]: 5000,
    [TransformAlgorithm.FFT1D]: 5000,
    [TransformAlgorithm.FFT2D]: 50000,
});
export const DEFAULT_FAKE_MASK_PIXELS = false;
export const DEFAULT_EXHAUST_PIXELS = true;
export const DEFAULT_CROP_EDGE_PIXELS = true;
export const DEFAULT_ALGORITHM_VERSION = AlgorithmVersion.V2;
export const DEFAULT_MASK = Object.freeze([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 1, 3, 0, 0, 0, 37, 219, 86, 202,
    0, 0, 0, 1, 115, 82, 71, 66, 1, 217, 201, 44, 127, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 11, 19, 0, 0, 11, 19, 1, 0,
    154, 156, 24, 0, 0, 0, 3, 80, 76, 84, 69, 255, 255, 255, 167, 196, 27, 200, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99,
    96, 0, 0, 0, 2, 0, 1, 72, 175, 164, 113, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
]);
export const SEED = Object.freeze([
    76221, 13388, 20800, 80672, 15974, 87005, 71203, 84444, 16928, 51335, 94092, 83586, 37656, 2240, 26283, 1887, 93419,
    96857, 20866, 21797, 42065, 39781, 50192, 24399, 98969, 54274, 38815, 45159, 36824,
]);
//# sourceMappingURL=constant.js.map