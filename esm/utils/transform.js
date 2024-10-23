import * as FFT from '../fft/index.js';
import * as DCT from '../dct/index.js';
import * as fastDctLee from '../dct/fastdct.js';
export var TransformAlgorithm;
(function (TransformAlgorithm) {
    TransformAlgorithm["FFT1D"] = "FFT1D";
    TransformAlgorithm["FFT2D"] = "FFT2D";
    TransformAlgorithm["DCT"] = "DCT";
    TransformAlgorithm["FastDCT"] = "fastDCT";
})(TransformAlgorithm || (TransformAlgorithm = {}));
export function transform(re, im, algorithm, { size }) {
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            FFT.init(size);
            FFT.fft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            FFT.init(size);
            FFT.fft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.dct(re, size);
            break;
        case TransformAlgorithm.FastDCT:
            fastDctLee.transform(re);
            break;
        default:
            throw new Error(`unknown algorithm in transform: ${algorithm}`);
    }
}
export function inverseTransform(re, im, algorithm, { size }) {
    switch (algorithm) {
        case TransformAlgorithm.FFT1D:
            FFT.init(size);
            FFT.ifft1d(re, im);
            break;
        case TransformAlgorithm.FFT2D:
            FFT.init(size);
            FFT.ifft2d(re, im);
            break;
        case TransformAlgorithm.DCT:
            DCT.idct(re, size);
            break;
        case TransformAlgorithm.FastDCT:
            fastDctLee.inverseTransform(re);
            break;
        default:
            throw new Error(`unknown algorithm in inverseTransform: ${algorithm}`);
    }
}
//# sourceMappingURL=transform.js.map