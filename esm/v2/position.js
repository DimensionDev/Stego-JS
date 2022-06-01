import { TransformAlgorithm } from '../utils/transform';
import { hashCode, squareCircleIntersect } from '../utils/helper';
export function createAcc({ size, transformAlgorithm }) {
    switch (transformAlgorithm) {
        case TransformAlgorithm.FFT1D:
            return {
                prevPos: -1,
                prevCode: '',
                indices: squareCircleIntersect(size, 3),
            };
        default:
            return {
                prevPos: -1,
                prevCode: '',
                indices: [],
            };
    }
}
export function getPosFromAcc(acc, { c }, { pass }) {
    const { prevCode, prevPos, indices } = acc;
    if (c !== 0) {
        return prevPos;
    }
    const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, []);
    acc.prevCode = code;
    acc.prevPos = indices[index];
    return indices[index];
}
export function getPos(options) {
    const { pass, size, transformAlgorithm } = options;
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
            throw new Error(`unknown algorithm in getPos: ${transformAlgorithm}`);
    }
}
//# sourceMappingURL=position.js.map