import { AlgorithmVersion } from './stego-params.js';
import * as v1 from '../v1/index.js';
import * as v2 from '../v2/index.js';
const algorithms = {
    [AlgorithmVersion.V1]: v1,
    [AlgorithmVersion.V2]: v2,
};
export function createAPI(_) {
    const { preprocessImage, toPNG: toBuffer, toImageData, defaultRandomSource } = _;
    return {
        async encode(image, mask, options) {
            const { data, height, width } = await algorithms[options.version].encode(preprocessImage(await toImageData(image)), preprocessImage(await toImageData(mask)).data, options, defaultRandomSource);
            return toBuffer(data, height, width);
        },
        async decode(image, mask, options) {
            return algorithms[options.version].decode(await toImageData(image), (await toImageData(mask)).data, options);
        },
    };
}
//# sourceMappingURL=expose.js.map