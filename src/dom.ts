import { createAPI } from './utils/expose.js'
import { getImageType } from './utils/helper.js'
import { preprocessImage } from './utils/image.js'

export { getImageType }
export * from './utils/types.js'
export * from './constant.js'

export const { encode, decode } = createAPI({
  toImageData(data) {
    const type = getImageType(new Uint8Array(data.slice(0, 8)))
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    return new Promise((resolve, reject) => {
      const element = new Image()
      element.addEventListener('load', () => {
        const { width, height } = element
        const ctx = createCanvas(width, height).getContext('2d')!
        ctx.drawImage(element, 0, 0, width, height)
        resolve(ctx.getImageData(0, 0, width, height))
      })
      element.addEventListener('error', reject)
      element.src = url
    })
  },
  async toBuffer(imgData, height = imgData.height, width = imgData.width) {
    const canvas = createCanvas(width, height)
    canvas.getContext('2d')!.putImageData(imgData, 0, 0, 0, 0, width, height)
    if (isOffscreenCanvas(canvas)) {
      return toArrayBuffer(await canvas.convertToBlob({ type: 'image/png' }))
    }
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const callback: BlobCallback = (blob) => {
        if (blob) {
          resolve(toArrayBuffer(blob))
        } else {
          reject(new Error('fail to generate array buffer'))
        }
      }
      canvas.toBlob(callback, 'image/png')
    })
  },
  preprocessImage(data) {
    return preprocessImage(data, (w, h) => createCanvas(w, h).getContext('2d')?.createImageData(w, h) ?? null)
  },
})

function toArrayBuffer(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result as ArrayBuffer))
    reader.addEventListener('error', () => reject(new Error('fail to generate array buffer')))
    reader.readAsArrayBuffer(blob)
  })
}

function createCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function isOffscreenCanvas(value: any): value is OffscreenCanvas {
  return value?.[Symbol.toStringTag] === 'OffscreenCanvas'
}
