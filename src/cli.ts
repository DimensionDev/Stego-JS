import meow, { Result } from 'meow';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import { rs2Buf } from './helper';
import { encode, decode, EncodeOptions, DecodeOptions } from '.';
import pkg from '../package.json';

const CLI_NAME = 'stego';

const cli = meow(
  `Usage
  $ cat <input> | ${CLI_NAME} [options...] > <output>

Options
  -h, --help       Print help message
  -v, --version    Print version message
  -e, --encode     Encode message into given image
  -d, --decode     Decode message from given image
  -m, --message    Specify the message
  -s, --size       Size of encoding block with radix-2 required: 8 (default).
  -c, --copies     Encode duplicate messages in order to survive from
                   compression attack with odd numbers required: 3 (default).
  -t, --tolerance  The robustness level to compression.
  -p, --pass       A seed text for generating random encoding position
                   for specific algorithm ('FFT1D').
  -g, --grayscale  Specify grayscale algorithm: 'NONE' (default), 'AVG',
                   'LUMA', 'LUMA_II', 'DESATURATION', 'MAX_DE',
                   'MIN_DE', 'MID_DE', 'R', 'G', 'B'.
  -f, --transform  Specify transform algorithm: 'FFT1D' (default), 'FFT2D',
                   'DCT'

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
      size: {
        type: 'string',
        default: 8,
        alias: 's',
      },
      copies: {
        type: 'string',
        default: 3,
        alias: 'c',
      },
      tolerance: {
        type: 'string',
        default: 128,
        alias: 't',
      },
      pass: {
        type: 'string',
        default: '',
        alias: 'p',
      },
      grayscale: {
        type: 'string',
        default: 'NONE',
        alias: 'g',
      },
      transform: {
        type: 'string',
        default: 'FFT1D',
        alias: 'f',
      },
    },
    inferType: true,
  }
);

export interface Flags {
  help: boolean;
  version: boolean;
  encode: boolean;
  decode: boolean;
  message: string;
  size: number;
  copies: number;
  pass?: string;
  tolerance: number;
  grayscale: GrayscaleAlgorithm;
  transform: TransformAlgorithm;
}

export function normalize(flags: Result['flags']) {
  const { encode, decode, size, copies, tolerance } = flags;

  return {
    ...flags,
    size: parseInt(size, 10),
    copies: parseInt(copies, 10),
    tolerance: parseInt(tolerance, 10),
    encode: encode && !decode,
    decode,
  } as Flags;
}

export function validate({
  encode,
  message,
  size,
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags) {
  const radix = Math.log(size) / Math.log(2);

  if (!message && encode) {
    return '-m, --message is required';
  }
  if (isNaN(size) || size <= 0 || radix !== Math.floor(radix)) {
    return '-s, --size should be a postive radix-2 number';
  }
  if (isNaN(copies) || copies <= 0 || copies % 2 === 0) {
    return '-c, --copies should be a postive odd number';
  }
  if (isNaN(tolerance) || tolerance <= 0 || tolerance > 128) {
    return '-t, --tolerance should be a positive number between [0-128]';
  }
  if (!Object.keys(GrayscaleAlgorithm).includes(grayscale)) {
    return 'unknown grayscale algorithm';
  }
  if (!Object.keys(TransformAlgorithm).includes(transform)) {
    return 'unknown transform algorithm';
  }
  return '';
}

export function flags2Options({
  message,
  size,
  pass = '',
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags) {
  return {
    text: message,
    clip: 0,
    size,
    pass,
    copies,
    tolerance,
    grayscaleAlgorithm: grayscale,
    transformAlgorithm: transform,
  } as EncodeOptions & DecodeOptions;
}

export async function run() {
  const flags = normalize(cli.flags);

  if (flags.help) {
    process.stdout.write(cli.help);
    process.exit(0);
  } else if (flags.version) {
    process.stdout.write(`${pkg.version}\n`);
    process.exit(0);
  }

  const errMsg = validate(flags);

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
