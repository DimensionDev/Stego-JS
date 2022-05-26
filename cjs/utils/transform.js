"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inverseTransform = exports.transform = exports.TransformAlgorithm = void 0;
const index_js_1 = __importDefault(require("../fft/index.js"));
const DCT = __importStar(require("../dct"));
const fastdct_1 = require("../dct/fastdct");
var TransformAlgorithm;
(function (TransformAlgorithm) {
    TransformAlgorithm["FFT1D"] = "FFT1D";
    TransformAlgorithm["FFT2D"] = "FFT2D";
    TransformAlgorithm["DCT"] = "DCT";
    TransformAlgorithm["FastDCT"] = "fastDCT";
})(TransformAlgorithm = exports.TransformAlgorithm || (exports.TransformAlgorithm = {}));
function transform(re, im, algorithm, { size }) {
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            index_js_1.default.init(size);
            index_js_1.default.fft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            index_js_1.default.init(size);
            index_js_1.default.fft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.dct(re, size);
            break;
        case TransformAlgorithm.FastDCT:
            fastdct_1.fastDctLee.transform(re);
            break;
        default:
            throw new Error(`unknown algorithm in transform: ${algorithm}`);
    }
}
exports.transform = transform;
function inverseTransform(re, im, algorithm, { size }) {
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            index_js_1.default.init(size);
            index_js_1.default.ifft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            index_js_1.default.init(size);
            index_js_1.default.ifft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.idct(re, size);
            break;
        case TransformAlgorithm.FastDCT:
            fastdct_1.fastDctLee.inverseTransform(re);
            break;
        default:
            throw new Error(`unknown algorithm in inverseTransform: ${algorithm}`);
    }
}
exports.inverseTransform = inverseTransform;
//# sourceMappingURL=transform.js.map