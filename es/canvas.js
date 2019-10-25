"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var NodeCanvas = __importStar(require("canvas"));
function createDOMCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
exports.createDOMCanvas = createDOMCanvas;
function createNodeCanvas(width, height) {
    return NodeCanvas.createCanvas(width, height);
}
exports.createNodeCanvas = createNodeCanvas;
function url2Img(url) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () {
            var width = image.width, height = image.height;
            var ctx = createDOMCanvas(width, height).getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);
            resolve(ctx.getImageData(0, 0, width, height));
        };
        image.onerror = function (err) { return reject(err); };
        image.src = url;
    });
}
exports.url2Img = url2Img;
function img2Url(imgData, width, height) {
    if (width === void 0) { width = imgData.width; }
    if (height === void 0) { height = imgData.height; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = URL).createObjectURL;
                    return [4 /*yield*/, img2Blob(imgData, width, height)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
exports.img2Url = img2Url;
function img2Blob(imgData, width, height) {
    if (width === void 0) { width = imgData.width; }
    if (height === void 0) { height = imgData.height; }
    var canvas = createDOMCanvas(width, height);
    var ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
    return new Promise(function (resolve) {
        return canvas.toBlob(function (blob) { return resolve(blob); }, 'image/png');
    });
}
exports.img2Blob = img2Blob;
function blob2Img(imgBlob) {
    return url2Img(URL.createObjectURL(imgBlob));
}
exports.blob2Img = blob2Img;
function buf2Img(imgBuf) {
    return new Promise(function (resolve, reject) {
        var image = new NodeCanvas.Image();
        image.onload = function () {
            var width = image.width, height = image.height;
            var ctx = createNodeCanvas(width, height).getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);
            resolve(ctx.getImageData(0, 0, width, height));
        };
        image.onerror = function (err) { return reject(err); };
        image.dataMode = NodeCanvas.Image.MODE_IMAGE;
        image.src = imgBuf;
    });
}
exports.buf2Img = buf2Img;
function img2Buf(imgData, width, height) {
    if (width === void 0) { width = imgData.width; }
    if (height === void 0) { height = imgData.height; }
    var canvas = createNodeCanvas(width, height);
    var ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
    return canvas.toBuffer('image/png');
}
exports.img2Buf = img2Buf;
