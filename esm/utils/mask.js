import { loc2idx, loc2coord } from './locator.js';
export function isBlockVisibleAt(data, loc, options) {
    const { size } = options;
    const _loc = {
        ...loc,
        c: 0, // mask is a gray image since only red red was read
    };
    const [x1, y1] = loc2coord(_loc, options);
    for (let i = 0; i < size * size; i += 1) {
        const value = data[loc2idx(_loc, options, x1, y1, i)];
        if (typeof value !== 'undefined' && value < 127) {
            return false;
        }
    }
    return true;
}
export function isPixelVisibleAt(data, loc) {
    return typeof data[loc] === 'undefined' || data[loc] > 127;
}
//# sourceMappingURL=mask.js.map