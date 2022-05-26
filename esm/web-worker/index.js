import { AlgorithmVersion } from '../utils/stego-params';
import * as v1 from '../v1';
import * as v2 from '../v2';
const algoithms = {
    [AlgorithmVersion.V1]: v1,
    [AlgorithmVersion.V2]: v2,
};
self.addEventListener('message', async (event) => {
    const payload = event.data;
    if (payload.type === 'encode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const mask = new ImageData(maskData.data, maskData.width, maskData.height);
        const { data, height, width } = await algoithms[options.version].encode(image, mask, options);
        self.postMessage({ id, data, height, width }, event.origin);
    }
    else if (payload.type === 'decode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const mask = new ImageData(maskData.data, maskData.width, maskData.height);
        const decoded = await algoithms[options.version].decode(image, mask, options);
        self.postMessage({ id, decoded }, event.origin);
    }
});
//# sourceMappingURL=index.js.map