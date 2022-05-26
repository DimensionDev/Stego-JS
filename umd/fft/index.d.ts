export default FFT;
declare namespace FFT {
    export function toString(): string;
    import fft = core.fft1d;
    export { fft };
    import ifft = core.ifft1d;
    export { ifft };
}
declare namespace core {
    export function init(n: any): void;
    export function fft1d(re: any, im: any): void;
    export function ifft1d(re: any, im: any): void;
    export function fft2d(re: any, im: any): void;
    export function ifft2d(re: any, im: any): void;
    export function fft_1(re: any, im: any, inv: any): void;
    export { fft_1 as fft };
    export function _initArray(): void;
    export function _paddingZero(): void;
    export function _makeBitReversalTable(): void;
    export function _makeCosSinTable(): void;
}
