"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
function rs2Buf(rs) {
    return new Promise(function (resolve, reject) {
        var bufs = [];
        rs.on('data', function (c) { return bufs.push(c); });
        rs.on('end', function () { return resolve(Buffer.concat(bufs)); });
        rs.on('error', function (err) { return reject(err); });
    });
}
exports.rs2Buf = rs2Buf;
function clamp(v, min, max) {
    if (v < min) {
        console.warn("clamp min: " + v);
        return min;
    }
    if (v > max) {
        console.warn("clamp max: " + v);
        return max;
    }
    return v;
}
exports.clamp = clamp;
function hash(input) {
    var code = 0;
    if (input.length === 0)
        return code;
    for (var i = 0; i < input.length; i += 1) {
        var char = input.charCodeAt(i);
        code = (code << 5) - code + char;
        code = code & code; // Convert to 32bit integer
    }
    return code;
}
exports.hash = hash;
function hashCode(input, mod, inArray) {
    var prob = 1;
    var code = hash(input);
    var index = Math.abs(code) % mod;
    while (inArray[index]) {
        index = (index + prob * prob) % mod;
        prob = prob > mod / 2 ? 1 : prob + 1;
    }
    inArray[index] = 1;
    return [index, String(code)];
}
exports.hashCode = hashCode;
function shuffle(nums, seed, unshuffle) {
    if (unshuffle === void 0) { unshuffle = false; }
    var swap = function (a, b) {
        var _a, _b;
        return (_a = [nums[b], nums[a]], _b = __read(_a, 2), nums[a] = _b[0], nums[b] = _b[1], _a);
    };
    for (var i = unshuffle ? nums.length - 1 : 0; (unshuffle && i >= 0) || (!unshuffle && i < nums.length); i += unshuffle ? -1 : 1) {
        swap(seed[i % seed.length] % nums.length, i);
    }
}
exports.shuffle = shuffle;
function unshuffle(nums, seed) {
    return shuffle(nums, seed, true);
}
exports.unshuffle = unshuffle;
function rgb2yuv(r, g, b) {
    return [
        (77 / 256) * r + (150 / 256) * g + (29 / 256) * b,
        -(44 / 256) * r - (87 / 256) * g + (131 / 256) * b + 128,
        (131 / 256) * r - (110 / 256) * g - (21 / 256) * b + 128,
    ];
}
exports.rgb2yuv = rgb2yuv;
function yuv2rgb(y, cb, cr) {
    return [
        y + 1.4075 * (cr - 128),
        y - 0.3455 * (cb - 128) - 0.7169 * (cr - 128),
        y + 1.779 * (cb - 128),
    ];
}
exports.yuv2rgb = yuv2rgb;
function filterIndices(size, predicator) {
    var indices = [];
    for (var i = 0; i < size * size; i += 1) {
        if (predicator(i)) {
            indices.push(i);
        }
    }
    return indices;
}
exports.filterIndices = filterIndices;
function squareTopLeftCircleExclude(size, radius) {
    return filterIndices(size, function (i) {
        var x = Math.floor(i / size);
        var y = i % size;
        return Math.sqrt(y * y + x * x) > radius;
    });
}
exports.squareTopLeftCircleExclude = squareTopLeftCircleExclude;
function squareBottomRightCircleExclude(size, radius) {
    return filterIndices(size, function (i) {
        var x = Math.floor(i / size);
        var y = i % size;
        return (Math.sqrt(Math.pow(size - y - 1, 2) + Math.pow(size - x - 1, 2)) > radius);
    });
}
exports.squareBottomRightCircleExclude = squareBottomRightCircleExclude;
function squareCircleIntersect(size, radius) {
    var mid = (size + 1) / 2 - 1;
    return filterIndices(size, function (i) {
        var x = Math.floor(i / size);
        var y = i % size;
        return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
    });
}
exports.squareCircleIntersect = squareCircleIntersect;
