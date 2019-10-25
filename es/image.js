"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var helper_1 = require("./helper");
var grayscale_1 = require("./grayscale");
function updateImg(imgData, block, _a, _b) {
    var p = _a.p, c = _a.c;
    var size = _b.size;
    var width = imgData.width;
    var h1 = Math.floor(p / Math.floor(width / size)) * size;
    var w1 = (p % Math.floor(width / size)) * size;
    for (var i = 0; i < block.length; i += 1) {
        var h2 = Math.floor(i / size);
        var w2 = i % size;
        imgData.data[((h1 + h2) * width + w1 + w2) * 4 + c] = helper_1.clamp(Math.round(block[i]), 0, 255);
    }
}
exports.updateImg = updateImg;
function divideImg(imgData, _a) {
    var width, height, data, h, w, c, block, h1, w1;
    var size = _a.size;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                width = imgData.width, height = imgData.height, data = imgData.data;
                h = 0;
                _b.label = 1;
            case 1:
                if (!(h < height)) return [3 /*break*/, 8];
                w = 0;
                _b.label = 2;
            case 2:
                if (!(w < width)) return [3 /*break*/, 7];
                if (!(h + size <= height && w + size <= width)) return [3 /*break*/, 6];
                c = 0;
                _b.label = 3;
            case 3:
                if (!(c < 3)) return [3 /*break*/, 6];
                block = [];
                for (h1 = 0; h1 < size; h1 += 1) {
                    for (w1 = 0; w1 < size; w1 += 1) {
                        block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
                    }
                }
                return [4 /*yield*/, block];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                c += 1;
                return [3 /*break*/, 3];
            case 6:
                w += size;
                return [3 /*break*/, 2];
            case 7:
                h += size;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}
exports.divideImg = divideImg;
function decolorImg(imgData, _a) {
    var grayscaleAlgorithm = _a.grayscaleAlgorithm;
    var width = imgData.width, height = imgData.height, data = imgData.data;
    var length = width * height;
    for (var i = 0; i < length; i += 1) {
        var p = i * 4;
        var g = grayscale_1.grayscale(data[p], data[p + 1], data[p + 2], grayscaleAlgorithm);
        data[p] = g;
        data[p + 1] = g;
        data[p + 2] = g;
    }
}
exports.decolorImg = decolorImg;
function narrowImg(imgData, _a) {
    var narrowSize = _a.narrow;
    var width = imgData.width, height = imgData.height, data = imgData.data;
    var length = width * height;
    for (var i = 0; i < length; i += 1) {
        var p = i * 4;
        data[p] = grayscale_1.narrow(data[p], narrowSize);
        data[p + 1] = grayscale_1.narrow(data[p + 1], narrowSize);
        data[p + 2] = grayscale_1.narrow(data[p + 2], narrowSize);
    }
}
exports.narrowImg = narrowImg;
function walkImg(imgData, options, callback) {
    var e_1, _a;
    var c = 0;
    var p = 0;
    var b = 0;
    try {
        for (var _b = __values(divideImg(imgData, options)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var block = _c.value;
            callback(block, { c: c, p: p, b: b });
            c += 1;
            b += 1;
            if (c === 3) {
                p += 1;
                c = 0;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.walkImg = walkImg;
