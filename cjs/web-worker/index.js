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
const stego_params_1 = require("../utils/stego-params");
const v1 = __importStar(require("../v1"));
const v2 = __importStar(require("../v2"));
const algoithms = {
    [stego_params_1.AlgorithmVersion.V1]: v1,
    [stego_params_1.AlgorithmVersion.V2]: v2,
};
self.addEventListener('message', (event) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = event.data;
    if (payload.type === 'encode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const mask = new ImageData(maskData.data, maskData.width, maskData.height);
        const { data, height, width } = yield algoithms[options.version].encode(image, mask, options);
        self.postMessage({ id, data, height, width }, event.origin);
    }
    else if (payload.type === 'decode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const mask = new ImageData(maskData.data, maskData.width, maskData.height);
        const decoded = yield algoithms[options.version].decode(image, mask, options);
        self.postMessage({ id, decoded }, event.origin);
    }
}));
//# sourceMappingURL=index.js.map