import { Options } from './stego-params';
import { Locator } from './locator';
export declare type Pixel = [number, number, number, number];
export declare function preprocessImage(imageData: ImageData, getScaled: (w: number, h: number) => ImageData | null): ImageData;
export declare function cropImg({ width, height }: ImageData, { size }: Options): readonly [number, number];
export declare function divideImg({ width, height, data }: ImageData, { size, verbose }: Options): Generator<number[], void, unknown>;
export declare function visitImgByPixel(imgData: ImageData, options: Options, visitor: (pixel: Pixel, loc: number, imgData: ImageData) => void): void;
export declare function visitImgByBlock(imgData: ImageData, options: Options, visitor: (block: number[], loc: Locator, imgData: ImageData) => boolean): void;
export declare function updateImgByPixel(imgData: ImageData, options: Options, updater: (pixel: Pixel, loc: number, imgData: ImageData) => Pixel): void;
export declare function updateImgByBlock(imgData: ImageData, options: Options, updater: (block: number[], loc: Locator, imgData: ImageData) => boolean): void;
export declare function updateImgByPixelChannelAt(imgData: ImageData, loc: number, channel: number, value: number): void;
export declare function updateImgByPixelAt(imgData: ImageData, options: Options, pixel: Pixel, loc: number): void;
export declare function updateImgByBlockAt(imgData: ImageData, options: Options, block: number[], loc: Locator): void;