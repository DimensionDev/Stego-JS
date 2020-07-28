import { AlgorithmVersion, EncodeOptions, Options } from '../../utils/stego-params';
import { GrayscaleAlgorithm } from '../../utils/grayscale';
import { TransformAlgorithm, transform, inverseTransform } from '../../utils/transform';
import { clamp, rand } from '../../utils/helper';
import { setBit as setBitV2, getBit as getBitV2, Bit } from '../../v0.12.x/bit'
import { createAcc } from '../../v0.12.x/position';
import { img2Buf } from '../../canvas/node';
import * as NodeCanvas from 'canvas';
import { encode, decode } from '../../node';
import { DEFAULT_MASK } from '../../constant';

import {
  DEFAULT_COPIES,
  DEFAULT_TOLERANCE,
  DEFAULT_SIZE,
  DEFAULT_NARROW,
  DEFAULT_FAKE_MASK_PIXELS,
} from '../../constant';

export function createOptions(transformAlgorithm: TransformAlgorithm) {
  return {
    version: AlgorithmVersion.V2,
    size: DEFAULT_SIZE,
    copies: DEFAULT_COPIES,
    tolerance: DEFAULT_TOLERANCE[transformAlgorithm],
    transformAlgorithm: transformAlgorithm
  } as Options;
}

export function extendEncodeOptions(options: Options, text: string) {
  return {
    ...options,
    text: text,
    narrow: DEFAULT_NARROW,
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    exhaustPixels: false,
    fakeMaskPixels:  DEFAULT_FAKE_MASK_PIXELS,
  } as EncodeOptions;
}

export function encodeBitbyBlock(
  bit: Bit,
  block: number[],
  transformAlgorithm: TransformAlgorithm,
  options: Options
) {
  const im = new Array(options.size * options.size);
  const acc = createAcc(options);
  transform(block, im.fill(0), transformAlgorithm, options);
  setBitV2(block, bit, acc, options);
  inverseTransform(block, im, transformAlgorithm, options);
}

export function decodeBitbyBlock(
  block: number[],
  transformAlgorithm: TransformAlgorithm,
  options: Options
) : Bit {
  const im = new Array(options.size * options.size);
  const acc = createAcc(options);
  transform(block, im.fill(0), transformAlgorithm, options);
  return getBitV2(block, acc, options);
}

export function normalizeBlock(block: number[]) {
  for (let i = 0; i < block.length; i +=1 )
    block[i] = clamp(Math.round(block[i]), 0, 255);
}

export function createImgBuf(width: number, height: number, data?: Uint8ClampedArray) {
  let imgData : ImageData;
  if (data)
    imgData =NodeCanvas.createImageData(data, width, height);
  else {
    imgData = NodeCanvas.createImageData(width, height);
    for (let i = 0; i < imgData.data.length; i+=4) {
      imgData.data[i+0] = rand(0,255);
      imgData.data[i+1] = rand(0,255);
      imgData.data[i+2] = rand(0,255);
      imgData.data[i+3] = 255;
    }
  }
  return img2Buf(imgData, width, height);
}

export function randomStr(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function compressImgAndDecode(
  imgBuf: Buffer,
  encodeOptions: EncodeOptions,
  validate: (msg: string) => void
) {
  const gm = require('gm').subClass({imageMagick: true})
  gm(imgBuf, 'image.png').compress('JPEG').toBuffer(async function (err: any, buffer: Buffer) {
    const encodedBuf = await encode(buffer, Buffer.from(DEFAULT_MASK), encodeOptions);
    const msg = await decode(encodedBuf, Buffer.from(DEFAULT_MASK), encodeOptions);
    if (err)
      throw new Error('compress error');
    validate(msg);
  })
}