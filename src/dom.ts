import { createAPI } from './utils/expose.js'
import { getImageType } from './utils/helper.js'
import { preprocessImage } from './utils/image.js'

export { getImageType }
export * from './utils/types.js'
export * from './constant.js'

export const { encode, decode } = createAPI({
  toImageData(_data) {
    const data = new Uint8Array(_data)
    const type = getImageType(data)
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
      return toUint8ClampedArray(await canvas.convertToBlob({ type: 'image/png' }))
    }
    return new Promise<Uint8ClampedArray>((resolve, reject) => {
      const callback: BlobCallback = (blob) => {
        if (blob) {
          resolve(toUint8ClampedArray(blob))
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

function toUint8ClampedArray(blob: Blob) {
  return new Promise<Uint8ClampedArray>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(new Uint8ClampedArray(reader.result as ArrayBuffer)))
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
