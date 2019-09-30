"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var transform_1 = require("./transform");
var helper_1 = require("./helper");
function createAcc(_a) {
    var size = _a.size, transformAlgorithm = _a.transformAlgorithm;
    switch (transformAlgorithm) {
        case transform_1.TransformAlgorithm.FFT1D:
            return {
                prevPos: -1,
                prevCode: '',
                indices: helper_1.squareCircleIntersect(size, 3)
            };
        default:
            return {
                prevPos: -1,
                prevCode: '',
                indices: []
            };
    }
}
exports.createAcc = createAcc;
function getPosFromAcc(acc, _a, _b) {
    var c = _a.c;
    var pass = _b.pass;
    var prevCode = acc.prevCode, prevPos = acc.prevPos, indices = acc.indices;
    if (c !== 0) {
        return prevPos;
    }
    var _c = __read(helper_1.hashCode(pass + "_" + prevCode, indices.length, []), 2), index = _c[0], code = _c[1];
    acc.prevCode = code;
    acc.prevPos = indices[index];
    return indices[index];
}
exports.getPosFromAcc = getPosFromAcc;
function getPos(acc, loc, options) {
    var transformAlgorithm = options.transformAlgorithm;
    switch (transformAlgorithm) {
        case transform_1.TransformAlgorithm.FFT1D:
            return getPosFromAcc(acc, loc, options);
        case transform_1.TransformAlgorithm.FFT2D:
            return 0;
        case transform_1.TransformAlgorithm.DCT:
            return 0;
        default:
            throw new Error("unknown algortihm: " + transformAlgorithm);
    }
}
exports.getPos = getPos;
