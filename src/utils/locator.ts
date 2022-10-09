import { Options } from './stego-params.js'

export interface Locator {
  /**
   * channel
   */
  c: number
  /**
   * block position
   */
  p: number
  /**
   * bit position
   */
  b: number
  /**
   * image width
   */
  w: number
  /**
   * image height
   */
  h: number
}

/**
 * Locator to coord of top left pixel inside block
 * @param locator
 * @param options
 */
export function loc2coord({ p, w }: Locator, { size }: Options) {
  return [(p % Math.floor(w / size)) * size, Math.floor(p / Math.floor(w / size)) * size] as const
}

/**
 * Locator to pixel index
 * @param locator
 * @param options
 * @param x1 x coord of top left pixel inside block
 * @param y1 y coord of top left pixel inside block
 * @param index the index of pixel inside block
 */
export function loc2idx({ w, c }: Locator, { size }: Options, x1: number, y1: number, index: number) {
  const x2 = index % size
  const y2 = Math.floor(index / size)

  return ((y1 + y2) * w + x1 + x2) * 4 + c
}
