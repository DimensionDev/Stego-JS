import { createCanvas, Image } from 'canvas';
import { proxy } from './utils/expose';
import { imgType } from './utils/helper';
import { preprocessImage } from './utils/image';
import { AlgorithmVersion } from './utils/stego-params';
import * as v1 from './v1';
import * as v2 from './v2';
export { imgType as getImageType };
export * from './utils/types';
export * from './constant';
const { encode, decode } = proxy({
    algoithms: { [AlgorithmVersion.V1]: v1, [AlgorithmVersion.V2]: v2 },
    methods: {
        toImageData(data) {
            return new Promise((resolve, reject) => {
                const element = new Image();
                element.onload = () => {
                    const { width, height } = element;
                    const ctx = createCanvas(width, height).getContext('2d');
                    ctx.drawImage(element, 0, 0, width, height);
                    resolve(ctx.getImageData(0, 0, width, height));
                };
                element.onerror = reject;
                element.src = Buffer.from(data);
            });
        },
        async toBuffer(imgData, height = imgData.height, width = imgData.width) {
            const canvas = createCanvas(width, height);
            canvas.getContext('2d').putImageData(imgData, 0, 0, 0, 0, width, height);
            return canvas.toBuffer('image/png');
        },
        preprocessImage(data) {
            return preprocessImage(data, (width, height) => { var _a, _b; return (_b = (_a = createCanvas(width, height).getContext('2d')) === null || _a === void 0 ? void 0 : _a.createImageData(width, height)) !== null && _b !== void 0 ? _b : null; });
        },
    },
});
export { encode, decode };
//# sourceMappingURL=node.js.map