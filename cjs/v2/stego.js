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
const constant_1 = require("../constant");
function getCharfromIdx(idx, copies, text) {
    const charId = Math.floor(idx / (8 * copies));
    const bitId = idx % (8 * copies);
    const codes = Array.from(encodeURI(text));
    if (charId > codes.length)
        return 'OUT_OF_BOUND' + '(charId: ' + charId + ')';
    else
        return codes[charId] + '(charId: ' + charId + ', bitId: ' + bitId + ')';
}
function encodeImg(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text, size, narrow: narrowSize, copies, grayscaleAlgorithm, transformAlgorithm, exhaustPixels } = options;
        const [width, height] = (0, image_1.cropImg)(imgData, options);
        const sizeOfBlocks = (width * height * 3) / (size * size);
        const textBits = (0, bit_1.str2bits)(text, copies);
        const paramsBits = (0, bit_1.param2bits)(options);
        const bits = (0, bit_1.mergeBits)((0, bit_1.createBits)(sizeOfBlocks), paramsBits, textBits, (0, bit_1.createBits)(8 * copies).fill(1));
        const encodeLen = textBits.length + 8 * copies;
        if (encodeLen > sizeOfBlocks) {
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
        const im = new Array(size * size);
        let blockId = -1;
        const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v, i) => i);
        (0, helper_1.shuffleGroupBy3)(shuffleArr, constant_1.SEED); // shuffle by binding 3 blocks together (RGB)
        const encodedId = shuffleArr.map((v, i) => {
            if (i < encodeLen)
                return v;
        });
        (0, image_1.updateImgByBlock)(imgData, options, (block, loc) => {
            // Remove transparency for PNG. Even though we do not encode alpha channel,
            // the social media compression on transparant image can casue the information loss.
            if (loc.c === 0) {
                const [x, y] = (0, locator_1.loc2coord)(loc, options);
                for (let i = 0; i < size * size; i += 1) {
                    const idx = (0, locator_1.loc2idx)(loc, options, x, y, i);
                    (0, image_1.updateImgByPixelChannelAt)(imgData, idx, 3, 255);
                }
            }
            blockId += 1;
            if (!exhaustPixels && !(blockId in encodedId)) {
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
            if (options.verbose) {
                console.warn('Encode on image block (blockId: ' + blockId + '): ' + block);
            }
            (0, transform_1.transform)(block, im.fill(0), transformAlgorithm, options);
            const tolerance = () => {
                const x = ((blockId * size) / 3) % loc.w;
                const y = Math.floor((blockId * size) / 3 / loc.w) * size;
                let t = options.tolerance;
                if (x <= 8 || x > loc.w - 2 * size || y <= size || y > loc.h - 2 * size)
                    t = 1.5 * t;
                if (options.verbose) {
                    console.warn('Encode with tolerance: ' + t + ' (Image size is width: ' + loc.w + ' height:' + loc.h + ')');
                }
                return t;
            };
            const t = tolerance();
            let diff1 = 0;
            let maxRetry = 5;
            while (true) {
                (0, bit_1.setBit)(block, bits[shuffleArr[loc.b]], options, t);
                const [pos1, pos2] = (0, position_1.getPos)(options);
                diff1 = diff1 === 0 ? block[pos1] - block[pos2] : diff1;
                if (options.verbose) {
                    const bitOrigin = shuffleArr[loc.b] < paramsBits.length
                        ? 'PARAM_BITS'
                        : getCharfromIdx(shuffleArr[loc.b] - paramsBits.length, copies, text);
                    console.warn('Encode bit: ' + bits[shuffleArr[loc.b]] + ' From char: ' + bitOrigin);
                    console.warn(block);
                }
                (0, transform_1.inverseTransform)(block, im, transformAlgorithm, options);
                const imgBlock = block.map((v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v)));
                (0, transform_1.transform)(imgBlock, im.fill(0), transformAlgorithm, options);
                const newDiff = imgBlock[pos1] - imgBlock[pos2];
                if (options.verbose)
                    console.warn('After encode, the params diff is: ' +
                        newDiff +
                        ' (' +
                        imgBlock[pos1] +
                        '-' +
                        imgBlock[pos2] +
                        ') diff1: ' +
                        diff1);
                if (Math.abs(newDiff) < Math.abs(diff1 * 0.8)) {
                    if (options.verbose)
                        console.warn('Repeat set bit with tolerance: ' + t + ' (max repeat times: ' + maxRetry + ')');
                    if ((maxRetry -= 1) === 0) {
                        break;
                    }
                    // block = imgBlock;
                    for (let i = 0; i < size * size; i += 1)
                        block[i] = imgBlock[i];
                    continue;
                }
                break;
            }
            return true;
        });
        return imgData;
    });
}
exports.encodeImg = encodeImg;
function decodeImg(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { size, transformAlgorithm } = options;
        const richBits = [];
        const acc = (0, position_1.createAcc)(options);
        const im = new Array(size * size);
        const [width, height] = (0, image_1.cropImg)(imgData, options);
        const sizeOfBlocks = (width * height * 3) / (size * size);
        const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v, i) => i);
        (0, helper_1.shuffleGroupBy3)(shuffleArr, constant_1.SEED);
        let blockId = 0;
        (0, image_1.visitImgByBlock)(imgData, options, (block, loc) => {
            if (!(0, mask_1.isBlockVisibleAt)(maskData, loc, options)) {
                return false;
            }
            (0, transform_1.transform)(block, im.fill(0), transformAlgorithm, options);
            if (options.verbose && blockId >= 4 * constant_1.DEFAULT_PARAM_COPIES) {
                const i = blockId - 4 * constant_1.DEFAULT_PARAM_COPIES;
                console.warn('charId: ' +
                    Math.floor(shuffleArr[i] / (8 * options.copies)) +
                    ', bitId: ' +
                    (shuffleArr[i] % (8 * options.copies)));
                console.warn('bit: ' + (0, bit_1.getBit)(block, acc, options).bit, block);
            }
            // let { bit, diff } = getBit(block, acc, options);
            richBits.push((0, bit_1.getBit)(block, acc, options));
            blockId += 1;
            return true;
        });
        (0, helper_1.unshuffleGroupBy3)(richBits, constant_1.SEED);
        const copiesBits = richBits.slice(0, 4 * constant_1.DEFAULT_PARAM_COPIES).map((v) => v.bit);
        const copies = (0, bit_1.bits2param)(copiesBits);
        if (options.verbose) {
            console.warn('copies is ' + copies);
        }
        // return bits2str(bits, 3, options.verbose);
        return (0, bit_1.bits2str)(richBits.slice(4 * constant_1.DEFAULT_PARAM_COPIES), copies, options.verbose);
    });
}
exports.decodeImg = decodeImg;
//# sourceMappingURL=stego.js.map