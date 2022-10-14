import { TransformAlgorithm } from '../utils/transform.js';
export function getPos(options) {
    const { size, transformAlgorithm } = options;
    switch (transformAlgorithm) {
        case TransformAlgorithm.FFT1D:
            return [3 * size + 1, 2 * size + 2];
        case TransformAlgorithm.FFT2D:
            return [3 * size + 1, 2 * size + 2];
        case TransformAlgorithm.DCT:
            return [3 * size + 1, 2 * size + 2];
        case TransformAlgorithm.FastDCT:
            return [3 * size + 1, 2 * size + 2];
        default:
            const _ = transformAlgorithm;
            throw new Error(`unknown algorithm in getPos: ${transformAlgorithm}`);
    }
}
//# sourceMappingURL=position.js.map