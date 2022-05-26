/**
 * Locator to coord of top left pixel inside block
 * @param locator
 * @param options
 */
export function loc2coord({ p, w }, { size }) {
    return [(p % Math.floor(w / size)) * size, Math.floor(p / Math.floor(w / size)) * size];
}
/**
 * Locator to pixel index
 * @param locator
 * @param options
 * @param x1 x coord of top left pixel inside block
 * @param y1 y coord of top left pixel inside block
 * @param index the index of pixel inside block
 */
export function loc2idx({ w, c }, { size }, x1, y1, index) {
    const x2 = index % size;
    const y2 = Math.floor(index / size);
    return ((y1 + y2) * w + x1 + x2) * 4 + c;
}
//# sourceMappingURL=locator.js.map