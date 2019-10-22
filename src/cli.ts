import meow from 'meow';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import { rs2Buf } from './helper';
import { encode, decode } from '.';
import {
  DEFAULT_COPIES,
  DEFAULT_TOLERANCE,
  DEFAULT_SIZE,
  DEFAULT_NARROW,
  CLI_NAME,
  DEFAULT_NO_EDGE_PIXELS,
} from './constant';
import { normalizeFlags, validateFlags, flags2Options } from './flag';

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
  -t, --tolerance        Specify the number to be added into wave amplitude: ${DEFAULT_TOLERANCE} (default).
  -s, --size             Size of encoding block with radix-2 required: ${DEFAULT_SIZE} (default).
  -c, --copies           Size of duplications with odd numbers required: ${DEFAULT_COPIES} (default).
  -g, --grayscale        Specify grayscale algorithm: 'NONE' (default), 'AVG', 'LUMA', 'LUMA_II', 'DESATURATION', 'MAX_DE', 'MIN_DE', 'MID_DE', 'R', 'G', 'B'.
  -f, --transform        Specify transform algorithm: 'FFT1D' (default), 'FFT2D', 'DCT'.

      --noClipEdgePixels Do not clip edge pixels.

Examples
  $ cat ./input.png | ${CLI_NAME} -e -m 'hello world' > output.png
  $ cat ./output.png | ${CLI_NAME} -d
`,
  {
    flags: {
      help: {
        type: 'boolean',
        default: false,
        alias: 'h',
      },
      version: {
        type: 'boolean',
        default: false,
        alias: 'v',
      },
      encode: {
        type: 'boolean',
        default: false,
        alias: 'e',
      },
      decode: {
        type: 'boolean',
        default: false,
        alias: 'd',
      },
      message: {
        type: 'string',
        default: '',
        alias: 'm',
      },
      pass: {
        type: 'string',
        default: '',
        alias: 'p',
      },
      size: {
        type: 'string',
        default: DEFAULT_SIZE,
        alias: 's',
      },
      narrow: {
        type: 'string',
        default: DEFAULT_NARROW,
        alias: 'i',
      },
      copies: {
        type: 'string',
        default: DEFAULT_COPIES,
        alias: 'c',
      },
      tolerance: {
        type: 'string',
        default: DEFAULT_TOLERANCE,
        alias: 't',
      },
      grayscale: {
        type: 'string',
        default: GrayscaleAlgorithm.NONE,
        alias: 'g',
      },
      transform: {
        type: 'string',
        default: TransformAlgorithm.FFT1D,
        alias: 'f',
      },
      noClipEdgePixels: {
        type: 'boolean',
        default: DEFAULT_NO_EDGE_PIXELS,
      },
    },
    inferType: true,
  }
);

export const version = process.env.npm_package_version;

export async function run() {
  const flags = normalizeFlags(cli.flags);

  if (flags.help || (!flags.encode && !flags.decode)) {
    process.stdout.write(`${cli.help}\n`);
    process.exit(0);
  } else if (flags.version) {
    process.stdout.write(`${version}\n`);
    process.exit(0);
  }

  const errMsg = validateFlags(flags);

  if (errMsg) {
    process.stderr.write(`${errMsg}\n`);
    process.exit(1);
  }

  const options = flags2Options(flags);
  const imgBuf =
    flags.encode || flags.decode ? await rs2Buf(process.stdin) : null;

  if (flags.encode) {
    process.stdout.write(await encode(imgBuf, options));
  } else if (flags.decode) {
    process.stdout.write(await decode(imgBuf, options));
  }
}
