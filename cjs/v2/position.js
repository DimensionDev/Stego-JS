"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPos = exports.getPosFromAcc = exports.createAcc = void 0;
const transform_1 = require("../utils/transform");
const helper_1 = require("../utils/helper");
function createAcc({ size, transformAlgorithm }) {
    switch (transformAlgorithm) {
        case transform_1.TransformAlgorithm.FFT1D:
            return {
                prevPos: -1,
                prevCode: '',
                indices: (0, helper_1.squareCircleIntersect)(size, 3),
            };
        default:
            return {
                prevPos: -1,
                prevCode: '',
                indices: [],
            };
    }
}
exports.createAcc = createAcc;
function getPosFromAcc(acc, { c }, { pass }) {
    const { prevCode, prevPos, indices } = acc;
    if (c !== 0) {
        return prevPos;
    }
    const [index, code] = (0, helper_1.hashCode)(`${pass}_${prevCode}`, indices.length, []);
    acc.prevCode = code;
    acc.prevPos = indices[index];
    return indices[index];
}
exports.getPosFromAcc = getPosFromAcc;
function getPos(options) {
    const { pass, size, transformAlgorithm } = options;
    switch (transformAlgorithm) {
        case transform_1.TransformAlgorithm.FFT1D:
            return [3 * size + 1, 2 * size + 2];
        case transform_1.TransformAlgorithm.FFT2D:
            return [3 * size + 1, 2 * size + 2];
        case transform_1.TransformAlgorithm.DCT:
            return [3 * size + 1, 2 * size + 2];
        case transform_1.TransformAlgorithm.FastDCT:
            return [3 * size + 1, 2 * size + 2];
        default:
            throw new Error(`unknown algorithm in getPos: ${transformAlgorithm}`);
    }
}
exports.getPos = getPos;
//# sourceMappingURL=position.js.map