import { clamp } from './helper.js';
import { loc2idx, loc2coord } from './locator.js';
import { lanczos } from '@rgba-image/lanczos';
import { MAX_WIDTH } from '../constant.js';
import { transform } from '../utils/transform.js';
export function preprocessImage(imageData, getScaled) {
    if (imageData.width <= MAX_WIDTH && imageData.height <= MAX_WIDTH)
        return imageData;
    const scale = MAX_WIDTH / Math.max(imageData.width, imageData.height);
    const [w, h] = [imageData.width * scale, imageData.height * scale];
    const scaled = getScaled(w, h);
    if (scaled) {
        lanczos(imageData, scaled);
        return scaled;
    }
    else
        return imageData;
}
export function cropImg({ width, height }, { size }) {
    return [Math.floor(width / size) * size, Math.floor(height / size) * size];
}
export function* divideImg({ width, height, data }, { size, verbose }) {
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
export function visitImgByPixel(imgData, options, visitor) {
    const { width, height, data } = imgData;
    for (let i = 0; i < width * height; i += 1) {
        const p = i * 4;
        visitor([data[p], data[p + 1], data[p + 2], data[p + 3]], p, imgData);
    }
}
export function visitImgByBlock(imgData, options, visitor) {
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
export function updateImgByPixel(imgData, options, updater) {
    visitImgByPixel(imgData, options, (pixel, loc) => updateImgByPixelAt(imgData, options, updater(pixel, loc, imgData), loc));
}
export function updateImgByBlock(imgData, options, updater) {
    visitImgByBlock(imgData, options, (block, loc) => {
        const bitConsumed = updater(block, loc, imgData);
        if (bitConsumed) {
            updateImgByBlockAt(imgData, options, block, loc);
            if (options.verbose) {
                console.warn('inversed block: ' + block);
                const im = new Array(options.size * options.size);
                transform(block, im.fill(0), options.transformAlgorithm, options);
                console.warn(block[25], block[18]);
            }
        }
        return bitConsumed;
    });
}
export function updateImgByPixelChannelAt(imgData, loc, channel, value) {
    const { data } = imgData;
    data[loc + channel] = value;
}
export function updateImgByPixelAt(imgData, options, pixel, loc) {
    const { data } = imgData;
    [data[loc], data[loc + 1], data[loc + 2], data[loc + 3]] = pixel;
}
export function updateImgByBlockAt(imgData, options, block, loc) {
    const { data } = imgData;
    const { size } = options;
    const [x1, y1] = loc2coord(loc, options);
    for (let i = 0; i < size * size; i += 1) {
        block[i] = clamp(Math.round(block[i]), 0, 255);
        data[loc2idx(loc, options, x1, y1, i)] = block[i];
    }
}
//# sourceMappingURL=image.js.map