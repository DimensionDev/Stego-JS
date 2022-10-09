import { DecodeOptions, EncodeOptions } from '../utils/stego-params.js';
export declare type Payload = EncodePayload | DecodePayload;
export interface EncodePayload {
    type: 'encode';
    id: unknown;
    imgData: WorkerImageData;
    maskData: WorkerImageData;
    options: EncodeOptions;
}
export interface DecodePayload {
    type: 'decode';
    id: unknown;
    imgData: WorkerImageData;
    maskData: WorkerImageData;
    options: DecodeOptions;
}
export interface WorkerImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}
//# sourceMappingURL=types.d.ts.map