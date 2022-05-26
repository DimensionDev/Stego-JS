#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const meow_1 = __importDefault(require("meow"));
const fs_1 = require("fs");
const helper_1 = require("../utils/helper");
const node_1 = require("../node");
const constant_1 = require("../constant");
const flag_1 = require("./flag");
const cli = (0, meow_1.default)(`Usage
  $ cat <input> | ${constant_1.CLI_NAME} [options...] > <output>

Options
  -h, --help             Print help message.
  -v, --version          Print version message.
  
  -e, --encode           Encode message into given image.
  -d, --decode           Decode message from given image.

  -m, --message          Specify the message to be encoded.
  -p, --pass             Specify the seed text for generating random encoding position when using 'FFT1D'.
  -t, --tolerance        Specify the number to be added into wave amplitude:
                            For ${node_1.AlgorithmVersion.V1}: ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V1].FFT1D} (default for FFT1D), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V1].FFT2D} (default for FFT2D), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V1].fastDCT} (default for fastDCT), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V1].DCT} (default for DCT).
                            For ${node_1.AlgorithmVersion.V1}: ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V2].FFT1D} (default for FFT1D), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V2].FFT2D} (default for FFT2D), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V2].fastDCT} (default for fastDCT), ${constant_1.DEFAULT_TOLERANCE[node_1.AlgorithmVersion.V2].DCT} (default for DCT).
  -s, --size             Size of encoding block with radix-2 required: ${constant_1.DEFAULT_SIZE} (default).
  -c, --copies           Size of duplications with odd numbers required: ${constant_1.DEFAULT_COPIES} (default).
  -g, --grayscale        Specify grayscale algorithm: 'NONE' (default), 'AVG', 'LUMA', 'LUMA_II', 'DESATURATION', 'MAX_DE', 'MIN_DE', 'MID_DE', 'R', 'G', 'B'.
  -f, --transform        Specify transform algorithm: 'FFT1D' (default), 'FFT2D', 'DCT', 'fastDCT'.
      --exhaustPixels    Encode pixels in rest of image (default is ${constant_1.DEFAULT_EXHAUST_PIXELS}).
      --fakeMaskPixels   Encode fake pixels into mask area (default is ${constant_1.DEFAULT_FAKE_MASK_PIXELS})
      --cropEdgePixels   Crop edge pixels (default is ${constant_1.DEFAULT_CROP_EDGE_PIXELS}).
      --algorithmVersion Specify algorithm version: 0.11.x, 0.12.x (default is ${constant_1.DEFAULT_ALGORITHM_VERSION})
      --verbose          Print debug information

Examples
  $ cat ./input.png | ${constant_1.CLI_NAME} -e -m 'hello world' > output.png
  $ cat ./output.png | ${constant_1.CLI_NAME} -d
`, {
    flags: flag_1.flags,
    inferType: true,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const flags = (0, flag_1.normalizeFlags)(cli.flags);
        if (!flags.encode && !flags.decode) {
            process.stdout.write(`${cli.help}\n`);
            process.exit(0);
        }
        const errMsg = (0, flag_1.validateFlags)(flags);
        if (errMsg) {
            process.stderr.write(`${errMsg}\n`);
            process.exit(1);
        }
        const options = (0, flag_1.flags2Options)(flags);
        const imgBuf = flags.encode || flags.decode ? yield (0, helper_1.rs2Buf)(process.stdin) : null;
        const maskBuf = flags.mask ? yield (0, helper_1.rs2Buf)((0, fs_1.createReadStream)(flags.mask)) : Buffer.from(constant_1.DEFAULT_MASK);
        if (flags.encode && imgBuf) {
            process.stdout.write(new Uint8Array(yield (0, node_1.encode)(imgBuf, maskBuf, options)));
        }
        else if (flags.decode && imgBuf) {
            process.stdout.write(yield (0, node_1.decode)(imgBuf, maskBuf, options));
        }
    });
}
exports.run = run;
run();
//# sourceMappingURL=cli.js.map