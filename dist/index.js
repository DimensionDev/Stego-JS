"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var grayscale_1 = require("./grayscale");
var transform_1 = require("./transform");
var helper_1 = require("./helper");
var image_1 = require("./image");
var bit_1 = require("./bit");
function encode(imgBuf, options) {
    return __awaiter(this, void 0, void 0, function () {
        var text, size, clip, copies, grayscaleAlgorithm, transformAlgorithm, imageData, width, height, sizeOfBlocks, textBits, bits;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = options.text, size = options.size, clip = options.clip, copies = options.copies, grayscaleAlgorithm = options.grayscaleAlgorithm, transformAlgorithm = options.transformAlgorithm;
                    return [4 /*yield*/, helper_1.buf2Img(imgBuf)];
                case 1:
                    imageData = _a.sent();
                    width = imageData.width, height = imageData.height;
                    sizeOfBlocks = Math.floor(width / size) * Math.floor(height / size);
                    textBits = bit_1.str2bits(text, copies);
                    bits = bit_1.mergeBits(bit_1.createBits(sizeOfBlocks), textBits, bit_1.createBits(8 * copies).fill(1) // end of message
                    );
                    if (textBits.length + 8 * copies > sizeOfBlocks) {
                        process.stderr.write('bits overflow! try to shrink text or reduce copies.\n');
                    }
                    if (grayscaleAlgorithm !== grayscale_1.GrayscaleAlgorithm.NONE) {
                        image_1.decolorImg(imageData, grayscaleAlgorithm);
                    }
                    if (clip > 0) {
                        image_1.clipImg(imageData, clip);
                    }
                    image_1.walkImg(imageData, size, function (block, loc) {
                        var re = block;
                        var im = new Array(size * size).fill(0);
                        transform_1.transform(re, im, transformAlgorithm, options);
                        bit_1.setBit(re, bits, loc, options);
                        transform_1.inverseTransform(re, im, transformAlgorithm, options);
                        image_1.updateImg(imageData, re, loc, options);
                    });
                    return [2 /*return*/, helper_1.img2Buf(imageData)];
            }
        });
    });
}
exports.encode = encode;
function decode(imgBuf, options) {
    return __awaiter(this, void 0, void 0, function () {
        var size, copies, transformAlgorithm, imageData, bits;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    size = options.size, copies = options.copies, transformAlgorithm = options.transformAlgorithm;
                    return [4 /*yield*/, helper_1.buf2Img(imgBuf)];
                case 1:
                    imageData = _a.sent();
                    bits = [];
                    image_1.walkImg(imageData, size, function (block, loc) {
                        var re = block;
                        var im = new Array(size * size).fill(0);
                        transform_1.transform(re, im, transformAlgorithm, options);
                        bits.push(bit_1.getBit(re, loc, options));
                    });
                    return [2 /*return*/, bit_1.bits2str(bits, copies)];
            }
        });
    });
}
exports.decode = decode;
