import { imgType } from '../utils/helper'
import { preprocessImage } from '../utils/image'

export function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height
  return canvas
}

export function buf2Img(imgBuf: ArrayBuffer) {
  const url = URL.createObjectURL(new Blob([imgBuf], { type: imgType(new Uint8Array(imgBuf)) }))

  return new Promise<ImageData>((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const { width, height } = image
      const ctx = createCanvas(width, height).getContext('2d')!

      ctx.drawImage(image, 0, 0, width, height)
      resolve(ctx.getImageData(0, 0, width, height))
    }
    image.onerror = (err) => reject(err)
    image.src = url
  })
}

export function img2Buf(imgData: ImageData, width = imgData.width, height = imgData.height) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')!

  ctx.putImageData(imgData, 0, 0, 0, 0, width, height)
  return new Promise<ArrayBuffer>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) {
        const fileReader = new FileReader()

        fileReader.onload = ({ target }) => {
          if (target) {
            resolve(target.result as ArrayBuffer)
          } else {
            reject(new Error('fail to generate array buffer'))
          }
        }
        fileReader.onerror = (err) => reject(err)
        fileReader.readAsArrayBuffer(blob)
      } else {
        reject(new Error('fail to generate array buffer'))
      }
    }, 'image/png'),
  )
}

export function preprocessImg(imageData: ImageData): ImageData {
  return preprocessImage(imageData, (w, h) => {
    const ctx = createCanvas(w, h).getContext('2d')
    if (ctx) return ctx.createImageData(w, h)
    else return null
  })
}
