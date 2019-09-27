"use strict";
exports.__esModule = true;
var transform_1 = require("./transform");
function getPositionInBlock(loc, _a) {
    var size = _a.size, transformAlgorithm = _a.transformAlgorithm;
    switch (transformAlgorithm) {
        case transform_1.TransformAlgorithm.FFT1D:
            return size * size / 2 + size / 2;
        case transform_1.TransformAlgorithm.FFT2D:
            return 0;
    }
}
exports.getPositionInBlock = getPositionInBlock;
