"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var meow_1 = __importDefault(require("meow"));
var grayscale_1 = require("./grayscale");
var transform_1 = require("./transform");
var helper_1 = require("./helper");
var _1 = require(".");
var package_json_1 = __importDefault(require("../package.json"));
var CLI_NAME = 'stego';
var cli = meow_1["default"]("Usage\n  $ cat <input> | " + CLI_NAME + " [...options] > <output>\n\nOptions\n  -h, --help       Print help message\n  -v, --version    Print version message\n  -e, --encode     Encode message into given image\n  -d, --decode     Decode message from given image\n  -m, --message    Specify the message\n  -s, --size       Size of encoding block with radix-2 required: 8 (default).\n  -c, --copies     Encode duplicate messages in order to survive from\n                   compression attack with odd numbers required: 3 (default).\n  -t, --tolerance  The robustness level to compression.\n  -p, --pass       A seed text for generating random encoding position\n                   for specific algorithm ('FFT1D').\n  -g, --grayscale  Specify grayscale algorithm: 'NONE' (default), 'AVG',\n                   'LUMA', 'LUMA_II', 'DESATURATION', 'MAX_DE',\n                   'MIN_DE', 'MID_DE', 'R', 'G', 'B'.\n  -f, --transform  Specify transform algorithm: 'FFT1D' (default), 'FFT2D'\n\nExamples\n  $ cat ./input.png | " + CLI_NAME + " -e -m 'hello world' > output.png\n  $ cat ./output.png | " + CLI_NAME + " -d\n", {
    flags: {
        help: {
            type: 'boolean',
            "default": false,
            alias: 'h'
        },
        version: {
            type: 'boolean',
            "default": false,
            alias: 'v'
        },
        encode: {
            type: 'boolean',
            "default": false,
            alias: 'e'
        },
        decode: {
            type: 'boolean',
            "default": false,
            alias: 'd'
        },
        message: {
            type: 'string',
            "default": '',
            alias: 'm'
        },
        size: {
            type: 'string',
            "default": 8,
            alias: 's'
        },
        copies: {
            type: 'string',
            "default": 3,
            alias: 'c'
        },
        tolerance: {
            type: 'string',
            "default": 128,
            alias: 't'
        },
        pass: {
            type: 'string',
            "default": '',
            alias: 'p'
        },
        grayscale: {
            type: 'string',
            "default": 'NONE',
            alias: 'g'
        },
        transform: {
            type: 'string',
            "default": 'FFT1D',
            alias: 'f'
        }
    },
    inferType: true
});
function normalize(flags) {
    var encode = flags.encode, decode = flags.decode, size = flags.size, copies = flags.copies, tolerance = flags.tolerance;
    return __assign(__assign({}, flags), { size: parseInt(size, 10), copies: parseInt(copies, 10), tolerance: parseInt(tolerance, 10), encode: encode && !decode, decode: decode });
}
exports.normalize = normalize;
function validate(_a) {
    var encode = _a.encode, message = _a.message, size = _a.size, copies = _a.copies, tolerance = _a.tolerance, grayscale = _a.grayscale, transform = _a.transform;
    var radix = Math.log(size) / Math.log(2);
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
    if (!Object.keys(grayscale_1.GrayscaleAlgorithm).includes(grayscale)) {
        return 'unknown grayscale algorithm';
    }
    if (!Object.keys(transform_1.TransformAlgorithm).includes(transform)) {
        return 'unknown transform algorithm';
    }
    return '';
}
exports.validate = validate;
function flags2Options(_a) {
    var message = _a.message, size = _a.size, _b = _a.pass, pass = _b === void 0 ? '' : _b, copies = _a.copies, tolerance = _a.tolerance, grayscale = _a.grayscale, transform = _a.transform;
    return {
        text: message,
        clip: 0,
        size: size,
        pass: pass,
        copies: copies,
        tolerance: tolerance,
        grayscaleAlgorithm: grayscale,
        transformAlgorithm: transform
    };
}
exports.flags2Options = flags2Options;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var flags, errMsg, options, imgBuf, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    flags = normalize(cli.flags);
                    if (flags.help) {
                        process.stdout.write(cli.help);
                        process.exit(0);
                    }
                    else if (flags.version) {
                        process.stdout.write(package_json_1["default"].version + "\n");
                        process.exit(0);
                    }
                    errMsg = validate(flags);
                    if (errMsg) {
                        process.stderr.write(errMsg + "\n");
                        process.exit(1);
                    }
                    options = flags2Options(flags);
                    if (!(flags.encode || flags.decode)) return [3 /*break*/, 2];
                    return [4 /*yield*/, helper_1.rs2Buf(process.stdin)];
                case 1:
                    _a = _f.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _f.label = 3;
                case 3:
                    imgBuf = _a;
                    if (!flags.encode) return [3 /*break*/, 5];
                    _c = (_b = process.stdout).write;
                    return [4 /*yield*/, _1.encode(imgBuf, options)];
                case 4:
                    _c.apply(_b, [_f.sent()]);
                    return [3 /*break*/, 7];
                case 5:
                    if (!flags.decode) return [3 /*break*/, 7];
                    _e = (_d = process.stdout).write;
                    return [4 /*yield*/, _1.decode(imgBuf, options)];
                case 6:
                    _e.apply(_d, [_f.sent()]);
                    _f.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
