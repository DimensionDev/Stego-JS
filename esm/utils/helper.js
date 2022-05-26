export function rs2Buf(rs) {
    return new Promise((resolve, reject) => {
        const bufs = [];
        rs.on('data', (c) => bufs.push(c));
        rs.on('end', () => resolve(Buffer.concat(bufs)));
        rs.on('error', (err) => reject(err));
    });
}
export function rand(min, max) {
    return Math.round(Math.random() * max + min);
}
export function clamp(v, min, max) {
    if (v < min)
        return min;
    if (v > max)
        return max;
    return v;
}
export function hash(input) {
    let code = 0;
    if (input.length === 0)
        return code;
    for (let i = 0; i < input.length; i += 1) {
        const char = input.charCodeAt(i);
        code = (code << 5) - code + char;
        code = code & code; // Convert to 32bit integer
    }
    return code;
}
export function hashCode(input, mod, inArray) {
    let prob = 1;
    const code = hash(input);
    let index = Math.abs(code) % mod;
    while (inArray[index]) {
        index = (index + prob * prob) % mod;
        prob = prob > mod / 2 ? 1 : prob + 1;
    }
    inArray[index] = 1;
    return [index, String(code)];
}
export function shuffleGroupBy3(nums, seed, unshuffle = false) {
    const shuffleHelper = new Array(nums.length / 3).fill(0).map((v, i) => i);
    shuffle(shuffleHelper, seed, unshuffle);
    const shuffleRes = new Array(nums.length)
        .fill(0)
        .map((v, i) => nums[3 * shuffleHelper[Math.floor(i / 3)] + (i % 3)]);
    nums.forEach((v, i) => {
        nums[i] = shuffleRes[i];
    });
}
export function unshuffleGroupBy3(nums, seed) {
    return shuffleGroupBy3(nums, seed, true);
}
export function shuffle(nums, seed, unshuffle = false) {
    const swap = (a, b) => ([nums[a], nums[b]] = [nums[b], nums[a]]);
    for (let i = unshuffle ? nums.length - 1 : 0; (unshuffle && i >= 0) || (!unshuffle && i < nums.length); i += unshuffle ? -1 : 1) {
        swap(seed[i % seed.length] % nums.length, i);
    }
}
export function unshuffle(nums, seed) {
    return shuffle(nums, seed, true);
}
export function rgb2yuv(r, g, b) {
    return [
        (77 / 256) * r + (150 / 256) * g + (29 / 256) * b,
        -(44 / 256) * r - (87 / 256) * g + (131 / 256) * b + 128,
        (131 / 256) * r - (110 / 256) * g - (21 / 256) * b + 128,
    ];
}
export function yuv2rgb(y, cb, cr) {
    return [y + 1.4075 * (cr - 128), y - 0.3455 * (cb - 128) - 0.7169 * (cr - 128), y + 1.779 * (cb - 128)];
}
export function filterIndices(size, predicator) {
    const indices = [];
    for (let i = 0; i < size * size; i += 1) {
        if (predicator(i)) {
            indices.push(i);
        }
    }
    return indices;
}
export function squareTopLeftCircleExclude(size, radius) {
    return filterIndices(size, (i) => {
        const x = Math.floor(i / size);
        const y = i % size;
        return Math.sqrt(y * y + x * x) > radius;
    });
}
export function squareBottomRightCircleExclude(size, radius) {
    return filterIndices(size, (i) => {
        const x = Math.floor(i / size);
        const y = i % size;
        return Math.sqrt(Math.pow(size - y - 1, 2) + Math.pow(size - x - 1, 2)) > radius;
    });
}
export function squareCircleIntersect(size, radius) {
    const mid = (size + 1) / 2 - 1;
    return filterIndices(size, (i) => {
        const x = Math.floor(i / size);
        const y = i % size;
        return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
    });
}
export function isJPEG(buf) {
    if (!buf || buf.length < 3) {
        return false;
    }
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}
export function isPNG(buf) {
    if (!buf || buf.length < 8) {
        return false;
    }
    return (buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47 &&
        buf[4] === 0x0d &&
        buf[5] === 0x0a &&
        buf[6] === 0x1a &&
        buf[7] === 0x0a);
}
export function imgType(buf) {
    if (isJPEG(buf)) {
        return 'image/jpeg';
    }
    else if (isPNG(buf)) {
        return 'image/png';
    }
    return undefined;
}
//# sourceMappingURL=helper.js.map