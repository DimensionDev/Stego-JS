import meow from 'meow';
import { GrayscaleAlgorithm } from './grayscale';
import { TransformAlgorithm } from './transform';
import { rs2Buf } from './helper';
import { Options, encode, decode } from '.';

const CLI_NAME = 'stego';

const cli = meow(
  `Usage
  $ cat <input> | ${CLI_NAME} -e > <output>

Options
  -h, --help       Print help message
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
  -f, --transform  Specify transform algorithm: 'FFT1D' (default), 'FFT2D'

Examples
  $ cat ./input.png | stego -e -m 'hello world' > output.png
  $ cat ./output.png | stego -d
`,
  {
    flags: {
      encode: {
        type: 'boolean',
        default: true,
        alias: 'e',
      },
      decode: {
        type: 'boolean',
        default: false,
        alias: 'd',
      },
      message: {
        type: 'string',
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
    autoHelp: true,
    autoVersion: true,
    inferType: true,
  }
);

export interface Flags {
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

export function normalize(flags: any) {
  const { encode, decode } = flags;

  return {
    ...flags,
    encode: encode && !decode,
    decode,
  } as Flags;
}

export function validate({
  encode,
  message,
  size,
  copies,
  grayscale,
  transform,
}: Flags) {
  const radix = Math.log(size) / Math.log(2);

  if (!message && encode) {
    return '-m, --message is required';
  }
  if (size <= 0 || radix !== Math.floor(radix)) {
    return '-s, --size should be a postive radix-2 number';
  }
  if (copies <= 0 || copies % 2 === 0) {
    return '-c, --copies should be a postive odd number';
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
  pass,
  copies,
  tolerance,
  grayscale,
  transform,
}: Flags): Options {
  return {
    text: message,
    clip: 0,
    size,
    pass,
    copies,
    tolerance,
    grayscaleAlgorithm: grayscale,
    transformAlgorithm: transform,
  } as Options;
}

export async function run() {
  const flags = normalize(cli.flags);
  const errMsg = validate(flags);

  if (errMsg) {
    process.stderr.write(`${errMsg}\n`);
    process.exit(1);
  }

  const options = flags2Options(flags);
  const imgBuf = await rs2Buf(process.stdin);

  process.stdout.write(
    flags.encode ? await encode(imgBuf, options) : await decode(imgBuf, options)
  );
}
