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
export function shuffleGroupBy3(numbers, seed, unshuffle = false) {
    const shuffleHelper = new Array(numbers.length / 3).fill(0).map((v, i) => i);
    shuffle(shuffleHelper, seed, unshuffle);
    const shuffleRes = new Array(numbers.length)
        .fill(0)
        .map((v, i) => numbers[3 * shuffleHelper[Math.floor(i / 3)] + (i % 3)]);
    numbers.forEach((v, i) => {
        numbers[i] = shuffleRes[i];
    });
}
export function unshuffleGroupBy3(numbers, seed) {
    return shuffleGroupBy3(numbers, seed, true);
}
export function shuffle(numbers, seed, unshuffle = false) {
    const swap = (a, b) => {
        ;
        [numbers[a], numbers[b]] = [numbers[b], numbers[a]];
    };
    for (let i = unshuffle ? numbers.length - 1 : 0; (unshuffle && i >= 0) || (!unshuffle && i < numbers.length); i += unshuffle ? -1 : 1) {
        swap(seed[i % seed.length] % numbers.length, i);
    }
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
export function squareCircleIntersect(size, radius) {
    const mid = (size + 1) / 2 - 1;
    return filterIndices(size, (i) => {
        const x = Math.floor(i / size);
        const y = i % size;
        return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
    });
}
function isJPEG(buf) {
    if (!buf || buf.length < 3) {
        return false;
    }
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}
function isPNG(buf) {
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
export function getImageType(buf) {
    if (isJPEG(buf)) {
        return 'image/jpeg';
    }
    else if (isPNG(buf)) {
        return 'image/png';
    }
    return undefined;
}
//# sourceMappingURL=helper.js.map