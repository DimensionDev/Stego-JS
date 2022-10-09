var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AlgorithmVersion } from '../utils/stego-params.js';
import * as v1 from '../v1/index.js';
import * as v2 from '../v2/index.js';
const algoithms = {
    [AlgorithmVersion.V1]: v1,
    [AlgorithmVersion.V2]: v2,
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