import { clamp } from './helper.js';
// more grayscale algorithm:
// http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
export var GrayscaleAlgorithm;
(function (GrayscaleAlgorithm) {
    GrayscaleAlgorithm["NONE"] = "NONE";
    GrayscaleAlgorithm["AVERAGE"] = "AVG";
    GrayscaleAlgorithm["LUMINANCE"] = "LUMA";
    GrayscaleAlgorithm["LUMINANCE_II"] = "LUMA_II";
    GrayscaleAlgorithm["DESATURATION"] = "DESATURATION";
    GrayscaleAlgorithm["MAX_DECOMPOSITION"] = "MAX_DE";
    GrayscaleAlgorithm["MIN_DECOMPOSITION"] = "MIN_DE";
    GrayscaleAlgorithm["MID_DECOMPOSITION"] = "MID_DE";
    GrayscaleAlgorithm["SIGNLE_R"] = "R";
    GrayscaleAlgorithm["SIGNLE_G"] = "G";
    GrayscaleAlgorithm["SIGNLE_B"] = "B";
})(GrayscaleAlgorithm || (GrayscaleAlgorithm = {}));
export function grayscale(r, g, b, algorithm) {
    switch (algorithm) {
        case GrayscaleAlgorithm.AVERAGE:
            return (r + g + b) / 3;
        case GrayscaleAlgorithm.LUMINANCE:
            return r * 0.3 + g * 0.59 + b * 0.11;
        case GrayscaleAlgorithm.LUMINANCE_II:
            return r * 0.2126 + g * 0.7152 + b * 0.0722;
        case GrayscaleAlgorithm.DESATURATION:
            return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
        case GrayscaleAlgorithm.MAX_DECOMPOSITION:
            return Math.max(r, g, b);
        case GrayscaleAlgorithm.MIN_DECOMPOSITION:
            return Math.min(r, g, b);
        case GrayscaleAlgorithm.MID_DECOMPOSITION:
            return [r, g, b].sort()[1];
        case GrayscaleAlgorithm.SIGNLE_R:
            return r;
        case GrayscaleAlgorithm.SIGNLE_G:
            return g;
        case GrayscaleAlgorithm.SIGNLE_B:
            return b;
        default:
            return 0;
    }
}
export function shades(r, g, b, size) {
    const factor = 255 / (clamp(size, 2, 256) - 1);
    return Math.floor((r + g + b) / 3 / factor + 0.5) * factor;
}
export function narrow(gray, size) {
    return clamp(Math.round(gray), size, 255 - size);
}
//# sourceMappingURL=grayscale.js.map