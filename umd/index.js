(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.stego = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function clamp(v, min, max) {
        if (v < min) {
            console.warn(`clamp min: ${v}`);
            return min;
        }
        if (v > max) {
            console.warn(`clamp max: ${v}`);
            return max;
        }
        return v;
    }
    function hash(input) {
        let code = 0;
        if (input.length === 0)
            return code;
        for (let i = 0; i < input.length; i += 1) {
            const char = input.charCodeAt(i);
            code = (code << 5) - code + char;
            code = code & code; // Convert to 32bit integer
        }
        return code;
    }
    function hashCode(input, mod, inArray) {
        let prob = 1;
        let code = hash(input);
        let index = Math.abs(code) % mod;
        while (inArray[index]) {
            index = (index + prob * prob) % mod;
            prob = prob > mod / 2 ? 1 : prob + 1;
        }
        inArray[index] = 1;
        return [index, String(code)];
    }
    function filterIndices(size, predicator) {
        const indices = [];
        for (let i = 0; i < size * size; i += 1) {
            if (predicator(i)) {
                indices.push(i);
            }
        }
        return indices;
    }
    function squareCircleIntersect(size, radius) {
        const mid = (size + 1) / 2 - 1;
        return filterIndices(size, i => {
            const x = Math.floor(i / size);
            const y = i % size;
            return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
        });
    }

    // more grayscale algorithm:
    // http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
    var GrayscaleAlgorithm;
    (function (GrayscaleAlgorithm) {
        GrayscaleAlgorithm["NONE"] = "NONE";
        GrayscaleAlgorithm["AVERAGE"] = "AVG";
        GrayscaleAlgorithm["LUMINANCE"] = "LUMA";
        GrayscaleAlgorithm["LUMINANCE_II"] = "LUMA_II";
        GrayscaleAlgorithm["DESATURATION"] = "DESATURATION";
        GrayscaleAlgorithm["MAX_DECOMPOSITION"] = "MAX_DE";
        GrayscaleAlgorithm["MIN_DECOMPOSITION"] = "MIN_DE";
        GrayscaleAlgorithm["MID_DECOMPOSITION"] = "MID_DE";
        GrayscaleAlgorithm["SIGNLE_R"] = "R";
        GrayscaleAlgorithm["SIGNLE_G"] = "G";
        GrayscaleAlgorithm["SIGNLE_B"] = "B";
    })(GrayscaleAlgorithm || (GrayscaleAlgorithm = {}));
    function grayscale(r, g, b, algorithm) {
        switch (algorithm) {
            case GrayscaleAlgorithm.AVERAGE:
                return (r + g + b) / 3;
            case GrayscaleAlgorithm.LUMINANCE:
                return r * 0.3 + g * 0.59 + b * 0.11;
            case GrayscaleAlgorithm.LUMINANCE_II:
                return r * 0.2126 + g * 0.7152 + b * 0.0722;
            case GrayscaleAlgorithm.DESATURATION:
                return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
            case GrayscaleAlgorithm.MAX_DECOMPOSITION:
                return Math.max(r, g, b);
            case GrayscaleAlgorithm.MIN_DECOMPOSITION:
                return Math.min(r, g, b);
            case GrayscaleAlgorithm.MID_DECOMPOSITION:
                return [r, g, b].sort()[1];
            case GrayscaleAlgorithm.SIGNLE_R:
                return r;
            case GrayscaleAlgorithm.SIGNLE_G:
                return g;
            case GrayscaleAlgorithm.SIGNLE_B:
                return b;
            default:
                return 0;
        }
    }
    function narrow(gray, size) {
        return clamp(Math.round(gray), size, 255 - size);
    }

    /// fft.js
    /**
     * Fast Fourier Transform module
     * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
     */
    var FFT = {};
    var version = {
      release: '0.3.0',
      date: '2013-03',
    };
    FFT.toString = function() {
      return 'version ' + version.release + ', released ' + version.date;
    };

    // core operations
    var _n = 0, // order
      _bitrev = null, // bit reversal table
      _cstb = null; // sin/cos table
    var core = {
      init: function(n) {
        if (n !== 0 && (n & (n - 1)) === 0) {
          _n = n;
          core._initArray();
          core._makeBitReversalTable();
          core._makeCosSinTable();
        } else {
          throw new Error('init: radix-2 required');
        }
      },
      // 1D-FFT
      fft1d: function(re, im) {
        core.fft(re, im, 1);
      },
      // 1D-IFFT
      ifft1d: function(re, im) {
        var n = 1 / _n;
        core.fft(re, im, -1);
        for (var i = 0; i < _n; i++) {
          re[i] *= n;
          im[i] *= n;
        }
      },
      // 2D-FFT
      fft2d: function(re, im) {
        var tre = [],
          tim = [],
          i = 0;
        // x-axis
        for (var y = 0; y < _n; y++) {
          i = y * _n;
          for (var x1 = 0; x1 < _n; x1++) {
            tre[x1] = re[x1 + i];
            tim[x1] = im[x1 + i];
          }
          core.fft1d(tre, tim);
          for (var x2 = 0; x2 < _n; x2++) {
            re[x2 + i] = tre[x2];
            im[x2 + i] = tim[x2];
          }
        }
        // y-axis
        for (var x = 0; x < _n; x++) {
          for (var y1 = 0; y1 < _n; y1++) {
            i = x + y1 * _n;
            tre[y1] = re[i];
            tim[y1] = im[i];
          }
          core.fft1d(tre, tim);
          for (var y2 = 0; y2 < _n; y2++) {
            i = x + y2 * _n;
            re[i] = tre[y2];
            im[i] = tim[y2];
          }
        }
      },
      // 2D-IFFT
      ifft2d: function(re, im) {
        var tre = [],
          tim = [],
          i = 0;
        // x-axis
        for (var y = 0; y < _n; y++) {
          i = y * _n;
          for (var x1 = 0; x1 < _n; x1++) {
            tre[x1] = re[x1 + i];
            tim[x1] = im[x1 + i];
          }
          core.ifft1d(tre, tim);
          for (var x2 = 0; x2 < _n; x2++) {
            re[x2 + i] = tre[x2];
            im[x2 + i] = tim[x2];
          }
        }
        // y-axis
        for (var x = 0; x < _n; x++) {
          for (var y1 = 0; y1 < _n; y1++) {
            i = x + y1 * _n;
            tre[y1] = re[i];
            tim[y1] = im[i];
          }
          core.ifft1d(tre, tim);
          for (var y2 = 0; y2 < _n; y2++) {
            i = x + y2 * _n;
            re[i] = tre[y2];
            im[i] = tim[y2];
          }
        }
      },
      // core operation of FFT
      fft: function(re, im, inv) {
        var d,
          h,
          ik,
          m,
          tmp,
          wr,
          wi,
          xr,
          xi,
          n4 = _n >> 2;
        // bit reversal
        for (var l = 0; l < _n; l++) {
          m = _bitrev[l];
          if (l < m) {
            tmp = re[l];
            re[l] = re[m];
            re[m] = tmp;
            tmp = im[l];
            im[l] = im[m];
            im[m] = tmp;
          }
        }
        // butterfly operation
        for (var k = 1; k < _n; k <<= 1) {
          h = 0;
          d = _n / (k << 1);
          for (var j = 0; j < k; j++) {
            wr = _cstb[h + n4];
            wi = inv * _cstb[h];
            for (var i = j; i < _n; i += k << 1) {
              ik = i + k;
              xr = wr * re[ik] + wi * im[ik];
              xi = wr * im[ik] - wi * re[ik];
              re[ik] = re[i] - xr;
              re[i] += xr;
              im[ik] = im[i] - xi;
              im[i] += xi;
            }
            h += d;
          }
        }
      },
      // initialize the array (supports TypedArray)
      _initArray: function() {
        if (typeof Uint8Array !== 'undefined') {
          _bitrev = new Uint8Array(_n);
        } else {
          _bitrev = [];
        }
        if (typeof Float64Array !== 'undefined') {
          _cstb = new Float64Array(_n * 1.25);
        } else {
          _cstb = [];
        }
      },
      // zero padding
      _paddingZero: function() {
        // TODO
      },
      // makes bit reversal table
      _makeBitReversalTable: function() {
        var i = 0,
          j = 0,
          k = 0;
        _bitrev[0] = 0;
        while (++i < _n) {
          k = _n >> 1;
          while (k <= j) {
            j -= k;
            k >>= 1;
          }
          j += k;
          _bitrev[i] = j;
        }
      },
      // makes trigonometiric function table
      _makeCosSinTable: function() {
        var n2 = _n >> 1,
          n4 = _n >> 2,
          n8 = _n >> 3,
          n2p4 = n2 + n4,
          t = Math.sin(Math.PI / _n),
          dc = 2 * t * t,
          ds = Math.sqrt(dc * (2 - dc)),
          c = (_cstb[n4] = 1),
          s = (_cstb[0] = 0);
        t = 2 * dc;
        for (var i = 1; i < n8; i++) {
          c -= dc;
          dc += t * c;
          s += ds;
          ds -= t * s;
          _cstb[i] = s;
          _cstb[n4 - i] = c;
        }
        if (n8 !== 0) {
          _cstb[n8] = Math.sqrt(0.5);
        }
        for (var j = 0; j < n4; j++) {
          _cstb[n2 - j] = _cstb[j];
        }
        for (var k = 0; k < n2p4; k++) {
          _cstb[k + n2] = -_cstb[k];
        }
      },
    };
    // aliases (public APIs)
    var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
    for (var i = 0; i < apis.length; i++) {
      FFT[apis[i]] = core[apis[i]];
    }
    FFT.fft = core.fft1d;
    FFT.ifft = core.ifft1d;

    // MORE:
    // https://en.wikipedia.org/wiki/JPEG
    const ONE_SQUARE_ROOT_OF_TWO = 1 / Math.sqrt(2);
    // type-II DCT
    function dct(nums, size = 8) {
        const coefficients = [];
        for (let v = 0; v < size; v += 1) {
            for (let u = 0; u < size; u += 1) {
                const au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                const av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                let sum = 0;
                for (let y = 0; y < size; y += 1) {
                    for (let x = 0; x < size; x += 1) {
                        sum +=
                            nums[y * size + x] *
                                Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
                                Math.cos(((2 * y + 1) * v * Math.PI) / 16);
                    }
                }
                coefficients.push((sum * au * av) / 4);
            }
        }
        // in-place update
        for (let i = 0; i < coefficients.length; i += 1) {
            nums[i] = coefficients[i];
        }
    }
    // type-III DCT
    function idct(coefficients, size = 8) {
        const nums = [];
        for (let y = 0; y < size; y += 1) {
            for (let x = 0; x < size; x += 1) {
                let sum = 0;
                for (let v = 0; v < size; v += 1) {
                    for (let u = 0; u < size; u += 1) {
                        const au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                        const av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                        sum +=
                            au *
                                av *
                                coefficients[v * size + u] *
                                Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
                                Math.cos(((2 * y + 1) * v * Math.PI) / 16);
                    }
                }
                nums.push(sum / 4);
            }
        }
        // in-place update
        for (let i = 0; i < nums.length; i += 1) {
            coefficients[i] = nums[i];
        }
    }

    var TransformAlgorithm;
    (function (TransformAlgorithm) {
        TransformAlgorithm["FFT1D"] = "FFT1D";
        TransformAlgorithm["FFT2D"] = "FFT2D";
        TransformAlgorithm["DCT"] = "DCT";
    })(TransformAlgorithm || (TransformAlgorithm = {}));
    function transform(re, im, algorithm, { size }) {
        switch (algorithm) {
            case TransformAlgorithm.FFT1D:
                FFT.init(size);
                FFT.fft1d(re, im);
                break;
            case TransformAlgorithm.FFT2D:
                FFT.init(size);
                FFT.fft2d(re, im);
                break;
            case TransformAlgorithm.DCT:
                dct(re, size);
                break;
            default:
                throw new Error(`unknown algorithm: ${algorithm}`);
        }
    }
    function inverseTransform(re, im, algorithm, { size }) {
        switch (algorithm) {
            case TransformAlgorithm.FFT1D:
                FFT.init(size);
                FFT.ifft1d(re, im);
                break;
            case TransformAlgorithm.FFT2D:
                FFT.init(size);
                FFT.ifft2d(re, im);
                break;
            case TransformAlgorithm.DCT:
                idct(re, size);
                break;
            default:
                throw new Error(`unknown algorithm: ${algorithm}`);
        }
    }

    function createDOMCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    function url2Img(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const { width, height } = image;
                const ctx = createDOMCanvas(width, height).getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);
                resolve(ctx.getImageData(0, 0, width, height));
            };
            image.onerror = err => reject(err);
            image.src = url;
        });
    }
    function img2Blob(imgData, width = imgData.width, height = imgData.height) {
        const canvas = createDOMCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
        return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/png'));
    }
    function blob2Img(imgBlob) {
        return url2Img(URL.createObjectURL(imgBlob));
    }

    function updateImg(imgData, block, { p, c }, { size }) {
        const { width } = imgData;
        const h1 = Math.floor(p / Math.floor(width / size)) * size;
        const w1 = (p % Math.floor(width / size)) * size;
        for (let i = 0; i < block.length; i += 1) {
            const h2 = Math.floor(i / size);
            const w2 = i % size;
            imgData.data[((h1 + h2) * width + w1 + w2) * 4 + c] = clamp(Math.round(block[i]), 0, 255);
        }
    }
    function* divideImg(imgData, { size }) {
        const { width, height, data } = imgData;
        for (let h = 0; h < height; h += size) {
            for (let w = 0; w < width; w += size) {
                if (h + size <= height && w + size <= width) {
                    for (let c = 0; c < 3; c += 1) {
                        const block = [];
                        for (let h1 = 0; h1 < size; h1 += 1) {
                            for (let w1 = 0; w1 < size; w1 += 1) {
                                block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
                            }
                        }
                        yield block;
                    }
                }
            }
        }
    }
    function decolorImg(imgData, { grayscaleAlgorithm }) {
        const { width, height, data } = imgData;
        const length = width * height;
        for (let i = 0; i < length; i += 1) {
            const p = i * 4;
            const g = grayscale(data[p], data[p + 1], data[p + 2], grayscaleAlgorithm);
            data[p] = g;
            data[p + 1] = g;
            data[p + 2] = g;
        }
    }
    function narrowImg(imgData, { narrow: narrowSize }) {
        const { width, height, data } = imgData;
        const length = width * height;
        for (let i = 0; i < length; i += 1) {
            const p = i * 4;
            data[p] = narrow(data[p], narrowSize);
            data[p + 1] = narrow(data[p + 1], narrowSize);
            data[p + 2] = narrow(data[p + 2], narrowSize);
        }
    }
    function walkImg(imgData, options, callback) {
        let c = 0;
        let p = 0;
        let b = 0;
        for (const block of divideImg(imgData, options)) {
            callback(block, { c, p, b });
            c += 1;
            b += 1;
            if (c === 3) {
                p += 1;
                c = 0;
            }
        }
    }

    function createAcc({ size, transformAlgorithm }) {
        switch (transformAlgorithm) {
            case TransformAlgorithm.FFT1D:
                return {
                    prevPos: -1,
                    prevCode: '',
                    indices: squareCircleIntersect(size, 3),
                };
            default:
                return {
                    prevPos: -1,
                    prevCode: '',
                    indices: [],
                };
        }
    }
    function getPosFromAcc(acc, { c }, { pass }) {
        const { prevCode, prevPos, indices } = acc;
        if (c !== 0) {
            return prevPos;
        }
        const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, []);
        acc.prevCode = code;
        acc.prevPos = indices[index];
        return indices[index];
    }
    function getPos(acc, loc, options) {
        const { pass, size, transformAlgorithm } = options;
        switch (transformAlgorithm) {
            case TransformAlgorithm.FFT1D:
                return pass
                    ? getPosFromAcc(acc, loc, options)
                    : (size * size) / 2 + size / 2;
            case TransformAlgorithm.FFT2D:
                return 0;
            case TransformAlgorithm.DCT:
                return 0;
            default:
                throw new Error(`unknown algortihm: ${transformAlgorithm}`);
        }
    }

    function str2bits(text, copies) {
        const chars = text.split('');
        const bits = [];
        const pushByte = (byte, n) => {
            for (let i = 0; i < 8; i += 1) {
                let j = 0;
                while (j++ < n) {
                    bits.push(byte[i]);
                }
            }
        };
        for (let i = 0; i < chars.length; i += 1) {
            const codes = encodeURI(chars[i]).split('');
            for (let j = 0; j < codes.length; j += 1) {
                const byte = [];
                let reminder = 0;
                let code = codes[j].charCodeAt(0);
                do {
                    reminder = (code % 2);
                    byte.push(reminder);
                    code = code - Math.floor(code / 2) - reminder;
                } while (code > 1);
                byte.push(code);
                while (byte.length < 8) {
                    byte.push(0);
                }
                pushByte(byte.reverse(), copies);
            }
        }
        return bits;
    }
    function bits2str(bits, copies) {
        let k = 128;
        let temp = 0;
        const chars = [];
        const candidates = [];
        const elect = () => candidates.filter(c => c === 1).length >= copies / 2 ? 1 : 0;
        for (let i = 0; i < bits.length; i += 1) {
            candidates.push(bits[i]);
            if (candidates.length === copies) {
                temp += elect() * k;
                k /= 2;
                candidates.length = 0;
                // end of message
                if (temp === 255) {
                    break;
                }
                if (k < 1) {
                    chars.push(String.fromCharCode(temp));
                    temp = 0;
                    k = 128;
                }
            }
        }
        try {
            return decodeURI(chars.join(''));
        }
        catch (e) {
            return '';
        }
    }
    function mergeBits(dest, ...src) {
        let k = 0;
        for (let i = 0; i < src.length; i += 1) {
            const bits = src[i];
            for (let j = 0; j < bits.length && k < dest.length; j += 1, k += 1) {
                dest[k] = bits[j];
            }
        }
        return dest;
    }
    function createBits(size) {
        const bits = new Array(size).fill(0);
        for (let i = 0; i < size; i += 1) {
            bits[i] = Math.floor(Math.random() * 2);
        }
        return bits;
    }
    function getBit(block, acc, loc, options) {
        const pos = getPos(acc, loc, options);
        const { tolerance } = options;
        return Math.abs(Math.round(block[pos] / tolerance) % 2);
    }
    function setBit(block, bits, acc, loc, options) {
        const pos = getPos(acc, loc, options);
        const { b } = loc;
        const { tolerance } = options;
        const v = Math.floor(block[pos] / tolerance);
        if (bits[b]) {
            block[pos] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance;
        }
        else {
            block[pos] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance;
        }
    }

    function encode(img, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text, size, narrow, copies, grayscaleAlgorithm, transformAlgorithm, noClipEdgePixels, } = options;
            const imgData =  yield blob2Img(img);
            const { width, height } = imgData;
            const sizeOfRowBlocks = Math.floor(width / size);
            const sizeOfColumnBlocks = Math.floor(height / size);
            const sizeOfBlocks = sizeOfRowBlocks * sizeOfColumnBlocks * 3;
            const textBits = str2bits(text, copies);
            const bits = mergeBits(createBits(sizeOfBlocks), textBits, createBits(8 * copies).fill(1) // end of message
            );
            if (textBits.length + 8 * copies > sizeOfBlocks) {
                process.stderr.write('bits overflow! try to shrink text or reduce copies.\n');
            }
            if (grayscaleAlgorithm !== GrayscaleAlgorithm.NONE) {
                decolorImg(imgData, options);
            }
            if (narrow > 0) {
                narrowImg(imgData, options);
            }
            const acc = createAcc(options);
            walkImg(imgData, options, (block, loc) => {
                const re = block;
                const im = new Array(size * size).fill(0);
                transform(re, im, transformAlgorithm, options);
                setBit(re, bits, acc, loc, options);
                inverseTransform(re, im, transformAlgorithm, options);
                updateImg(imgData, re, loc, options);
            });
            return img2Blob(imgData, noClipEdgePixels ? width : sizeOfRowBlocks * size, noClipEdgePixels ? height : sizeOfColumnBlocks * size);
        });
    }
    function decode(img, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { size, copies, transformAlgorithm } = options;
            const imgData =  yield blob2Img(img);
            const bits = [];
            const acc = createAcc(options);
            walkImg(imgData, options, (block, loc) => {
                const re = block;
                const im = new Array(size * size).fill(0);
                transform(re, im, transformAlgorithm, options);
                bits.push(getBit(re, acc, loc, options));
            });
            return bits2str(bits, copies);
        });
    }

    exports.decode = decode;
    exports.encode = encode;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
