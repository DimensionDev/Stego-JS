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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeImg = exports.encodeImg = void 0;
const grayscale_1 = require("../utils/grayscale");
const transform_1 = require("../utils/transform");
const image_1 = require("../utils/image");
const bit_1 = require("./bit");
const position_1 = require("./position");
const mask_1 = require("../utils/mask");
const helper_1 = require("../utils/helper");
const locator_1 = require("../utils/locator");
function encodeImg(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text, size, narrow: narrowSize, copies, grayscaleAlgorithm, transformAlgorithm, exhaustPixels } = options;
        const [width, height] = (0, image_1.cropImg)(imgData, options);
        const sizeOfBlocks = width * height * 3;
        const textBits = (0, bit_1.str2bits)(text, copies);
        const bits = (0, bit_1.mergeBits)((0, bit_1.createBits)(exhaustPixels ? sizeOfBlocks : textBits.length + 8 * copies), textBits, (0, bit_1.createBits)(8 * copies).fill(1));
        if (textBits.length + 8 * copies > sizeOfBlocks) {
            process.stderr.write('bits overflow! try to shrink text or reduce copies.\n');
        }
        if (grayscaleAlgorithm !== grayscale_1.GrayscaleAlgorithm.NONE || narrowSize > 0) {
            (0, image_1.updateImgByPixel)(imgData, options, ([r, g, b, a], loc) => {
                if (!(0, mask_1.isPixelVisibleAt)(maskData, loc, options)) {
                    return [r, g, b, a];
                }
                // decolor
                if (grayscaleAlgorithm !== grayscale_1.GrayscaleAlgorithm.NONE) {
                    const y = (0, grayscale_1.grayscale)(r, g, b, grayscaleAlgorithm);
                    r = y;
                    g = y;
                    b = y;
                }
                // narrow color value
                if (narrowSize > 0) {
                    r = (0, grayscale_1.narrow)(r, narrowSize);
                    g = (0, grayscale_1.narrow)(g, narrowSize);
                    b = (0, grayscale_1.narrow)(b, narrowSize);
                }
                return [r, g, b, a];
            });
        }
        const acc = (0, position_1.createAcc)(options);
        const im = new Array(size * size);
        (0, image_1.updateImgByBlock)(imgData, options, (block, loc) => {
            if (!exhaustPixels && loc.b >= bits.length) {
                return false;
            }
            if (!(0, mask_1.isBlockVisibleAt)(maskData, loc, options)) {
                if (options.fakeMaskPixels && loc.c === 0) {
                    const [x, y] = (0, locator_1.loc2coord)(loc, options);
                    const g = (0, helper_1.rand)(10, 127);
                    (0, image_1.updateImgByPixelAt)(imgData, options, [g, g, g, 255], (0, locator_1.loc2idx)(loc, options, x, y, (0, helper_1.rand)(0, 64)));
                }
                return false;
            }
            (0, transform_1.transform)(block, im.fill(0), transformAlgorithm, options);
            (0, bit_1.setBit)(block, bits, acc, loc, options);
            (0, transform_1.inverseTransform)(block, im, transformAlgorithm, options);
            return true;
        });
        return imgData;
    });
}
exports.encodeImg = encodeImg;
function decodeImg(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { size, copies, transformAlgorithm } = options;
        const bits = [];
        const acc = (0, position_1.createAcc)(options);
        const im = new Array(size * size);
        (0, image_1.visitImgByBlock)(imgData, options, (block, loc) => {
            if (!(0, mask_1.isBlockVisibleAt)(maskData, loc, options)) {
                return false;
            }
            (0, transform_1.transform)(block, im.fill(0), transformAlgorithm, options);
            bits.push((0, bit_1.getBit)(block, acc, loc, options));
            return true;
        });
        return (0, bit_1.bits2str)(bits, copies);
    });
}
exports.decodeImg = decodeImg;
//# sourceMappingURL=stego.js.map