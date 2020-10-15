import { EncodeOptions, DecodeOptions } from '../utils/stego-params'
import { encodeImg, decodeImg } from './stego'
import { buf2Img, img2Buf } from '../canvas/dom'
import { cropImg } from '../utils/image'

export async function encode(imgBuf: ArrayBuffer, maskBuf: ArrayBuffer, options: EncodeOptions) {
  const [imgData, maskData] = await Promise.all([buf2Img(imgBuf), buf2Img(maskBuf)])
  const { cropEdgePixels } = options
  const { width, height } = imgData
  const [cropWidth, cropHeight] = cropImg(imgData, options)

  return img2Buf(
    await encodeImg(imgData, maskData, options),
    cropEdgePixels ? cropWidth : width,
    cropEdgePixels ? cropHeight : height,
  )
}

export async function decode(imgBuf: ArrayBuffer, maskBuf: ArrayBuffer, options: DecodeOptions) {
  const [imgData, maskData] = await Promise.all([buf2Img(imgBuf), buf2Img(maskBuf)])

  return decodeImg(imgData, maskData, options)
}
