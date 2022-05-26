import { imgType } from './utils/helper';
export { imgType as getImageType };
export * from './utils/types';
export * from './constant';
declare const encode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params").EncodeOptions) => Promise<ArrayBuffer>, decode: (image: ArrayBuffer, mask: ArrayBuffer, options: import("./utils/stego-params").Options) => Promise<string>;
export { encode, decode };
//# sourceMappingURL=dom.d.ts.map