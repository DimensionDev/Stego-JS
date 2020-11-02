import * as NodeCanvas from 'canvas'
import { preprocessImage } from '../utils/image'

export function createCanvas(width: number, height: number) {
  return NodeCanvas.createCanvas(width, height)
}

export function buf2Img(imgBuf: Buffer) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = new NodeCanvas.Image()

    image.onload = () => {
      const { width, height } = image
      const ctx = createCanvas(width, height).getContext('2d')

      ctx.drawImage(image, 0, 0, width, height)
      resolve(ctx.getImageData(0, 0, width, height))
    }
    image.onerror = (err) => reject(err)
    image.dataMode = NodeCanvas.Image.MODE_IMAGE
    image.src = imgBuf
  })
}

export function img2Buf(imgData: ImageData, width = imgData.width, height = imgData.height) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.putImageData(imgData, 0, 0, 0, 0, width, height)
  return canvas.toBuffer('image/png')
}

export function preprocessImg(imageData: ImageData): ImageData {
  return preprocessImage(imageData, (w, h) => {
    return createCanvas(w, h).getContext('2d').createImageData(w, h)
  })
}
