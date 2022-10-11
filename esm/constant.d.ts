import { TransformAlgorithm } from './utils/transform.js';
import { AlgorithmVersion } from './utils/stego-params.js';
export declare const CLI_NAME = "stego-js";
export declare const MAX_WIDTH = 1960;
export declare const DEFAULT_NARROW = 0;
export declare const DEFAULT_COPIES = 3;
export declare const DEFAULT_PARAM_COPIES = 9;
export declare const DEFAULT_SIZE = 8;
export declare const TOLERANCE_NOT_SET = -1;
export declare const DEFAULT_TOLERANCE: Readonly<Record<AlgorithmVersion, Record<TransformAlgorithm, number>>>;
export declare const MAX_TOLERANCE: Readonly<Record<TransformAlgorithm, number>>;
export declare const DEFAULT_FAKE_MASK_PIXELS = false;
export declare const DEFAULT_EXHAUST_PIXELS = true;
export declare const DEFAULT_CROP_EDGE_PIXELS = true;
export declare const DEFAULT_ALGORITHM_VERSION = AlgorithmVersion.V2;
export declare const DEFAULT_MASK: readonly number[];
export declare const SEED: readonly number[];
//# sourceMappingURL=constant.d.ts.map