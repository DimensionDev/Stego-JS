import { expect, test, vi } from 'vitest'
import { preprocessImage } from '../src/utils/image.js'
import { MAX_WIDTH } from '../src/constant.js'

test('preprocessImage rounds the dimensions of the scaled image', async () => {
  const getScaled = vi.fn().mockImplementation((width, height) => ({
    height,
    width,
    colorSpace: 'srgb',
    data: new Uint8ClampedArray(width * height * 4),
  }))
  preprocessImage(
    {
      width: 1980,
      height: 1024,
      colorSpace: 'srgb',
      data: new Uint8ClampedArray(1980 * 1024 * 4),
    },
    getScaled,
  )

  expect(getScaled).toHaveBeenCalledWith(MAX_WIDTH, 1014)
})
