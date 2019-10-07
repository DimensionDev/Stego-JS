"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var grayscale_1 = require("./grayscale");
var transform_1 = require("./transform");
function normalizeFlags(flags) {
    var encode = flags.encode, decode = flags.decode, size = flags.size, clip = flags.clip, copies = flags.copies, tolerance = flags.tolerance;
    return __assign(__assign({}, flags), { clip: parseInt(clip, 10), size: parseInt(size, 10), copies: parseInt(copies, 10), tolerance: parseInt(tolerance, 10), encode: encode && !decode, decode: decode });
}
exports.normalizeFlags = normalizeFlags;
function validateFlags(_a) {
    var encode = _a.encode, message = _a.message, size = _a.size, copies = _a.copies, tolerance = _a.tolerance, grayscale = _a.grayscale, transform = _a.transform;
    var radix = Math.log(size) / Math.log(2);
    if (!message && encode) {
        return '-m, --message is required';
    }
    if (isNaN(size) || size <= 0 || radix !== Math.floor(radix)) {
        return '-s, --size should be a postive radix-2 number';
    }
    if (isNaN(copies) || copies <= 0 || copies % 2 === 0) {
        return '-c, --copies should be a postive odd number';
    }
    if (isNaN(tolerance) || tolerance <= 0 || tolerance > 128) {
        return '-t, --tolerance should be a positive number between [0-128]';
    }
    if (!Object.keys(grayscale_1.GrayscaleAlgorithm).includes(grayscale)) {
        return 'unknown grayscale algorithm';
    }
    if (!Object.keys(transform_1.TransformAlgorithm).includes(transform)) {
        return 'unknown transform algorithm';
    }
    return '';
}
exports.validateFlags = validateFlags;
function flags2Options(_a) {
    var _b = _a.message, message = _b === void 0 ? '' : _b, _c = _a.pass, pass = _c === void 0 ? '' : _c, clip = _a.clip, size = _a.size, copies = _a.copies, tolerance = _a.tolerance, grayscale = _a.grayscale, transform = _a.transform;
    return {
        text: message,
        pass: pass,
        clip: clip,
        size: size,
        copies: copies,
        tolerance: tolerance,
        grayscaleAlgorithm: grayscale,
        transformAlgorithm: transform
    };
}
exports.flags2Options = flags2Options;
