/// <reference types="node" />
import * as NodeCanvas from 'canvas';
export declare function createDOMCanvas(width: number, height: number): HTMLCanvasElement;
export declare function createNodeCanvas(width: number, height: number): NodeCanvas.Canvas;
export declare function url2Img(url: string): Promise<ImageData>;
export declare function img2Url(imgData: ImageData, width?: number, height?: number): Promise<string>;
export declare function img2Blob(imgData: ImageData, width?: number, height?: number): Promise<Blob>;
export declare function blob2Img(imgBlob: Blob): Promise<ImageData>;
export declare function buf2Img(imgBuf: Buffer): Promise<ImageData>;
export declare function img2Buf(imgData: ImageData, width?: number, height?: number): Buffer;
