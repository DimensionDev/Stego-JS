import { encodeImg } from './stego';
import { cropImg } from '../utils/image';
export { decodeImg as decode } from './stego';
export async function encode(imgData, maskData, options) {
    const { width, height } = imgData;
    const [cropWidth, cropHeight] = cropImg(imgData, options);
    return {
        data: await encodeImg(imgData, maskData, options),
        width: options.cropEdgePixels ? cropWidth : width,
        height: options.cropEdgePixels ? cropHeight : height,
    };
}
//# sourceMappingURL=index.js.map