import { EncodeOptions, DecodeOptions, encodeImg, decodeImg } from './stego';
import { buf2Img, img2Buf } from './canvas/node';
import { cropImg } from './image';

export async function encode(buf: Buffer, options: EncodeOptions) {
  const imgData = await buf2Img(buf);
  const { noCropEdgePixels } = options;
  const { width, height } = imgData;
  const [cropWidth, cropHeight] = cropImg(imgData, options);

  return img2Buf(
    await encodeImg(imgData, options),
    noCropEdgePixels ? width : cropWidth,
    noCropEdgePixels ? height : cropHeight
  );
}

export async function decode(buf: Buffer, options: DecodeOptions) {
  return decodeImg(await buf2Img(buf), options);
}
