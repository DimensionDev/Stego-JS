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
const image_1 = require("@napi-rs/image");
const expose_1 = require("./utils/expose");
const helper_1 = require("./utils/helper");
Object.defineProperty(exports, "getImageType", { enumerable: true, get: function () { return helper_1.imgType; } });
const image_2 = require("./utils/image");
const stego_params_1 = require("./utils/stego-params");
const v1 = __importStar(require("./v1"));
const v2 = __importStar(require("./v2"));
__exportStar(require("./utils/types"), exports);
__exportStar(require("./constant"), exports);
const { encode, decode } = (0, expose_1.proxy)({
    algoithms: { [stego_params_1.AlgorithmVersion.V1]: v1, [stego_params_1.AlgorithmVersion.V2]: v2 },
    methods: {
        toImageData(data) {
            return __awaiter(this, void 0, void 0, function* () {
                let transformer = new image_1.Transformer(Buffer.from(data));
                let { width, height, colorType } = yield transformer.metadata();
                if (colorType !== 3 /* JsColorType.Rgba8 */ && colorType !== 2 /* JsColorType.Rgb8 */) {
                    transformer = new image_1.Transformer(yield transformer.png());
                    ({ width, height, colorType } = yield transformer.metadata());
                }
                if (colorType !== 3 /* JsColorType.Rgba8 */ && colorType !== 2 /* JsColorType.Rgb8 */) {
                    throw new TypeError('Cannot convert the given image to rgba8 format.');
                }
                let rgb = new Uint8ClampedArray(yield transformer.rawPixels());
                if (colorType === 2 /* JsColorType.Rgb8 */)
                    rgb = rgb_to_rgba(rgb);
                const imageData = {
                    width,
                    height,
                    colorSpace: 'srgb',
                    data: rgb,
                };
                return imageData;
            });
        },
        toBuffer(imgData, height = imgData.height, width = imgData.width) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield image_1.Transformer.fromRgbaPixels(imgData.data, width, height).crop(0, 0, width, height).png()).buffer;
            });
        },
        preprocessImage(data) {
            return (0, image_2.preprocessImage)(data, (width, height) => ({
                height,
                width,
                colorSpace: 'srgb',
                data: new Uint8ClampedArray(width * height * 4),
            }));
        },
    },
});
exports.encode = encode;
exports.decode = decode;
function rgb_to_rgba(array) {
    const next = new Uint8ClampedArray((array.length / 3) * 4);
    for (var old_index = 0, new_index = 0; old_index < array.length; old_index += 3, new_index += 4) {
        next[new_index] = array[old_index];
        next[new_index + 1] = array[old_index + 1];
        next[new_index + 2] = array[old_index + 2];
        next[new_index + 3] = 255;
    }
    if (new_index !== next.length)
        throw new Error('rgb_to_rgba error');
    return next;
}
//# sourceMappingURL=node.js.map