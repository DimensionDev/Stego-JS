import { encode } from '.';
import { rs2Buf } from './helper';
import { TransformAlgorithm } from './transform';
import { GrayscaleAlgorithm } from './grayscale';

async function start() {
  const imageBuf = await encode(await rs2Buf(process.stdin), {
    clip: 0,
    copies: 5,
    size: 8,
    pass: '',
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    transformAlgorithm: TransformAlgorithm.FFT1D,
  });

  process.stdout.write(imageBuf);
}

start();
