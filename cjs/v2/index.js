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
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
const stego_1 = require("./stego");
const image_1 = require("../utils/image");
var stego_2 = require("./stego");
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return stego_2.decodeImg; } });
function encode(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { width, height } = imgData;
        const [cropWidth, cropHeight] = (0, image_1.cropImg)(imgData, options);
        return {
            data: yield (0, stego_1.encodeImg)(imgData, maskData, options),
            width: options.cropEdgePixels ? cropWidth : width,
            height: options.cropEdgePixels ? cropHeight : height,
        };
    });
}
exports.encode = encode;
//# sourceMappingURL=index.js.map