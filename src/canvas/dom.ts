import { imgType } from '../utils/helper'
import { preprocessImage } from '../utils/image'

export function buf2Img(imgBuf: ArrayBuffer) {
  const type = imgType(new Uint8Array(imgBuf.slice(0, 8)))
  const blob = new Blob([imgBuf], { type })
  const url = URL.createObjectURL(blob)
  try {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => {
        const { width, height } = image
        const ctx = createCanvas(width, height).getContext('2d')!
        ctx.drawImage(image, 0, 0, width, height)
        resolve(ctx.getImageData(0, 0, width, height))
      })
      image.addEventListener('error', reject)
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function img2Buf(imgData: ImageData, width = imgData.width, height = imgData.height) {
  const canvas = createCanvas(width, height)
  canvas.getContext('2d')!.putImageData(imgData, 0, 0, 0, 0, width, height)
  if (canvas instanceof OffscreenCanvas) {
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
}

export function preprocessImg(imageData: ImageData): ImageData {
  return preprocessImage(
    imageData,
    (width, height) => createCanvas(width, height).getContext('2d')?.createImageData(width, height) ?? null,
  )
}

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
