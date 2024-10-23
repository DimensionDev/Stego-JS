export { getImageType } from './utils/helper.js';
export * from './utils/types.js';
export * from './constant.js';
export declare const encode: (image: ArrayBufferLike | ArrayLike<number>, mask: ArrayBufferLike | ArrayLike<number>, options: import("./utils/stego-params.js").EncodeOptions) => Promise<Uint8Array>, decode: (image: ArrayBufferLike | ArrayLike<number>, mask: ArrayBufferLike | ArrayLike<number>, options: import("./utils/stego-params.js").DecodeOptions) => Promise<string>;
//# sourceMappingURL=dom.d.ts.map