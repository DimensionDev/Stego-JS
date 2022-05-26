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
exports.proxy = void 0;
function proxy({ algoithms, methods }) {
    return {
        encode(image, mask, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, height, width } = yield algoithms[options.version].encode(methods.preprocessImage(yield methods.toImageData(image)), methods.preprocessImage(yield methods.toImageData(mask)), options);
                return methods.toBuffer(data, height, width);
            });
        },
        decode(image, mask, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return algoithms[options.version].decode(yield methods.toImageData(image), yield methods.toImageData(mask), options);
            });
        },
    };
}
exports.proxy = proxy;
//# sourceMappingURL=expose.js.map