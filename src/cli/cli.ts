#!/usr/bin/env node
import meow from 'meow'
import { createReadStream } from 'fs'
import { encode, decode, AlgorithmVersion } from '../node.js'
import {
  CLI_NAME,
  DEFAULT_COPIES,
  DEFAULT_TOLERANCE,
  DEFAULT_SIZE,
  DEFAULT_CROP_EDGE_PIXELS,
  DEFAULT_MASK,
  DEFAULT_EXHAUST_PIXELS,
  DEFAULT_FAKE_MASK_PIXELS,
  DEFAULT_ALGORITHM_VERSION,
} from '../constant.js'
import { normalizeFlags, validateFlags, flags2Options, flags } from './flag.js'
import { Readable } from 'stream'

function rs2Buf(rs: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: Uint8Array[] = []

    rs.on('data', (c) => buffers.push(c))
    rs.on('end', () => resolve(Buffer.concat(buffers)))
    rs.on('error', (err) => reject(err))
  })
}

const cli = meow(
  `Usage
  $ cat <input> | ${CLI_NAME} [options...] > <output>

Options
  -h, --help             Print help message.
  -v, --version          Print version message.

  -e, --encode           Encode message into given image.
  -d, --decode           Decode message from given image.

  -m, --message          Specify the message to be encoded.
  -p, --pass             Specify the seed text for generating random encoding position when using 'FFT1D'.
  -t, --tolerance        Specify the number to be added into wave amplitude:
                            For ${AlgorithmVersion.V1}: ${
    DEFAULT_TOLERANCE[AlgorithmVersion.V1].FFT1D
  } (default for FFT1D), ${DEFAULT_TOLERANCE[AlgorithmVersion.V1].FFT2D} (default for FFT2D), ${
    DEFAULT_TOLERANCE[AlgorithmVersion.V1].fastDCT
  } (default for fastDCT), ${DEFAULT_TOLERANCE[AlgorithmVersion.V1].DCT} (default for DCT).
                            For ${AlgorithmVersion.V1}: ${
    DEFAULT_TOLERANCE[AlgorithmVersion.V2].FFT1D
  } (default for FFT1D), ${DEFAULT_TOLERANCE[AlgorithmVersion.V2].FFT2D} (default for FFT2D), ${
    DEFAULT_TOLERANCE[AlgorithmVersion.V2].fastDCT
  } (default for fastDCT), ${DEFAULT_TOLERANCE[AlgorithmVersion.V2].DCT} (default for DCT).
  -s, --size             Size of encoding block with radix-2 required: ${DEFAULT_SIZE} (default).
  -c, --copies           Size of duplications with odd numbers required: ${DEFAULT_COPIES} (default).
  -g, --grayscale        Specify grayscale algorithm: 'NONE' (default), 'AVG', 'LUMA', 'LUMA_II', 'DESATURATION', 'MAX_DE', 'MIN_DE', 'MID_DE', 'R', 'G', 'B'.
  -f, --transform        Specify transform algorithm: 'FFT1D' (default), 'FFT2D', 'DCT', 'fastDCT'.
      --exhaustPixels    Encode pixels in rest of image (default is ${DEFAULT_EXHAUST_PIXELS}).
      --fakeMaskPixels   Encode fake pixels into mask area (default is ${DEFAULT_FAKE_MASK_PIXELS})
      --cropEdgePixels   Crop edge pixels (default is ${DEFAULT_CROP_EDGE_PIXELS}).
      --algorithmVersion Specify algorithm version: 0.11.x, 0.12.x (default is ${DEFAULT_ALGORITHM_VERSION})
      --verbose          Print debug information

Examples
  $ cat ./input.png | ${CLI_NAME} -e -m 'hello world' > output.png
  $ cat ./output.png | ${CLI_NAME} -d
`,
  {
    flags,
    inferType: true,
    importMeta: import.meta,
  },
)

export async function run() {
  const flags = normalizeFlags(cli.flags)

  if (!flags.encode && !flags.decode) {
    process.stdout.write(`${cli.help}\n`)
    process.exit(0)
  }

  const errMsg = validateFlags(flags)

  if (errMsg) {
    process.stderr.write(`${errMsg}\n`)
    process.exit(1)
  }

  const options = flags2Options(flags)
  const imgBuf = flags.encode || flags.decode ? await rs2Buf(process.stdin) : null
  const maskBuf = flags.mask ? await rs2Buf(createReadStream(flags.mask)) : Buffer.from(DEFAULT_MASK)

  if (flags.encode && imgBuf) {
    process.stdout.write(new Uint8Array(await encode(imgBuf, maskBuf, options)))
  } else if (flags.decode && imgBuf) {
    process.stdout.write(await decode(imgBuf, maskBuf, options))
  }
}

run()
