import { Decoder, Encoder } from '../utils/expose.js'
import { AlgorithmVersion } from '../utils/stego-params.js'
import * as v1 from '../v1/index.js'
import * as v2 from '../v2/index.js'
import { Payload } from './types.js'

const algorithms: Record<
  AlgorithmVersion,
  {
    encode: Encoder
    decode: Decoder
  }
> = {
  [AlgorithmVersion.V1]: v1,
  [AlgorithmVersion.V2]: v2,
}

self.addEventListener('message', async (event) => {
  const payload = event.data as Payload
  if (payload.type === 'encode') {
    const { id, imgData, maskData, options } = payload
    const image = new ImageData(imgData.data, imgData.width, imgData.height)
    const { data, height, width } = await algorithms[options.version].encode(image, maskData.data, options, (u8) =>
      crypto.getRandomValues(u8),
    )
    self.postMessage({ id, data, height, width }, event.origin)
  } else if (payload.type === 'decode') {
    const { id, imgData, maskData, options } = payload
    const image = new ImageData(imgData.data, imgData.width, imgData.height)
    const decoded = await algorithms[options.version].decode(image, maskData.data, options)
    self.postMessage({ id, decoded }, event.origin)
  }
})
