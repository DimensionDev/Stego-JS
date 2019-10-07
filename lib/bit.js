"use strict";
exports.__esModule = true;
var position_1 = require("./position");
function str2bits(text, copies) {
    var chars = text.split('');
    var bits = [];
    var pushByte = function (byte, n) {
        for (var i = 0; i < 8; i += 1) {
            var j = 0;
            while (j++ < n) {
                bits.push(byte[i]);
            }
        }
    };
    for (var i = 0; i < chars.length; i += 1) {
        var codes = encodeURI(chars[i]).split('');
        for (var j = 0; j < codes.length; j += 1) {
            var byte = [];
            var reminder = 0;
            var code = codes[j].charCodeAt(0);
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
    var k = 128;
    var temp = 0;
    var chars = [];
    var candidates = [];
    var elect = function () {
        return candidates.filter(function (c) { return c === 1; }).length >= copies / 2 ? 1 : 0;
    };
    for (var i = 0; i < bits.length; i += 1) {
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
    return decodeURI(chars.join(''));
}
exports.bits2str = bits2str;
function mergeBits(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    var k = 0;
    for (var i = 0; i < src.length; i += 1) {
        var bits = src[i];
        for (var j = 0; j < bits.length && k < dest.length; j += 1, k += 1) {
            dest[k] = bits[j];
        }
    }
    return dest;
}
exports.mergeBits = mergeBits;
function createBits(size) {
    var bits = new Array(size).fill(0);
    for (var i = 0; i < size; i += 1) {
        bits[i] = Math.floor(Math.random() * 2);
    }
    return bits;
}
exports.createBits = createBits;
function getBit(block, acc, loc, options) {
    var pos = position_1.getPos(acc, loc, options);
    var tolerance = options.tolerance;
    return Math.abs(Math.round(block[pos] / tolerance) % 2);
}
exports.getBit = getBit;
function setBit(block, bits, acc, loc, options) {
    var pos = position_1.getPos(acc, loc, options);
    var b = loc.b;
    var tolerance = options.tolerance;
    var v = Math.floor(block[pos] / tolerance);
    if (bits[b]) {
        block[pos] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance;
    }
    else {
        block[pos] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance;
    }
}
exports.setBit = setBit;
