import { EncodeOptions, DecodeOptions, encodeImg, decodeImg } from './stego';
import { buf2Img, img2Buf } from './canvas/node';
import { cropImg } from './image';

export async function encode(
  imgBuf: Buffer,
  maskBuf: Buffer,
  options: EncodeOptions
) {
  const [imgData, maskData] = await Promise.all([
    buf2Img(imgBuf),
    buf2Img(maskBuf),
  ]);
  const { noCropEdgePixels } = options;
  const { width, height } = imgData;
  const [cropWidth, cropHeight] = cropImg(imgData, options);

  return img2Buf(
    await encodeImg(imgData, maskData, options),
    noCropEdgePixels ? width : cropWidth,
    noCropEdgePixels ? height : cropHeight
  );
}

export async function decode(
  imgBuf: Buffer,
  maskBuf: Buffer,
  options: DecodeOptions
) {
  const [imgData, maskData] = await Promise.all([
    buf2Img(imgBuf),
    buf2Img(maskBuf),
  ]);

  return decodeImg(imgData, maskData, options);
}
