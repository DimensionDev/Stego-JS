var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { encodeImg } from './stego.js';
import { cropImg } from '../utils/image.js';
export { decodeImg as decode } from './stego.js';
export function encode(imgData, maskData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { width, height } = imgData;
        const [cropWidth, cropHeight] = cropImg(imgData, options);
        return {
            data: yield encodeImg(imgData, maskData, options),
            width: options.cropEdgePixels ? cropWidth : width,
            height: options.cropEdgePixels ? cropHeight : height,
        };
    });
}
//# sourceMappingURL=index.js.map