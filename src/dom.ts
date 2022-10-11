import { createAPI } from './utils/expose.js'
import { getImageType } from './utils/helper.js'
import { preprocessImage } from './utils/image.js'

export { getImageType }
export * from './utils/types.js'
export * from './constant.js'

export const { encode, decode } = createAPI({
  toImageData(_data) {
    return new Promise<ImageData>((resolve) => {
      const data = new Uint8Array(_data)
      const type = getImageType(data)
      const blob = new Blob([data], { type })
      resolve(getImageData(blob))
    })
  },
  async toPNG(imgData, height = imgData.height, width = imgData.width) {
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')!
    context.putImageData(imgData, 0, 0, 0, 0, width, height)

    if (isOffscreenCanvas(canvas)) {
      return canvas.convertToBlob({ type: 'image/png' }).then(toUint8Array)
    } else {
      return new Promise<Uint8Array>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(toUint8Array(blob))
          else reject(new Error('fail to convert to png'))
        }, 'image/png')
      })
    }
  },
  preprocessImage(data) {
    return preprocessImage(data, (w, h) => createCanvas(w, h).getContext('2d')?.createImageData(w, h) ?? null)
  },
})

function toUint8Array(blob: Blob) {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(new Uint8Array(reader.result as ArrayBuffer)))
    reader.addEventListener('error', () => reject(new Error('fail to generate array buffer')))
    reader.readAsArrayBuffer(blob)
  })
}

function createCanvas(width: number, height: number) {
  let canvas: HTMLCanvasElement | OffscreenCanvas
  if (typeof OffscreenCanvas === 'function') {
    canvas = new OffscreenCanvas(width, height)
  } else {
    canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
  }
  return canvas
}

async function getImageData(imageBlob: Blob) {
  let width: number, height: number
  let image: ImageBitmap | HTMLImageElement
  if (typeof createImageBitmap === 'function') {
    image = await createImageBitmap(imageBlob)
    width = image.width
    height = image.height
  } else {
    const url = URL.createObjectURL(imageBlob)
    image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.addEventListener('load', () => {
        width = element.width
        height = element.height
        resolve(element)
      })
      element.addEventListener('error', reject)
      element.src = url
    }).finally(() => URL.revokeObjectURL(url))
  }

  const canvas = createCanvas(width!, height!)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, 0, 0)
  return ctx.getImageData(0, 0, width!, height!)
}

function isOffscreenCanvas(value: any): value is OffscreenCanvas {
  return typeof OffscreenCanvas === 'function' && value instanceof OffscreenCanvas
}
