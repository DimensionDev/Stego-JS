import { createCanvas, Image } from 'canvas'
import { proxy } from './utils/expose'
import { imgType } from './utils/helper'
import { preprocessImage } from './utils/image'
import { AlgorithmVersion } from './utils/stego-params'
import * as v1 from './v0.11.x'
import * as v2 from './v0.12.x'

export * from './utils/types'

const { encode, decode } = proxy({
  algoithms: { [AlgorithmVersion.V1]: v1, [AlgorithmVersion.V2]: v2 },
  methods: {
    toImageData(data) {
      const type = imgType(new Uint8Array(data.slice(0, 8)))
      const blob = new Blob([data], { type })
      const url = URL.createObjectURL(blob)
      return new Promise((resolve, reject) => {
        const element = new Image()
        element.onload = () => {
          const { width, height } = element
          const ctx = createCanvas(width, height).getContext('2d')!
          ctx.drawImage(element, 0, 0, width, height)
          resolve(ctx.getImageData(0, 0, width, height))
        }
        element.onerror = reject
        element.src = url
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
