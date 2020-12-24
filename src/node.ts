import { createCanvas, Image } from 'canvas'
import { makeDecoder, makeEncoder, Methods } from './expose'
import { getImageType } from './utils/helper'
import { preprocessImage } from './utils/image'

export { default as algorithms } from './algorithms'
export * from './types'
export { getImageType }

const methods: Methods = {
  toImageData(data) {
    const type = getImageType(new Uint8Array(data.slice(0, 8)))
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
}

export const encode = makeEncoder(methods)

export const decode = makeDecoder(methods)
