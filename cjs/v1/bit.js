"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBit = exports.getBit = exports.createBits = exports.mergeBits = exports.bits2str = exports.str2bits = void 0;
const position_1 = require("./position");
function str2bits(text, copies) {
    const chars = Array.from(text);
    const bits = [];
    const pushByte = (byte, n) => {
        for (let i = 0; i < 8; i += 1) {
            let j = 0;
            while (j < n) {
                bits.push(byte[i]);
                j += 1;
            }
        }
    };
    for (let i = 0; i < chars.length; i += 1) {
        const codes = Array.from(encodeURI(chars[i]));
        for (let j = 0; j < codes.length; j += 1) {
            const byte = [];
            let reminder = 0;
            let code = codes[j].charCodeAt(0);
            do {
                reminder = (code % 2);
                byte.push(reminder);
                code = code - Math.floor(code / 2) - reminder;
            } while (code > 1);
            byte.push(code);
            while (byte.length < 8) {
                byte.push(0);
            }
            pushByte(byte.reverse(), copies);
        }
    }
    return bits;
}
exports.str2bits = str2bits;
function bits2str(bits, copies) {
    let k = 128;
    let temp = 0;
    const chars = [];
    const candidates = [];
    const elect = () => (candidates.filter((c) => c === 1).length >= copies / 2 ? 1 : 0);
    for (let i = 0; i < bits.length; i += 1) {
        candidates.push(bits[i]);
        if (candidates.length === copies) {
            temp += elect() * k;
            k /= 2;
            candidates.length = 0;
            // end of message
            if (temp === 255) {
                break;
            }
            if (k < 1) {
                chars.push(String.fromCharCode(temp));
                temp = 0;
                k = 128;
            }
        }
    }
    console.warn(chars.join(''));
    try {
        return decodeURI(chars.join(''));
    }
    catch (e) {
        return '';
    }
}
exports.bits2str = bits2str;
function mergeBits(dest, ...src) {
    let k = 0;
    for (let i = 0; i < src.length; i += 1) {
        const bits = src[i];
        for (let j = 0; j < bits.length && k < dest.length; j += 1, k += 1) {
            dest[k] = bits[j];
        }
    }
    return dest;
}
exports.mergeBits = mergeBits;
function createBits(size) {
    const bits = new Array(size).fill(0);
    for (let i = 0; i < size; i += 1) {
        bits[i] = Math.floor(Math.random() * 2);
    }
    return bits;
}
exports.createBits = createBits;
function getBit(block, acc, loc, options) {
    const pos = (0, position_1.getPos)(acc, loc, options);
    const { tolerance } = options;
    return Math.abs(Math.round(block[pos] / tolerance) % 2);
}
exports.getBit = getBit;
function setBit(block, bits, acc, loc, options) {
    const pos = (0, position_1.getPos)(acc, loc, options);
    const { tolerance } = options;
    const v = Math.floor(block[pos] / tolerance);
    if (bits[loc.b]) {
        block[pos] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance;
    }
    else {
        block[pos] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance;
    }
}
exports.setBit = setBit;
//# sourceMappingURL=bit.js.map