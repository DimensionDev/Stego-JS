export { getImageType } from './utils/helper.js';
export * from './utils/types.js';
export * from './constant.js';
export declare const encode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params.js").EncodeOptions) => Promise<Uint8Array>, decode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params.js").Options) => Promise<string>;
//# sourceMappingURL=dom.d.ts.map