export { getImageType } from './utils/helper.js';
export * from './utils/types.js';
export * from './constant.js';
export declare const encode: (image: ArrayLike<number> | ArrayBufferLike, mask: ArrayLike<number> | ArrayBufferLike, options: import("./utils/stego-params.js").EncodeOptions) => Promise<Uint8Array>, decode: (image: ArrayLike<number> | ArrayBufferLike, mask: ArrayLike<number> | ArrayBufferLike, options: import("./utils/stego-params.js").Options) => Promise<string>;
//# sourceMappingURL=node.d.ts.map