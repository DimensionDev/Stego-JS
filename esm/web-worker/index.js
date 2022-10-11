import { AlgorithmVersion } from '../utils/stego-params.js';
import * as v1 from '../v1/index.js';
import * as v2 from '../v2/index.js';
const algorithms = {
    [AlgorithmVersion.V1]: v1,
    [AlgorithmVersion.V2]: v2,
};
self.addEventListener('message', async (event) => {
    const payload = event.data;
    if (payload.type === 'encode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const { data, height, width } = await algorithms[options.version].encode(image, maskData.data, options);
        self.postMessage({ id, data, height, width }, event.origin);
    }
    else if (payload.type === 'decode') {
        const { id, imgData, maskData, options } = payload;
        const image = new ImageData(imgData.data, imgData.width, imgData.height);
        const decoded = await algorithms[options.version].decode(image, maskData.data, options);
        self.postMessage({ id, decoded }, event.origin);
    }
});
//# sourceMappingURL=index.js.map