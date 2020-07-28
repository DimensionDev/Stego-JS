import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';

export enum AlgorithmVersion {
  V1 = "0.11.x",
  V2 = "0.12.x" 
}

export interface Options {
  version: AlgorithmVersion,
  pass?: string;
  size: number;
  copies: number;
  tolerance: number;
  transformAlgorithm: TransformAlgorithm;
}

export interface EncodeOptions extends Options {
  text: string;
  narrow: number;
  grayscaleAlgorithm: GrayscaleAlgorithm;
  exhaustPixels: boolean;
  cropEdgePixels: boolean;
  fakeMaskPixels: boolean;
}

export interface DecodeOptions extends Options {}
