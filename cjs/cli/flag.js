"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flags2Options = exports.validateFlags = exports.normalizeFlags = exports.flags = void 0;
const path_1 = require("path");
const stego_params_1 = require("../utils/stego-params");
const grayscale_1 = require("../utils/grayscale");
const transform_1 = require("../utils/transform");
const constant_1 = require("../constant");
exports.flags = {
    algorithmVersion: {
        type: 'string',
        default: constant_1.DEFAULT_ALGORITHM_VERSION,
    },
    help: {
        type: 'boolean',
        default: false,
        alias: 'h',
    },
    version: {
        type: 'boolean',
        default: false,
        alias: 'v',
    },
    encode: {
        type: 'boolean',
        default: false,
        alias: 'e',
    },
    decode: {
        type: 'boolean',
        default: false,
        alias: 'd',
    },
    message: {
        type: 'string',
        default: '',
        alias: 'm',
    },
    mask: {
        type: 'string',
        default: '',
        alias: 'k',
    },
    narrow: {
        type: 'number',
        default: constant_1.DEFAULT_NARROW,
        alias: 'i',
    },
    size: {
        type: 'number',
        default: constant_1.DEFAULT_SIZE,
        alias: 's',
    },
    copies: {
        type: 'number',
        default: constant_1.DEFAULT_COPIES,
        alias: 'c',
    },
    pass: {
        type: 'string',
        default: '',
        alias: 'p',
    },
    tolerance: {
        type: 'number',
        default: constant_1.TOLERANCE_NOT_SET,
        alias: 't',
    },
    grayscale: {
        type: 'string',
        default: grayscale_1.GrayscaleAlgorithm.NONE,
        alias: 'g',
    },
    transform: {
        type: 'string',
        default: transform_1.TransformAlgorithm.FFT1D,
        alias: 'f',
    },
    exhaustPixels: {
        type: 'boolean',
        default: constant_1.DEFAULT_EXHAUST_PIXELS,
    },
    cropEdgePixels: {
        type: 'boolean',
        default: constant_1.DEFAULT_CROP_EDGE_PIXELS,
    },
    fakeMaskPixels: {
        type: 'boolean',
        default: constant_1.DEFAULT_FAKE_MASK_PIXELS,
    },
    verbose: {
        type: 'boolean',
        default: false,
    },
};
function normalizeFlags(rawFlags) {
    const { encode, decode, mask, tolerance } = rawFlags;
    return Object.assign(Object.assign({}, rawFlags), { tolerance: tolerance === constant_1.TOLERANCE_NOT_SET ? constant_1.DEFAULT_TOLERANCE[rawFlags.algorithmVersion].transform : tolerance, encode: encode && !decode, decode, mask: mask ? (0, path_1.resolve)(process.cwd(), mask) : '' });
}
exports.normalizeFlags = normalizeFlags;
function validateFlags({ algorithmVersion, encode, message, size, copies, tolerance, grayscale, transform, }) {
    const radix = Math.log(size) / Math.log(2);
    if (!Object.values(stego_params_1.AlgorithmVersion).includes(algorithmVersion)) {
        return 'unsupported algorithm version: ' + algorithmVersion;
    }
    if (!message && encode) {
        return '-m, --message is required';
    }
    if (isNaN(size) || size <= 0 || radix !== Math.floor(radix) || radix > 15) {
        return '-s, --size should be a postive radix-2 number';
    }
    if (isNaN(copies) || copies <= 0 || copies % 2 === 0 || copies > 31) {
        return '-c, --copies should be a postive odd number and less than 31';
    }
    // the valiadation for transform algorithm should prior to tolerance,
    // becasue tolerance validation depends on transform algorithm
    if (!Object.values(transform_1.TransformAlgorithm).includes(transform)) {
        return 'unknown transform algorithm';
    }
    if (isNaN(tolerance) || tolerance <= 0 || tolerance > constant_1.MAX_TOLERANCE[transform]) {
        // Is it okay?
        return `-t, --tolerance should be a positive number between [0-${constant_1.MAX_TOLERANCE[transform]}] for algorithm ${transform}`;
    }
    if (!Object.values(grayscale_1.GrayscaleAlgorithm).includes(grayscale)) {
        return 'unknown grayscale algorithm';
    }
    return '';
}
exports.validateFlags = validateFlags;
function flags2Options({ algorithmVersion, message = '', pass = '', narrow, size, copies, tolerance, grayscale, transform, exhaustPixels, cropEdgePixels, fakeMaskPixels, verbose, }) {
    return {
        version: algorithmVersion,
        text: message,
        mask: [],
        pass,
        narrow,
        size,
        copies,
        tolerance,
        grayscaleAlgorithm: grayscale,
        transformAlgorithm: transform,
        exhaustPixels,
        cropEdgePixels,
        fakeMaskPixels,
        verbose,
    };
}
exports.flags2Options = flags2Options;
//# sourceMappingURL=flag.js.map