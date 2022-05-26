import { createCanvas, Image } from 'canvas'
import { proxy } from './utils/expose'
import { imgType } from './utils/helper'
import { preprocessImage } from './utils/image'
import { AlgorithmVersion } from './utils/stego-params'
import * as v1 from './v1'
import * as v2 from './v2'

export { imgType as getImageType }
export * from './utils/types'

const { encode, decode } = proxy({
  algoithms: { [AlgorithmVersion.V1]: v1, [AlgorithmVersion.V2]: v2 },
  methods: {
    toImageData(data) {
      return new Promise((resolve, reject) => {
        const element = new Image()
        element.onload = () => {
          const { width, height } = element
          const ctx = createCanvas(width, height).getContext('2d')!
          ctx.drawImage(element, 0, 0, width, height)
          resolve(ctx.getImageData(0, 0, width, height))
        }
        element.onerror = reject
        element.src = Buffer.from(data)
      })
    },
    async toBuffer(imgData, height = imgData.height, width = imgData.width) {
      const canvas = createCanvas(width, height)
      canvas.getContext('2d').putImageData(imgData, 0, 0, 0, 0, width, height)
      return canvas.toBuffer('image/png')
    },
    preprocessImage(data) {
      return preprocessImage(
        data,
        (width, height) => createCanvas(width, height).getContext('2d')?.createImageData(width, height) ?? null,
      )
    },
  },
})

export { encode, decode }
