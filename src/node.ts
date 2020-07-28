import { AlgorithmVersion, EncodeOptions, DecodeOptions } from './utils/stego-params';

import { encode as encodev1 } from './v0.11.x/node'
import { encode as encodev2 } from './v0.12.x/node'

import { decode as decodev1 } from './v0.11.x/node'
import { decode as decodev2 } from './v0.12.x/node'

export async function encode(
  imgBuf: Buffer,
  maskBuf: Buffer,
  options: EncodeOptions
) {
  const encodeVersion: { [index: string]: Function } = {
    [AlgorithmVersion.V1]: encodev1,
    [AlgorithmVersion.V2]: encodev2,
  }
  return await encodeVersion[options.version](imgBuf, maskBuf, options);
}

export async function decode(
  imgBuf: Buffer,
  maskBuf: Buffer,
  options: DecodeOptions
) {
  const encodeVersion: { [index: string]: Function } = {
    [AlgorithmVersion.V1]: decodev1,
    [AlgorithmVersion.V2]: decodev2,
  }
  return encodeVersion[options.version](imgBuf, maskBuf, options);
}
