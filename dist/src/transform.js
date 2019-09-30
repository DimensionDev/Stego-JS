"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var fft_1 = __importDefault(require("./fft"));
var DCT = __importStar(require("./dct"));
var TransformAlgorithm;
(function (TransformAlgorithm) {
    TransformAlgorithm["FFT1D"] = "FFT1D";
    TransformAlgorithm["FFT2D"] = "FFT2D";
    TransformAlgorithm["DCT"] = "DCT";
})(TransformAlgorithm = exports.TransformAlgorithm || (exports.TransformAlgorithm = {}));
function transform(re, im, algorithm, _a) {
    var size = _a.size;
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            fft_1["default"].init(size);
            fft_1["default"].fft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            fft_1["default"].init(size);
            fft_1["default"].fft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.dct(re, size);
            break;
        default:
            throw new Error("unknown algorithm: " + algorithm);
    }
}
exports.transform = transform;
function inverseTransform(re, im, algorithm, _a) {
    var size = _a.size;
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            fft_1["default"].init(size);
            fft_1["default"].ifft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            fft_1["default"].init(size);
            fft_1["default"].ifft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.idct(re, size);
            break;
        default:
            throw new Error("unknown algorithm: " + algorithm);
    }
}
exports.inverseTransform = inverseTransform;
