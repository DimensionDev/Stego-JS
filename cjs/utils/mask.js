"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPixelVisibleAt = exports.isBlockVisibleAt = void 0;
const locator_1 = require("./locator");
function isBlockVisibleAt({ data }, loc, options) {
    const { size } = options;
    const _loc = Object.assign(Object.assign({}, loc), { c: 0 });
    const [x1, y1] = (0, locator_1.loc2coord)(_loc, options);
    for (let i = 0; i < size * size; i += 1) {
        const value = data[(0, locator_1.loc2idx)(_loc, options, x1, y1, i)];
        if (typeof value !== 'undefined' && value < 127) {
            return false;
        }
    }
    return true;
}
exports.isBlockVisibleAt = isBlockVisibleAt;
function isPixelVisibleAt({ data }, loc, options) {
    return typeof data[loc] === 'undefined' || data[loc] > 127;
}
exports.isPixelVisibleAt = isPixelVisibleAt;
//# sourceMappingURL=mask.js.map