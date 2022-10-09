import { imgType } from './utils/helper.js';
export { imgType as getImageType };
export * from './utils/types.js';
export * from './constant.js';
declare const encode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params.js").EncodeOptions) => Promise<ArrayBuffer>, decode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params.js").Options) => Promise<string>;
export { encode, decode };
//# sourceMappingURL=dom.d.ts.map