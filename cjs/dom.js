"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.getImageType = void 0;
const expose_1 = require("./utils/expose");
const helper_1 = require("./utils/helper");
Object.defineProperty(exports, "getImageType", { enumerable: true, get: function () { return helper_1.imgType; } });
const image_1 = require("./utils/image");
const stego_params_1 = require("./utils/stego-params");
const v1 = __importStar(require("./v1"));
const v2 = __importStar(require("./v2"));
__exportStar(require("./utils/types"), exports);
__exportStar(require("./constant"), exports);
const { encode, decode } = (0, expose_1.proxy)({
    algoithms: { [stego_params_1.AlgorithmVersion.V1]: v1, [stego_params_1.AlgorithmVersion.V2]: v2 },
    methods: {
        toImageData(data) {
            const type = (0, helper_1.imgType)(new Uint8Array(data.slice(0, 8)));
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            return new Promise((resolve, reject) => {
                const element = new Image();
                element.addEventListener('load', () => {
                    const { width, height } = element;
                    const ctx = createCanvas(width, height).getContext('2d');
                    ctx.drawImage(element, 0, 0, width, height);
                    resolve(ctx.getImageData(0, 0, width, height));
                });
                element.addEventListener('error', reject);
                element.src = url;
            });
        },
        toBuffer(imgData, height = imgData.height, width = imgData.width) {
            return __awaiter(this, void 0, void 0, function* () {
                const canvas = createCanvas(width, height);
                canvas.getContext('2d').putImageData(imgData, 0, 0, 0, 0, width, height);
                if (isOffscreenCanvas(canvas)) {
                    return toArrayBuffer(yield canvas.convertToBlob({ type: 'image/png' }));
                }
                return new Promise((resolve, reject) => {
                    const callback = (blob) => {
                        if (blob) {
                            resolve(toArrayBuffer(blob));
                        }
                        else {
                            reject(new Error('fail to generate array buffer'));
                        }
                    };
                    canvas.toBlob(callback, 'image/png');
                });
            });
        },
        preprocessImage(data) {
            return (0, image_1.preprocessImage)(data, (w, h) => { var _a, _b; return (_b = (_a = createCanvas(w, h).getContext('2d')) === null || _a === void 0 ? void 0 : _a.createImageData(w, h)) !== null && _b !== void 0 ? _b : null; });
        },
    },
});
exports.encode = encode;
exports.decode = decode;
function toArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', () => reject(new Error('fail to generate array buffer')));
        reader.readAsArrayBuffer(blob);
    });
}
function createCanvas(width, height) {
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
function isOffscreenCanvas(value) {
    return (value === null || value === void 0 ? void 0 : value[Symbol.toStringTag]) === 'OffscreenCanvas';
}
//# sourceMappingURL=dom.js.map