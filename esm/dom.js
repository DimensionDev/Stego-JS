import { createAPI } from './utils/expose.js';
import { getImageType } from './utils/helper.js';
import { preprocessImage } from './utils/image.js';
export { getImageType } from './utils/helper.js';
export * from './utils/types.js';
export * from './constant.js';
export const { encode, decode } = createAPI({
    toImageData(_data) {
        return new Promise((resolve) => {
            const data = new Uint8Array(_data);
            const type = getImageType(data);
            const blob = new Blob([data], { type });
            resolve(getImageData(blob));
        });
    },
    async toPNG(imgData, height = imgData.height, width = imgData.width) {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.putImageData(imgData, 0, 0, 0, 0, width, height);
        if (isOffscreenCanvas(canvas)) {
            return canvas.convertToBlob({ type: 'image/png' }).then(toUint8Array);
        }
        else {
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob)
                        resolve(toUint8Array(blob));
                    else
                        reject(new Error('fail to convert to png'));
                }, 'image/png');
            });
        }
    },
    preprocessImage(data) {
        return preprocessImage(data, (w, h) => createCanvas(w, h).getContext('2d')?.createImageData(w, h) ?? null);
    },
    defaultRandomSource(buffer) {
        return crypto.getRandomValues(buffer);
    },
});
async function toUint8Array(blob) {
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
}
function createCanvas(width, height) {
    let canvas;
    if (typeof OffscreenCanvas === 'function') {
        canvas = new OffscreenCanvas(width, height);
    }
    else {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    }
    return canvas;
}
async function getImageData(imageBlob) {
    let width, height;
    let image;
    if (typeof createImageBitmap === 'function') {
        image = await createImageBitmap(imageBlob);
        width = image.width;
        height = image.height;
    }
    else {
        const url = URL.createObjectURL(imageBlob);
        image = await new Promise((resolve, reject) => {
            const element = new Image();
            element.addEventListener('load', () => {
                width = element.width;
                height = element.height;
                resolve(element);
            });
            element.addEventListener('error', reject);
            element.src = url;
        }).finally(() => URL.revokeObjectURL(url));
    }
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, width, height);
}
function isOffscreenCanvas(value) {
    return typeof OffscreenCanvas === 'function' && value instanceof OffscreenCanvas;
}
//# sourceMappingURL=dom.js.map