"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImgByBlockAt = exports.updateImgByPixelAt = exports.updateImgByPixelChannelAt = exports.updateImgByBlock = exports.updateImgByPixel = exports.visitImgByBlock = exports.visitImgByPixel = exports.divideImg = exports.cropImg = exports.preprocessImage = void 0;
const helper_1 = require("./helper");
const locator_1 = require("./locator");
const lanczos_1 = require("@rgba-image/lanczos");
const constant_1 = require("../constant");
const transform_1 = require("../utils/transform");
function preprocessImage(imageData, getScaled) {
    if (imageData.width <= constant_1.MAX_WIDTH && imageData.height <= constant_1.MAX_WIDTH)
        return imageData;
    const scale = constant_1.MAX_WIDTH / Math.max(imageData.width, imageData.height);
    const [w, h] = [imageData.width * scale, imageData.height * scale];
    const scaled = getScaled(w, h);
    if (scaled) {
        (0, lanczos_1.lanczos)(imageData, scaled);
        return scaled;
    }
    else
        return imageData;
}
exports.preprocessImage = preprocessImage;
function cropImg({ width, height }, { size }) {
    return [Math.floor(width / size) * size, Math.floor(height / size) * size];
}
exports.cropImg = cropImg;
function* divideImg({ width, height, data }, { size, verbose }) {
    for (let h = 0; h < height; h += size) {
        for (let w = 0; w < width; w += size) {
            if (h + size <= height && w + size <= width) {
                for (let c = 0; c < 3; c += 1) {
                    const block = [];
                    for (let h1 = 0; h1 < size; h1 += 1) {
                        for (let w1 = 0; w1 < size; w1 += 1) {
                            block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
                        }
                    }
                    if (verbose)
                        console.warn('height: ' + h + ' width: ' + w);
                    yield block;
                }
            }
        }
    }
}
exports.divideImg = divideImg;
function visitImgByPixel(imgData, options, visitor) {
    const { width, height, data } = imgData;
    for (let i = 0; i < width * height; i += 1) {
        const p = i * 4;
        visitor([data[p], data[p + 1], data[p + 2], data[p + 3]], p, imgData);
    }
}
exports.visitImgByPixel = visitImgByPixel;
function visitImgByBlock(imgData, options, visitor) {
    const { width: w, height: h } = imgData;
    let c = 0;
    let p = 0;
    let b = 0;
    for (const block of divideImg(imgData, options)) {
        const bitConsumed = visitor(block, { c, p, b, w, h }, imgData);
        c += 1;
        if (bitConsumed) {
            b += 1;
        }
        if (c === 3) {
            p += 1;
            c = 0;
        }
    }
}
exports.visitImgByBlock = visitImgByBlock;
function updateImgByPixel(imgData, options, updater) {
    visitImgByPixel(imgData, options, (pixel, loc) => updateImgByPixelAt(imgData, options, updater(pixel, loc, imgData), loc));
}
exports.updateImgByPixel = updateImgByPixel;
function updateImgByBlock(imgData, options, updater) {
    visitImgByBlock(imgData, options, (block, loc) => {
        const bitConsumed = updater(block, loc, imgData);
        if (bitConsumed) {
            updateImgByBlockAt(imgData, options, block, loc);
            if (options.verbose) {
                console.warn('inversed block: ' + block);
                const im = new Array(options.size * options.size);
                (0, transform_1.transform)(block, im.fill(0), options.transformAlgorithm, options);
                console.warn(block[25], block[18]);
            }
        }
        return bitConsumed;
    });
}
exports.updateImgByBlock = updateImgByBlock;
function updateImgByPixelChannelAt(imgData, loc, channel, value) {
    const { data } = imgData;
    data[loc + channel] = value;
}
exports.updateImgByPixelChannelAt = updateImgByPixelChannelAt;
function updateImgByPixelAt(imgData, options, pixel, loc) {
    const { data } = imgData;
    [data[loc], data[loc + 1], data[loc + 2], data[loc + 3]] = pixel;
}
exports.updateImgByPixelAt = updateImgByPixelAt;
function updateImgByBlockAt(imgData, options, block, loc) {
    const { data } = imgData;
    const { size } = options;
    const [x1, y1] = (0, locator_1.loc2coord)(loc, options);
    for (let i = 0; i < size * size; i += 1) {
        block[i] = (0, helper_1.clamp)(Math.round(block[i]), 0, 255);
        data[(0, locator_1.loc2idx)(loc, options, x1, y1, i)] = block[i];
    }
}
exports.updateImgByBlockAt = updateImgByBlockAt;
//# sourceMappingURL=image.js.map