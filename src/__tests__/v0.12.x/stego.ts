import { encode, decode } from '../../node';
import { Options } from '../../utils/stego-params';
import { TransformAlgorithm } from '../../utils/transform';
import { rand } from '../../utils/helper';
import { DEFAULT_MASK } from '../../constant';
import { Bit, str2bits } from '../../v0.12.x/bit';

import {
  compressImgAndDecode,
  createImgBuf,
  createOptions,
  extendEncodeOptions,
  decodeBitbyBlock,
  encodeBitbyBlock,
  normalizeBlock,
  randomStr
} from './utils'

const testAlgs = [ TransformAlgorithm.FFT1D, TransformAlgorithm.FFT2D, TransformAlgorithm.DCT ];
const bits = [ 0, 1 ] as Bit[];
const testOptions = testAlgs.map(transformAlgorithm => createOptions(transformAlgorithm)) ;
const testsize = 5; // encode text length

// block level test
test('block with all the same values', () => {
  const testBlockValues = [ 0, 127, 255 ];
  for (let option of testOptions) {
    for (let v of testBlockValues) {
      for( let bit of bits) {
        const block = new Array(option.size * option.size).fill(v);
        testEncodeAndDecodeBlock(bit, block, option, option.transformAlgorithm);
      }
    }
  }
})

test('block with random values', () => {
  const testSize = 10;
  for (let option of testOptions) {
    for (let v = 0; v < testSize; v += 1) {
      for(let bit of bits) {
        const block = Array.apply(null, new Array(option.size * option.size)).map(()=> rand(0, 255));
        testEncodeAndDecodeBlock(bit, block, option, option.transformAlgorithm);
      }
    }
  }
})

function testEncodeAndDecodeBlock(
  bit: Bit,
  block: number[],
  options: Options,
  transformAlgorithm: TransformAlgorithm
) {
  encodeBitbyBlock(bit, block, transformAlgorithm, options);
  normalizeBlock(block);
  const res = decodeBitbyBlock(block, transformAlgorithm, options);
  expect(bit).toEqual(res);
}

// image level test
test('overflow of encoded text', async () => {
  for (let option of testOptions) {
    const txt = randomStr(testsize);
    const encodeOptions = extendEncodeOptions(option, txt);
    const encodeLen = str2bits(encodeOptions.text, encodeOptions.copies).length + encodeOptions.copies * 8;
    const w = encodeLen * encodeOptions.size / 8;
    const h =  encodeOptions.size * 8;

    try {
      await encode(createImgBuf(w - 1, h), Buffer.from(DEFAULT_MASK), encodeOptions);
    } catch (e) {
      expect(e.message).toEqual('bits overflow! try to shrink text or reduce copies.');
    }
    
    const encodedBuf = await encode(createImgBuf(w, h), Buffer.from(DEFAULT_MASK), encodeOptions);
    const msg = await decode(encodedBuf, Buffer.from(DEFAULT_MASK), encodeOptions);
    expect(msg).toEqual(encodeOptions.text);
  }
})

test('black color image with jpeg compression', done => {
  for (let option of testOptions) {
    const txt = randomStr(testsize);
    const encodeOptions = extendEncodeOptions(option, txt);
    const [w, h] = [200, 200];
    const data = new Uint8ClampedArray(w * h * 4);
    const imgBuf = createImgBuf(w, h, data.fill(0));
    const fs = require('fs');
    fs.writeFile("random.png", imgBuf, ()=>{});
    async function testBuffer(msg: string) {
      try {
        expect(msg).toEqual(encodeOptions.text);
        done();
      } catch (error) {
        done(error);
      }
    }
    compressImgAndDecode(imgBuf, encodeOptions, testBuffer);      
  }
})

test('random image with jpeg compression', done => {
  for (let option of testOptions) {
    const txt = randomStr(testsize);
    const encodeOptions = extendEncodeOptions(option, txt);
    const [w, h] = [200, 200];
    const imgBuf = createImgBuf(w, h);
    async function testBuffer(msg: string) {
      try {
        expect(msg).toEqual(encodeOptions.text);
        done();
      } catch (error) {
        done(error);
      }
    }
    compressImgAndDecode(imgBuf, encodeOptions, testBuffer);      
  }
})

