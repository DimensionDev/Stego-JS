declare interface FFT {
  init(width: number): void;
  fft1d(re: number[], im: number[]): void;
  ifft1d(re: number[], im: number[]): void;
  fft2d(re: number[], im: number[]): void;
  ifft2d(re: number[], im: number[]): void;
}

declare const FFT: FFT;

export default FFT;
