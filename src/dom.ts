import { EncodeOptions, DecodeOptions, encodeImg, decodeImg } from './stego';
import { blob2Img, img2Blob } from './canvas/dom';
import { cropImg } from './image';

export async function encode(blob: Blob, options: EncodeOptions) {
  const imgData = await blob2Img(blob);
  const { noCropEdgePixels } = options;
  const { width, height } = imgData;
  const [cropWidth, cropHeight] = cropImg(imgData, options);

  return img2Blob(
    await encodeImg(imgData, options),
    noCropEdgePixels ? width : cropWidth,
    noCropEdgePixels ? height : cropHeight
  );
}

export async function decode(blob: Blob, options: DecodeOptions) {
  return decodeImg(await blob2Img(blob), options);
}
