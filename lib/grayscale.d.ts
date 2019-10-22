export declare enum GrayscaleAlgorithm {
    NONE = "NONE",
    AVERAGE = "AVG",
    LUMINANCE = "LUMA",
    LUMINANCE_II = "LUMA_II",
    DESATURATION = "DESATURATION",
    MAX_DECOMPOSITION = "MAX_DE",
    MIN_DECOMPOSITION = "MIN_DE",
    MID_DECOMPOSITION = "MID_DE",
    SIGNLE_R = "R",
    SIGNLE_G = "G",
    SIGNLE_B = "B"
}
export declare function grayscale(r: number, g: number, b: number, algorithm: GrayscaleAlgorithm): number;
export declare function shades(r: number, g: number, b: number, size: number): number;
export declare function narrow(gray: number, size: number): number;
