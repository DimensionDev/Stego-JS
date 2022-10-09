(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@rgba-image/lanczos')) :
  typeof define === 'function' && define.amd ? define(['exports', '@rgba-image/lanczos'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stego = {}, global.lanczos));
})(this, (function (exports, lanczos) { 'use strict';

  function asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator$5(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function proxy({ algoithms , methods  }) {
      return {
          encode (image, mask, options) {
              return _asyncToGenerator$5(function*() {
                  const { data , height , width  } = yield algoithms[options.version].encode(methods.preprocessImage((yield methods.toImageData(image))), methods.preprocessImage((yield methods.toImageData(mask))), options);
                  return methods.toBuffer(data, height, width);
              })();
          },
          decode (image, mask, options) {
              return _asyncToGenerator$5(function*() {
                  return algoithms[options.version].decode((yield methods.toImageData(image)), (yield methods.toImageData(mask)), options);
              })();
          }
      };
  }

  function rand(min, max) {
      return Math.round(Math.random() * max + min);
  }
  function clamp(v, min, max) {
      if (v < min) return min;
      if (v > max) return max;
      return v;
  }
  function hash(input) {
      let code = 0;
      if (input.length === 0) return code;
      for(let i = 0; i < input.length; i += 1){
          const char = input.charCodeAt(i);
          code = (code << 5) - code + char;
          code = code & code // Convert to 32bit integer
          ;
      }
      return code;
  }
  function hashCode(input, mod, inArray) {
      let prob = 1;
      const code = hash(input);
      let index = Math.abs(code) % mod;
      while(inArray[index]){
          index = (index + prob * prob) % mod;
          prob = prob > mod / 2 ? 1 : prob + 1;
      }
      inArray[index] = 1;
      return [
          index,
          String(code)
      ];
  }
  function shuffleGroupBy3(nums, seed, unshuffle = false) {
      const shuffleHelper = new Array(nums.length / 3).fill(0).map((v, i)=>i);
      shuffle(shuffleHelper, seed, unshuffle);
      const shuffleRes = new Array(nums.length).fill(0).map((v, i)=>nums[3 * shuffleHelper[Math.floor(i / 3)] + i % 3]);
      nums.forEach((v, i)=>{
          nums[i] = shuffleRes[i];
      });
  }
  function unshuffleGroupBy3(nums, seed) {
      return shuffleGroupBy3(nums, seed, true);
  }
  function shuffle(nums, seed, unshuffle = false) {
      const swap = (a, b)=>([nums[a], nums[b]] = [
              nums[b],
              nums[a]
          ]);
      for(let i = unshuffle ? nums.length - 1 : 0; unshuffle && i >= 0 || !unshuffle && i < nums.length; i += unshuffle ? -1 : 1){
          swap(seed[i % seed.length] % nums.length, i);
      }
  }
  function filterIndices(size, predicator) {
      const indices = [];
      for(let i = 0; i < size * size; i += 1){
          if (predicator(i)) {
              indices.push(i);
          }
      }
      return indices;
  }
  function squareCircleIntersect(size, radius) {
      const mid = (size + 1) / 2 - 1;
      return filterIndices(size, (i)=>{
          const x = Math.floor(i / size);
          const y = i % size;
          return Math.sqrt(Math.pow(mid - x, 2) + Math.pow(mid - y, 2)) <= radius;
      });
  }
  function isJPEG(buf) {
      if (!buf || buf.length < 3) {
          return false;
      }
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  function isPNG(buf) {
      if (!buf || buf.length < 8) {
          return false;
      }
      return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a;
  }
  function imgType(buf) {
      if (isJPEG(buf)) {
          return 'image/jpeg';
      } else if (isPNG(buf)) {
          return 'image/png';
      }
      return undefined;
  }

  /**
   * Locator to coord of top left pixel inside block
   * @param locator
   * @param options
   */ function loc2coord({ p , w  }, { size  }) {
      return [
          p % Math.floor(w / size) * size,
          Math.floor(p / Math.floor(w / size)) * size
      ];
  }
  /**
   * Locator to pixel index
   * @param locator
   * @param options
   * @param x1 x coord of top left pixel inside block
   * @param y1 y coord of top left pixel inside block
   * @param index the index of pixel inside block
   */ function loc2idx({ w , c  }, { size  }, x1, y1, index) {
      const x2 = index % size;
      const y2 = Math.floor(index / size);
      return ((y1 + y2) * w + x1 + x2) * 4 + c;
  }

  /// fft.js
  /**
   * Fast Fourier Transform module
   * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
   */ var FFT = {};
  var version = {
      release: '0.3.0',
      date: '2013-03'
  };
  FFT.toString = function() {
      return 'version ' + version.release + ', released ' + version.date;
  };
  // core operations
  var _n = 0, _bitrev = null, _cstb = null // sin/cos table
  ;
  var core = {
      init: function(n) {
          if (n !== 0 && (n & n - 1) === 0) {
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
          for(var i = 0; i < _n; i += 1){
              re[i] *= n;
              im[i] *= n;
          }
      },
      // 2D-FFT
      fft2d: function(re, im) {
          var tre = [], tim = [], i = 0;
          // x-axis
          for(var y = 0; y < _n; y += 1){
              i = y * _n;
              for(var x1 = 0; x1 < _n; x1 += 1){
                  tre[x1] = re[x1 + i];
                  tim[x1] = im[x1 + i];
              }
              core.fft1d(tre, tim);
              for(var x2 = 0; x2 < _n; x2 += 1){
                  re[x2 + i] = tre[x2];
                  im[x2 + i] = tim[x2];
              }
          }
          // y-axis
          for(var x = 0; x < _n; x += 1){
              for(var y1 = 0; y1 < _n; y1 += 1){
                  i = x + y1 * _n;
                  tre[y1] = re[i];
                  tim[y1] = im[i];
              }
              core.fft1d(tre, tim);
              for(var y2 = 0; y2 < _n; y2 += 1){
                  i = x + y2 * _n;
                  re[i] = tre[y2];
                  im[i] = tim[y2];
              }
          }
      },
      // 2D-IFFT
      ifft2d: function(re, im) {
          var tre = [], tim = [], i = 0;
          // x-axis
          for(var y = 0; y < _n; y += 1){
              i = y * _n;
              for(var x1 = 0; x1 < _n; x1 += 1){
                  tre[x1] = re[x1 + i];
                  tim[x1] = im[x1 + i];
              }
              core.ifft1d(tre, tim);
              for(var x2 = 0; x2 < _n; x2 += 1){
                  re[x2 + i] = tre[x2];
                  im[x2 + i] = tim[x2];
              }
          }
          // y-axis
          for(var x = 0; x < _n; x += 1){
              for(var y1 = 0; y1 < _n; y1 += 1){
                  i = x + y1 * _n;
                  tre[y1] = re[i];
                  tim[y1] = im[i];
              }
              core.ifft1d(tre, tim);
              for(var y2 = 0; y2 < _n; y2 += 1){
                  i = x + y2 * _n;
                  re[i] = tre[y2];
                  im[i] = tim[y2];
              }
          }
      },
      // core operation of FFT
      fft: function(re, im, inv) {
          var d, h, ik, m, tmp, wr, wi, xr, xi, n4 = _n >> 2;
          // bit reversal
          for(var l = 0; l < _n; l += 1){
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
          for(var k = 1; k < _n; k <<= 1){
              h = 0;
              d = _n / (k << 1);
              for(var j = 0; j < k; j += 1){
                  wr = _cstb[h + n4];
                  wi = inv * _cstb[h];
                  for(var i = j; i < _n; i += k << 1){
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
          var i = 0, j = 0, k = 0;
          _bitrev[0] = 0;
          while((i += 1) < _n){
              k = _n >> 1;
              while(k <= j){
                  j -= k;
                  k >>= 1;
              }
              j += k;
              _bitrev[i] = j;
          }
      },
      // makes trigonometiric function table
      _makeCosSinTable: function() {
          var n2 = _n >> 1, n4 = _n >> 2, n8 = _n >> 3, n2p4 = n2 + n4, t = Math.sin(Math.PI / _n), dc = 2 * t * t, ds = Math.sqrt(dc * (2 - dc)), c = _cstb[n4] = 1, s = _cstb[0] = 0;
          t = 2 * dc;
          for(var i = 1; i < n8; i += 1){
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
          for(var j = 0; j < n4; j += 1){
              _cstb[n2 - j] = _cstb[j];
          }
          for(var k = 0; k < n2p4; k += 1){
              _cstb[k + n2] = -_cstb[k];
          }
      }
  };
  // aliases (public APIs)
  var apis = [
      'init',
      'fft1d',
      'ifft1d',
      'fft2d',
      'ifft2d'
  ];
  for(var i = 0; i < apis.length; i += 1){
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
      for(let v = 0; v < size; v += 1){
          for(let u = 0; u < size; u += 1){
              const au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
              const av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
              let sum = 0;
              for(let y = 0; y < size; y += 1){
                  for(let x = 0; x < size; x += 1){
                      sum += nums[y * size + x] * Math.cos((2 * x + 1) * u * Math.PI / 16) * Math.cos((2 * y + 1) * v * Math.PI / 16);
                  }
              }
              coefficients.push(sum * au * av / 4);
          }
      }
      // in-place update
      for(let i = 0; i < coefficients.length; i += 1){
          nums[i] = coefficients[i];
      }
  }
  // type-III DCT
  function idct(coefficients, size = 8) {
      const nums = [];
      for(let y = 0; y < size; y += 1){
          for(let x = 0; x < size; x += 1){
              let sum = 0;
              for(let v = 0; v < size; v += 1){
                  for(let u = 0; u < size; u += 1){
                      const au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                      const av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1;
                      sum += au * av * coefficients[v * size + u] * Math.cos((2 * x + 1) * u * Math.PI / 16) * Math.cos((2 * y + 1) * v * Math.PI / 16);
                  }
              }
              nums.push(sum / 4);
          }
      }
      // in-place update
      for(let i = 0; i < nums.length; i += 1){
          coefficients[i] = nums[i];
      }
  }

  /*
   * Fast discrete cosine transform algorithms (TypeScript)
   *
   * Copyright (c) 2020 Project Nayuki. (MIT License)
   * https://www.nayuki.io/page/fast-discrete-cosine-transform-algorithms
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of
   * this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
   * the Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   * - The above copyright notice and this permission notice shall be included in
   *   all copies or substantial portions of the Software.
   * - The Software is provided "as is", without warranty of any kind, express or
   *   implied, including but not limited to the warranties of merchantability,
   *   fitness for a particular purpose and noninfringement. In no event shall the
   *   authors or copyright holders be liable for any claim, damages or other
   *   liability, whether in an action of contract, tort or otherwise, arising from,
   *   out of or in connection with the Software or the use or other dealings in the
   *   Software.
   */ var fastDctLee;
  (function(fastDctLee) {
      function transform(vector) {
          const n = vector.length;
          if (n <= 0 || (n & n - 1) !== 0) throw 'Length must be power of 2';
          transformInternal(vector, 0, n, new Float64Array(n));
      }
      fastDctLee.transform = transform;
      function transformInternal(vector, off, len, temp) {
          if (len === 1) return;
          const halfLen = Math.floor(len / 2);
          for(let i = 0; i < halfLen; i += 1){
              const x = vector[off + i];
              const y = vector[off + len - 1 - i];
              temp[off + i] = x + y;
              temp[off + i + halfLen] = (x - y) / (Math.cos((i + 0.5) * Math.PI / len) * 2);
          }
          transformInternal(temp, off, halfLen, vector);
          transformInternal(temp, off + halfLen, halfLen, vector);
          for(let i1 = 0; i1 < halfLen - 1; i1 += 1){
              vector[off + i1 * 2 + 0] = temp[off + i1];
              vector[off + i1 * 2 + 1] = temp[off + i1 + halfLen] + temp[off + i1 + halfLen + 1];
          }
          vector[off + len - 2] = temp[off + halfLen - 1];
          vector[off + len - 1] = temp[off + len - 1];
      }
      function inverseTransform(vector) {
          const n = vector.length;
          if (n <= 0 || (n & n - 1) !== 0) throw 'Length must be power of 2';
          vector[0] /= 2;
          inverseTransformInternal(vector, 0, n, new Float64Array(n));
          // scale
          for(var i = 0; i < vector.length; i += 1)vector[i] /= vector.length / 2.0;
      }
      fastDctLee.inverseTransform = inverseTransform;
      function inverseTransformInternal(vector, off, len, temp) {
          if (len === 1) return;
          const halfLen = Math.floor(len / 2);
          temp[off + 0] = vector[off + 0];
          temp[off + halfLen] = vector[off + 1];
          for(let i = 1; i < halfLen; i += 1){
              temp[off + i] = vector[off + i * 2];
              temp[off + i + halfLen] = vector[off + i * 2 - 1] + vector[off + i * 2 + 1];
          }
          inverseTransformInternal(temp, off, halfLen, vector);
          inverseTransformInternal(temp, off + halfLen, halfLen, vector);
          for(let i1 = 0; i1 < halfLen; i1 += 1){
              const x = temp[off + i1];
              const y = temp[off + i1 + halfLen] / (Math.cos((i1 + 0.5) * Math.PI / len) * 2);
              vector[off + i1] = x + y;
              vector[off + len - 1 - i1] = x - y;
          }
      }
  })(fastDctLee || (fastDctLee = {}));

  exports.TransformAlgorithm = void 0;
  (function(TransformAlgorithm) {
      TransformAlgorithm["FFT1D"] = "FFT1D";
      TransformAlgorithm["FFT2D"] = "FFT2D";
      TransformAlgorithm["DCT"] = "DCT";
      TransformAlgorithm["FastDCT"] = 'fastDCT';
  })(exports.TransformAlgorithm || (exports.TransformAlgorithm = {}));
  function transform(re, im, algorithm, { size  }) {
      switch(algorithm){
          case exports.TransformAlgorithm.FFT1D:
              FFT.init(size);
              FFT.fft1d(re, im);
              break;
          case exports.TransformAlgorithm.FFT2D:
              FFT.init(size);
              FFT.fft2d(re, im);
              break;
          case exports.TransformAlgorithm.DCT:
              dct(re, size);
              break;
          case exports.TransformAlgorithm.FastDCT:
              fastDctLee.transform(re);
              break;
          default:
              throw new Error(`unknown algorithm in transform: ${algorithm}`);
      }
  }
  function inverseTransform(re, im, algorithm, { size  }) {
      switch(algorithm){
          case exports.TransformAlgorithm.FFT1D:
              FFT.init(size);
              FFT.ifft1d(re, im);
              break;
          case exports.TransformAlgorithm.FFT2D:
              FFT.init(size);
              FFT.ifft2d(re, im);
              break;
          case exports.TransformAlgorithm.DCT:
              idct(re, size);
              break;
          case exports.TransformAlgorithm.FastDCT:
              fastDctLee.inverseTransform(re);
              break;
          default:
              throw new Error(`unknown algorithm in inverseTransform: ${algorithm}`);
      }
  }

  exports.AlgorithmVersion = void 0;
  (function(AlgorithmVersion) {
      AlgorithmVersion["V1"] = "V1";
      AlgorithmVersion["V2"] = "V2";
  })(exports.AlgorithmVersion || (exports.AlgorithmVersion = {}));

  const CLI_NAME = 'stego-js';
  const MAX_WIDTH = 1960;
  const DEFAULT_NARROW = 0;
  const DEFAULT_COPIES = 3;
  const DEFAULT_PARAM_COPIES = 9;
  const DEFAULT_SIZE = 8;
  const TOLERANCE_NOT_SET = -1;
  const DEFAULT_TOLERANCE = {
      [exports.AlgorithmVersion.V1]: {
          [exports.TransformAlgorithm.DCT]: 100,
          [exports.TransformAlgorithm.FastDCT]: 500,
          [exports.TransformAlgorithm.FFT1D]: 128,
          [exports.TransformAlgorithm.FFT2D]: 500
      },
      [exports.AlgorithmVersion.V2]: {
          [exports.TransformAlgorithm.DCT]: 10,
          [exports.TransformAlgorithm.FastDCT]: 100,
          [exports.TransformAlgorithm.FFT1D]: 30,
          [exports.TransformAlgorithm.FFT2D]: 150
      }
  };
  const MAX_TOLERANCE = {
      [exports.TransformAlgorithm.DCT]: 5000,
      [exports.TransformAlgorithm.FastDCT]: 5000,
      [exports.TransformAlgorithm.FFT1D]: 5000,
      [exports.TransformAlgorithm.FFT2D]: 50000
  };
  const DEFAULT_FAKE_MASK_PIXELS = false;
  const DEFAULT_EXHAUST_PIXELS = true;
  const DEFAULT_CROP_EDGE_PIXELS = true;
  const DEFAULT_ALGORITHM_VERSION = exports.AlgorithmVersion.V2;
  const DEFAULT_MASK = [
      137,
      80,
      78,
      71,
      13,
      10,
      26,
      10,
      0,
      0,
      0,
      13,
      73,
      72,
      68,
      82,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      3,
      0,
      0,
      0,
      37,
      219,
      86,
      202,
      0,
      0,
      0,
      1,
      115,
      82,
      71,
      66,
      1,
      217,
      201,
      44,
      127,
      0,
      0,
      0,
      9,
      112,
      72,
      89,
      115,
      0,
      0,
      11,
      19,
      0,
      0,
      11,
      19,
      1,
      0,
      154,
      156,
      24,
      0,
      0,
      0,
      3,
      80,
      76,
      84,
      69,
      255,
      255,
      255,
      167,
      196,
      27,
      200,
      0,
      0,
      0,
      10,
      73,
      68,
      65,
      84,
      120,
      156,
      99,
      96,
      0,
      0,
      0,
      2,
      0,
      1,
      72,
      175,
      164,
      113,
      0,
      0,
      0,
      0,
      73,
      69,
      78,
      68,
      174,
      66,
      96,
      130
  ];
  const SEED = [
      76221,
      13388,
      20800,
      80672,
      15974,
      87005,
      71203,
      84444,
      16928,
      51335,
      94092,
      83586,
      37656,
      2240,
      26283,
      1887,
      93419,
      96857,
      20866,
      21797,
      42065,
      39781,
      50192,
      24399,
      98969,
      54274,
      38815,
      45159,
      36824
  ];

  function preprocessImage(imageData, getScaled) {
      if (imageData.width <= MAX_WIDTH && imageData.height <= MAX_WIDTH) return imageData;
      const scale = MAX_WIDTH / Math.max(imageData.width, imageData.height);
      const [w, h] = [
          imageData.width * scale,
          imageData.height * scale
      ];
      const scaled = getScaled(w, h);
      if (scaled) {
          lanczos.lanczos(imageData, scaled);
          return scaled;
      } else return imageData;
  }
  function cropImg({ width , height  }, { size  }) {
      return [
          Math.floor(width / size) * size,
          Math.floor(height / size) * size
      ];
  }
  function* divideImg({ width , height , data  }, { size , verbose  }) {
      for(let h = 0; h < height; h += size){
          for(let w = 0; w < width; w += size){
              if (h + size <= height && w + size <= width) {
                  for(let c = 0; c < 3; c += 1){
                      const block = [];
                      for(let h1 = 0; h1 < size; h1 += 1){
                          for(let w1 = 0; w1 < size; w1 += 1){
                              block[h1 * size + w1] = data[((h + h1) * width + w + w1) * 4 + c];
                          }
                      }
                      if (verbose) console.warn('height: ' + h + ' width: ' + w);
                      yield block;
                  }
              }
          }
      }
  }
  function visitImgByPixel(imgData, options, visitor) {
      const { width , height , data  } = imgData;
      for(let i = 0; i < width * height; i += 1){
          const p = i * 4;
          visitor([
              data[p],
              data[p + 1],
              data[p + 2],
              data[p + 3]
          ], p, imgData);
      }
  }
  function visitImgByBlock(imgData, options, visitor) {
      const { width: w , height: h  } = imgData;
      let c = 0;
      let p = 0;
      let b = 0;
      for (const block of divideImg(imgData, options)){
          const bitConsumed = visitor(block, {
              c,
              p,
              b,
              w,
              h
          }, imgData);
          c += 1;
          if (bitConsumed) {
              b += 1;
          }
          if (c === 3) {
              p += 1;
              c = 0;
          }
      }
  }
  function updateImgByPixel(imgData, options, updater) {
      visitImgByPixel(imgData, options, (pixel, loc)=>updateImgByPixelAt(imgData, options, updater(pixel, loc, imgData), loc));
  }
  function updateImgByBlock(imgData, options, updater) {
      visitImgByBlock(imgData, options, (block, loc)=>{
          const bitConsumed = updater(block, loc, imgData);
          if (bitConsumed) {
              updateImgByBlockAt(imgData, options, block, loc);
              if (options.verbose) {
                  console.warn('inversed block: ' + block);
                  const im = new Array(options.size * options.size);
                  transform(block, im.fill(0), options.transformAlgorithm, options);
                  console.warn(block[25], block[18]);
              }
          }
          return bitConsumed;
      });
  }
  function updateImgByPixelChannelAt(imgData, loc, channel, value) {
      const { data  } = imgData;
      data[loc + channel] = value;
  }
  function updateImgByPixelAt(imgData, options, pixel, loc) {
      const { data  } = imgData;
      [data[loc], data[loc + 1], data[loc + 2], data[loc + 3]] = pixel;
  }
  function updateImgByBlockAt(imgData, options, block, loc) {
      const { data  } = imgData;
      const { size  } = options;
      const [x1, y1] = loc2coord(loc, options);
      for(let i = 0; i < size * size; i += 1){
          block[i] = clamp(Math.round(block[i]), 0, 255);
          data[loc2idx(loc, options, x1, y1, i)] = block[i];
      }
  }

  exports.GrayscaleAlgorithm = void 0;
  (function(GrayscaleAlgorithm) {
      GrayscaleAlgorithm["NONE"] = "NONE";
      GrayscaleAlgorithm["AVERAGE"] = 'AVG';
      GrayscaleAlgorithm["LUMINANCE"] = 'LUMA';
      GrayscaleAlgorithm["LUMINANCE_II"] = 'LUMA_II';
      GrayscaleAlgorithm["DESATURATION"] = "DESATURATION";
      GrayscaleAlgorithm["MAX_DECOMPOSITION"] = 'MAX_DE';
      GrayscaleAlgorithm["MIN_DECOMPOSITION"] = 'MIN_DE';
      GrayscaleAlgorithm["MID_DECOMPOSITION"] = 'MID_DE';
      GrayscaleAlgorithm["SIGNLE_R"] = 'R';
      GrayscaleAlgorithm["SIGNLE_G"] = 'G';
      GrayscaleAlgorithm["SIGNLE_B"] = 'B';
  })(exports.GrayscaleAlgorithm || (exports.GrayscaleAlgorithm = {}));
  function grayscale(r, g, b, algorithm) {
      switch(algorithm){
          case exports.GrayscaleAlgorithm.AVERAGE:
              return (r + g + b) / 3;
          case exports.GrayscaleAlgorithm.LUMINANCE:
              return r * 0.3 + g * 0.59 + b * 0.11;
          case exports.GrayscaleAlgorithm.LUMINANCE_II:
              return r * 0.2126 + g * 0.7152 + b * 0.0722;
          case exports.GrayscaleAlgorithm.DESATURATION:
              return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
          case exports.GrayscaleAlgorithm.MAX_DECOMPOSITION:
              return Math.max(r, g, b);
          case exports.GrayscaleAlgorithm.MIN_DECOMPOSITION:
              return Math.min(r, g, b);
          case exports.GrayscaleAlgorithm.MID_DECOMPOSITION:
              return [
                  r,
                  g,
                  b
              ].sort()[1];
          case exports.GrayscaleAlgorithm.SIGNLE_R:
              return r;
          case exports.GrayscaleAlgorithm.SIGNLE_G:
              return g;
          case exports.GrayscaleAlgorithm.SIGNLE_B:
              return b;
          default:
              return 0;
      }
  }
  function narrow(gray, size) {
      return clamp(Math.round(gray), size, 255 - size);
  }

  function createAcc$1({ size , transformAlgorithm  }) {
      switch(transformAlgorithm){
          case exports.TransformAlgorithm.FFT1D:
              return {
                  prevPos: -1,
                  prevCode: '',
                  indices: squareCircleIntersect(size, 3)
              };
          default:
              return {
                  prevPos: -1,
                  prevCode: '',
                  indices: []
              };
      }
  }
  function getPosFromAcc(acc, { c  }, { pass  }) {
      const { prevCode , prevPos , indices  } = acc;
      if (c !== 0) {
          return prevPos;
      }
      const [index, code] = hashCode(`${pass}_${prevCode}`, indices.length, []);
      acc.prevCode = code;
      acc.prevPos = indices[index];
      return indices[index];
  }
  function getPos$1(acc, loc, options) {
      const { pass , size , transformAlgorithm  } = options;
      switch(transformAlgorithm){
          case exports.TransformAlgorithm.FFT1D:
              return pass ? getPosFromAcc(acc, loc, options) : (size * size + size) / 2;
          case exports.TransformAlgorithm.FFT2D:
          case exports.TransformAlgorithm.DCT:
          case exports.TransformAlgorithm.FastDCT:
              return 0;
          default:
              throw new Error(`unknown algorithm: ${transformAlgorithm}`);
      }
  }

  function str2bits$1(text, copies) {
      const chars = Array.from(text);
      const bits = [];
      const pushByte = (byte, n)=>{
          for(let i = 0; i < 8; i += 1){
              let j = 0;
              while(j < n){
                  bits.push(byte[i]);
                  j += 1;
              }
          }
      };
      for(let i = 0; i < chars.length; i += 1){
          const codes = Array.from(encodeURI(chars[i]));
          for(let j = 0; j < codes.length; j += 1){
              const byte = [];
              let reminder = 0;
              let code = codes[j].charCodeAt(0);
              do {
                  reminder = code % 2;
                  byte.push(reminder);
                  code = code - Math.floor(code / 2) - reminder;
              }while (code > 1)
              byte.push(code);
              while(byte.length < 8){
                  byte.push(0);
              }
              pushByte(byte.reverse(), copies);
          }
      }
      return bits;
  }
  function bits2str$1(bits, copies) {
      let k = 128;
      let temp = 0;
      const chars = [];
      const candidates = [];
      const elect = ()=>candidates.filter((c)=>c === 1).length >= copies / 2 ? 1 : 0;
      for(let i = 0; i < bits.length; i += 1){
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
      } catch (e) {
          return '';
      }
  }
  function mergeBits$1(dest, ...src) {
      let k = 0;
      for(let i = 0; i < src.length; i += 1){
          const bits = src[i];
          for(let j = 0; j < bits.length && k < dest.length; j += 1, k += 1){
              dest[k] = bits[j];
          }
      }
      return dest;
  }
  function createBits$1(size) {
      const bits = new Array(size).fill(0);
      for(let i = 0; i < size; i += 1){
          bits[i] = Math.floor(Math.random() * 2);
      }
      return bits;
  }
  function getBit$1(block, acc, loc, options) {
      const pos = getPos$1(acc, loc, options);
      const { tolerance  } = options;
      return Math.abs(Math.round(block[pos] / tolerance) % 2);
  }
  function setBit$1(block, bits, acc, loc, options) {
      const pos = getPos$1(acc, loc, options);
      const { tolerance  } = options;
      const v = Math.floor(block[pos] / tolerance);
      if (bits[loc.b]) {
          block[pos] = v % 2 === 1 ? v * tolerance : (v + 1) * tolerance;
      } else {
          block[pos] = v % 2 === 1 ? (v - 1) * tolerance : v * tolerance;
      }
  }

  function _defineProperty(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function _objectSpread(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === 'function') {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _defineProperty(target, key, source[key]);
          });
      }
      return target;
  }
  function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly) {
              symbols = symbols.filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(object, sym).enumerable;
              });
          }
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _objectSpreadProps(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
      }
      return target;
  }
  function isBlockVisibleAt({ data  }, loc, options) {
      const { size  } = options;
      const _loc = _objectSpreadProps(_objectSpread({}, loc), {
          c: 0
      });
      const [x1, y1] = loc2coord(_loc, options);
      for(let i = 0; i < size * size; i += 1){
          const value = data[loc2idx(_loc, options, x1, y1, i)];
          if (typeof value !== 'undefined' && value < 127) {
              return false;
          }
      }
      return true;
  }
  function isPixelVisibleAt({ data  }, loc, options) {
      return typeof data[loc] === 'undefined' || data[loc] > 127;
  }

  function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator$4(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function encodeImg$1(imgData, maskData, options) {
      return _encodeImg$1.apply(this, arguments);
  }
  function _encodeImg$1() {
      _encodeImg$1 = _asyncToGenerator$4(function*(imgData, maskData, options) {
          const { text , size , narrow: narrowSize , copies , grayscaleAlgorithm , transformAlgorithm , exhaustPixels  } = options;
          const [width, height] = cropImg(imgData, options);
          const sizeOfBlocks = width * height * 3;
          const textBits = str2bits$1(text, copies);
          const bits = mergeBits$1(createBits$1(exhaustPixels ? sizeOfBlocks : textBits.length + 8 * copies), textBits, createBits$1(8 * copies).fill(1));
          if (textBits.length + 8 * copies > sizeOfBlocks) {
              process.stderr.write('bits overflow! try to shrink text or reduce copies.\n');
          }
          if (grayscaleAlgorithm !== exports.GrayscaleAlgorithm.NONE || narrowSize > 0) {
              updateImgByPixel(imgData, options, ([r, g, b, a], loc)=>{
                  if (!isPixelVisibleAt(maskData, loc)) {
                      return [
                          r,
                          g,
                          b,
                          a
                      ];
                  }
                  // decolor
                  if (grayscaleAlgorithm !== exports.GrayscaleAlgorithm.NONE) {
                      const y = grayscale(r, g, b, grayscaleAlgorithm);
                      r = y;
                      g = y;
                      b = y;
                  }
                  // narrow color value
                  if (narrowSize > 0) {
                      r = narrow(r, narrowSize);
                      g = narrow(g, narrowSize);
                      b = narrow(b, narrowSize);
                  }
                  return [
                      r,
                      g,
                      b,
                      a
                  ];
              });
          }
          const acc = createAcc$1(options);
          const im = new Array(size * size);
          updateImgByBlock(imgData, options, (block, loc)=>{
              if (!exhaustPixels && loc.b >= bits.length) {
                  return false;
              }
              if (!isBlockVisibleAt(maskData, loc, options)) {
                  if (options.fakeMaskPixels && loc.c === 0) {
                      const [x, y] = loc2coord(loc, options);
                      const g = rand(10, 127);
                      updateImgByPixelAt(imgData, options, [
                          g,
                          g,
                          g,
                          255
                      ], loc2idx(loc, options, x, y, rand(0, 64)));
                  }
                  return false;
              }
              transform(block, im.fill(0), transformAlgorithm, options);
              setBit$1(block, bits, acc, loc, options);
              inverseTransform(block, im, transformAlgorithm, options);
              return true;
          });
          return imgData;
      });
      return _encodeImg$1.apply(this, arguments);
  }
  function decodeImg$1(imgData, maskData, options) {
      return _decodeImg$1.apply(this, arguments);
  }
  function _decodeImg$1() {
      _decodeImg$1 = _asyncToGenerator$4(function*(imgData, maskData, options) {
          const { size , copies , transformAlgorithm  } = options;
          const bits = [];
          const acc = createAcc$1(options);
          const im = new Array(size * size);
          visitImgByBlock(imgData, options, (block, loc)=>{
              if (!isBlockVisibleAt(maskData, loc, options)) {
                  return false;
              }
              transform(block, im.fill(0), transformAlgorithm, options);
              bits.push(getBit$1(block, acc, loc, options));
              return true;
          });
          return bits2str$1(bits, copies);
      });
      return _decodeImg$1.apply(this, arguments);
  }

  function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator$3(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function encode$2(imgData, maskData, options) {
      return _encode$1.apply(this, arguments);
  }
  function _encode$1() {
      _encode$1 = _asyncToGenerator$3(function*(imgData, maskData, options) {
          const { width , height  } = imgData;
          const [cropWidth, cropHeight] = cropImg(imgData, options);
          return {
              data: yield encodeImg$1(imgData, maskData, options),
              width: options.cropEdgePixels ? cropWidth : width,
              height: options.cropEdgePixels ? cropHeight : height
          };
      });
      return _encode$1.apply(this, arguments);
  }

  var v1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    encode: encode$2,
    decode: decodeImg$1
  });

  function createAcc({ size , transformAlgorithm  }) {
      switch(transformAlgorithm){
          case exports.TransformAlgorithm.FFT1D:
              return {
                  prevPos: -1,
                  prevCode: '',
                  indices: squareCircleIntersect(size, 3)
              };
          default:
              return {
                  prevPos: -1,
                  prevCode: '',
                  indices: []
              };
      }
  }
  function getPos(options) {
      const { pass , size , transformAlgorithm  } = options;
      switch(transformAlgorithm){
          case exports.TransformAlgorithm.FFT1D:
              return [
                  3 * size + 1,
                  2 * size + 2
              ];
          case exports.TransformAlgorithm.FFT2D:
              return [
                  3 * size + 1,
                  2 * size + 2
              ];
          case exports.TransformAlgorithm.DCT:
              return [
                  3 * size + 1,
                  2 * size + 2
              ];
          case exports.TransformAlgorithm.FastDCT:
              return [
                  3 * size + 1,
                  2 * size + 2
              ];
          default:
              throw new Error(`unknown algorithm in getPos: ${transformAlgorithm}`);
      }
  }

  function gray_code(n) {
      return n ^ n >> 1;
  }
  const URIchars = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'J',
      'H',
      'I',
      'G',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '-',
      '.',
      '_',
      '!',
      '~',
      '*',
      "'",
      '(',
      ')',
      ';',
      ',',
      '/',
      '?',
      ':',
      '@',
      '&',
      '=',
      '+',
      '$',
      '%'
  ];
  const URIcharCode = URIchars.map((c, i)=>gray_code(2 * i));
  const char2code = (c)=>URIchars.indexOf(c) !== -1 ? URIcharCode[URIchars.indexOf(c)] : 255;
  const code2char = (c)=>URIcharCode.indexOf(c) !== -1 ? URIchars[URIcharCode.indexOf(c)] : '';
  function str2codes(text) {
      const codes = [];
      Array.from(text).map((char)=>{
          const URIcodes = Array.from(encodeURI(char));
          URIcodes.map((URIcode)=>codes.push(URIcharCode[URIchars.indexOf(URIcode)]));
      });
      return codes;
  }
  function codes2bits(codes, copies) {
      const bits = [];
      const pushByte = (byte, n)=>{
          for(let i = 0; i < 8; i += 1){
              let j = 0;
              while(j < n){
                  bits.push(byte[i]);
                  j += 1;
              }
          }
      };
      codes.map((code)=>{
          const byte = [];
          let reminder = 0;
          do {
              reminder = code % 2;
              byte.push(reminder);
              code = code - Math.floor(code / 2) - reminder;
          }while (code > 1)
          byte.push(code);
          while(byte.length < 8){
              byte.push(0);
          }
          pushByte(byte.reverse(), 3 * Math.ceil(copies / 3));
      });
      return bits;
  }
  function str2bits(text, copies) {
      const codes = str2codes(text);
      return codes2bits(codes, copies);
  }
  function correctCharCode(rawCode, charCodes, verbose) {
      if (verbose) {
          const bits = rawCode.map((bits)=>bits.map((richBits)=>richBits.bit));
          const diffs = rawCode.map((bits)=>bits.map((richBits)=>richBits.diff));
          console.warn('[debug][rawcode] bits: ' + bits + '\n' + diffs);
      }
      let code = rawCode.slice().reverse().reduce((res, richBits, id)=>{
          // correct raw bit
          const copies = richBits.length;
          const nBit1 = richBits.filter((c)=>c.bit === 1).length;
          if (nBit1 === 0) return res;
          if (nBit1 !== copies) {
              const conditionalSum = (richBits, v)=>richBits.reduce((res, e)=>e.bit === v ? res + e.diff : res, 0);
              const diff1 = Math.abs(conditionalSum(richBits, 1)) / nBit1;
              const diff0 = Math.abs(conditionalSum(richBits, 0)) / (copies - nBit1);
              if (verbose) {
                  console.warn('diff1: ' + diff1 + ' diff0: ' + diff1);
              }
              if (diff1 > 2 * diff0 || nBit1 > copies / 2) // bit 1
              res += 1 << id;
          } else {
              res += 1 << id;
          }
          // done
          return res;
      }, 0);
      if (code !== 255 && URIcharCode.indexOf(code) === -1) {
          const percentChars = [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              'A',
              'B',
              'C',
              'D',
              'E',
              'F'
          ].map((c)=>char2code(c));
          const l = charCodes.length;
          let inPercent = false;
          if (l > 1 && charCodes[l - 1] === char2code('%') || l > 2 && charCodes[l - 2] === char2code('%')) inPercent = true;
          const countBit1 = (n)=>{
              let count = 0;
              while(n){
                  count += n & 1;
                  n >>= 1;
              }
              return count;
          };
          code = URIcharCode.reduce((res, c)=>{
              if (inPercent) {
                  if (percentChars.indexOf(c) === -1) return res;
                  else if (percentChars.indexOf(res) === -1) return c;
              }
              const dec2byte = (dec)=>{
                  const byte = Array.from(dec.toString(2));
                  while(byte.length < 8){
                      byte.splice(0, 0, '0');
                  }
                  return byte.map((n)=>Number(n));
              };
              const diff = (rawCode, comp)=>{
                  const compBits = dec2byte(comp);
                  let bitDiff = 0;
                  let paramDiff = 0;
                  const w = [
                      0.45,
                      0.35,
                      0.2
                  ];
                  for(let i = 0; i < rawCode.length; i += 1){
                      const rbit = rawCode[i].filter((c)=>c.bit === 1).length;
                      const absbitDiff = Math.abs(rbit - compBits[i] * rawCode[i].length);
                      bitDiff += absbitDiff;
                      paramDiff += rawCode[i].reduce((diff, b, bitId)=>b.bit !== compBits[i] ? Math.abs(b.diff) * w[bitId % 3] + diff : diff, 0);
                  }
                  // paramDiff /= bitDiff;
                  if (verbose) {
                      console.warn(comp + ' ' + code2char(comp) + ' ' + compBits + ' bit difference: ' + bitDiff + ' param difference: ' + paramDiff + '\n');
                  }
                  return [
                      bitDiff,
                      paramDiff
                  ];
              };
              if (countBit1(code ^ res) < countBit1(code ^ c)) return res;
              else if (countBit1(code ^ res) > countBit1(code ^ c)) return c;
              else {
                  const [resDiff, cDiff] = [
                      diff(rawCode, res),
                      diff(rawCode, c)
                  ];
                  if (resDiff[1] < cDiff[1]) return res;
                  else if (resDiff[1] > cDiff[1]) return c;
                  else {
                      if (resDiff[0] < cDiff[0]) return res;
                      else return c;
                  }
              }
          }, 255);
      }
      if (verbose) {
          const bits1 = rawCode.map((bits)=>bits.map((richBits)=>richBits.bit));
          const diffs1 = rawCode.map((bits)=>bits.map((richBits)=>richBits.diff));
          console.warn('elected ' + code + ' (' + code2char(code) + ') with bits: ' + bits1 + '\n' + diffs1);
      }
      return code;
  }
  function bits2str(richBits, copies, verbose) {
      let k = 128;
      let tempCharCode = 0;
      const tempRawBits = [];
      const charCodes = [];
      const candidates = [];
      for(let i = 0; i < richBits.length; i += 1){
          candidates.push(richBits[i]);
          if (verbose) {
              console.warn('bit: ' + richBits[i].bit);
              console.warn('charId: ' + Math.floor(i / (8 * copies)) + ', bitId: ' + i % (8 * copies));
          }
          if (candidates.length === copies) {
              tempRawBits.push(candidates.slice());
              k /= 2;
              candidates.length = 0;
              if (k < 1) {
                  tempCharCode = correctCharCode(tempRawBits, charCodes, verbose);
                  // end of message
                  if (tempCharCode === 255) {
                      break;
                  }
                  if (verbose) {
                      console.warn('bit index: ' + i + ' char: ' + code2char(tempCharCode) + ' temp: ' + tempCharCode + '\n');
                  }
                  charCodes.push(tempCharCode);
                  tempCharCode = 0;
                  tempRawBits.length = 0;
                  k = 128;
              }
              if (copies % 3 !== 0) {
                  //consume more bits
                  i += 3 - copies % 3;
              }
          }
      }
      if (verbose) console.warn('Before correctURI: ' + charCodes);
      const chars = charCodes.map((c)=>code2char(c));
      try {
          return decodeURI(chars.join(''));
      } catch (e) {
          console.warn('Error when decoding:  ' + e);
          return '';
      }
  }
  function int2halfbyte(n, copies) {
      // reverse order
      const bytes = Array.from(n.toString(2)).reverse().map((n)=>Number(n));
      while(bytes.length < 4)bytes.push(0);
      const res = [];
      for(let i = 0; i < bytes.length; i += 1){
          for(let j = 0; j < copies; j += 1){
              res.push(bytes[i]);
          }
      }
      return res;
  }
  function halfbyte2int(bits, copies) {
      // bits in reverse order
      let k = 1;
      let temp = 0;
      for(let i = 0; i < bits.length / DEFAULT_PARAM_COPIES; i += 1){
          const candidates = [];
          for(let j = 0; j < DEFAULT_PARAM_COPIES; j += 1){
              candidates.push(bits[i * DEFAULT_PARAM_COPIES + j]);
          }
          const elect = ()=>candidates.filter((c)=>c === 1).length >= DEFAULT_PARAM_COPIES / 2 ? 1 : 0;
          temp += k * elect();
          k <<= 1;
      }
      return temp;
  }
  function param2bits(options) {
      return int2halfbyte((options.copies - 1) / 2, DEFAULT_PARAM_COPIES) // 4 bit * copies
      ;
  }
  function bits2param(bits) {
      const copies = 1 + halfbyte2int(bits) * 2;
      return copies;
  }
  function mergeBits(dest, ...src) {
      let k = 0;
      for(let i = 0; i < src.length; i += 1){
          const bits = src[i];
          for(let j = 0; j < bits.length && k < dest.length; j += 1, k += 1){
              dest[k] = bits[j];
          }
      }
      return dest;
  }
  function createBits(size) {
      const bits = new Array(size).fill(0);
      for(let i = 0; i < size; i += 1){
          bits[i] = Math.floor(Math.random() * 2);
      }
      return bits;
  }
  function getBit(block, acc, options) {
      const [pos1, pos2] = getPos(options);
      if (options.verbose) console.warn('decoded value: ', block[pos1], block[pos2]);
      const diff = block[pos1] - block[pos2];
      return {
          bit: diff > 0 ? 1 : 0,
          diff: diff
      };
  }
  function setBit(block, bit, options, tolerance) {
      const [pos1, pos2] = getPos(options);
      let v1 = block[pos1];
      let v2 = block[pos2];
      const t0 = Math.abs(v1 - v2);
      const t = t0 > 1.5 * tolerance ? 0.5 * tolerance : t0 < 0.3 * tolerance ? 1.5 * tolerance : t0 < 0.5 * tolerance ? 1.2 * tolerance : tolerance;
      [v1, v2] = v1 < v2 ? [
          v1 - t / 2,
          v2 + t / 2
      ] : [
          v1 + t / 2,
          v2 - t / 2
      ];
      if (options.verbose) console.warn('encoded value: ', v1, v2);
      if (bit) {
          [block[pos1], block[pos2]] = v1 < v2 ? [
              v2,
              v1
          ] : [
              v1,
              v2
          ];
          if (options.transformAlgorithm === exports.TransformAlgorithm.FFT2D) // coefficients of fft2d are sysmetric to (size - 1 / 2, )
          [block[72 - pos1], block[72 - pos2]] = v1 < v2 ? [
              v2,
              v1
          ] : [
              v1,
              v2
          ];
      } else {
          [block[pos1], block[pos2]] = v1 < v2 ? [
              v1,
              v2
          ] : [
              v2,
              v1
          ];
          if (options.transformAlgorithm === exports.TransformAlgorithm.FFT2D) // coefficients of fft2d are sysmetric to (size - 1 / 2, )
          [block[72 - pos1], block[72 - pos2]] = v1 < v2 ? [
              v1,
              v2
          ] : [
              v2,
              v1
          ];
      }
  }

  function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator$2(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function getCharfromIdx(idx, copies, text) {
      const charId = Math.floor(idx / (8 * copies));
      const bitId = idx % (8 * copies);
      const codes = Array.from(encodeURI(text));
      if (charId > codes.length) return 'OUT_OF_BOUND' + '(charId: ' + charId + ')';
      else return codes[charId] + '(charId: ' + charId + ', bitId: ' + bitId + ')';
  }
  function encodeImg(imgData, maskData, options) {
      return _encodeImg.apply(this, arguments);
  }
  function _encodeImg() {
      _encodeImg = _asyncToGenerator$2(function*(imgData, maskData, options) {
          const { text , size , narrow: narrowSize , copies , grayscaleAlgorithm , transformAlgorithm , exhaustPixels  } = options;
          const [width, height] = cropImg(imgData, options);
          const sizeOfBlocks = width * height * 3 / (size * size);
          const textBits = str2bits(text, copies);
          const paramsBits = param2bits(options);
          const bits = mergeBits(createBits(sizeOfBlocks), paramsBits, textBits, createBits(8 * copies).fill(1));
          const encodeLen = textBits.length + 8 * copies;
          if (encodeLen > sizeOfBlocks) {
              process.stderr.write('bits overflow! try to shrink text or reduce copies.\n');
          }
          if (grayscaleAlgorithm !== exports.GrayscaleAlgorithm.NONE || narrowSize > 0) {
              updateImgByPixel(imgData, options, ([r, g, b, a], loc)=>{
                  if (!isPixelVisibleAt(maskData, loc)) {
                      return [
                          r,
                          g,
                          b,
                          a
                      ];
                  }
                  // decolor
                  if (grayscaleAlgorithm !== exports.GrayscaleAlgorithm.NONE) {
                      const y = grayscale(r, g, b, grayscaleAlgorithm);
                      r = y;
                      g = y;
                      b = y;
                  }
                  // narrow color value
                  if (narrowSize > 0) {
                      r = narrow(r, narrowSize);
                      g = narrow(g, narrowSize);
                      b = narrow(b, narrowSize);
                  }
                  return [
                      r,
                      g,
                      b,
                      a
                  ];
              });
          }
          const im = new Array(size * size);
          let blockId = -1;
          const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v, i)=>i);
          shuffleGroupBy3(shuffleArr, SEED) // shuffle by binding 3 blocks together (RGB)
          ;
          const encodedId = shuffleArr.map((v, i)=>{
              if (i < encodeLen) return v;
          });
          updateImgByBlock(imgData, options, (block, loc)=>{
              // Remove transparency for PNG. Even though we do not encode alpha channel,
              // the social media compression on transparant image can casue the information loss.
              if (loc.c === 0) {
                  const [x, y] = loc2coord(loc, options);
                  for(let i = 0; i < size * size; i += 1){
                      const idx = loc2idx(loc, options, x, y, i);
                      updateImgByPixelChannelAt(imgData, idx, 3, 255);
                  }
              }
              blockId += 1;
              if (!exhaustPixels && !(blockId in encodedId)) {
                  return false;
              }
              if (!isBlockVisibleAt(maskData, loc, options)) {
                  if (options.fakeMaskPixels && loc.c === 0) {
                      const [x1, y1] = loc2coord(loc, options);
                      const g = rand(10, 127);
                      updateImgByPixelAt(imgData, options, [
                          g,
                          g,
                          g,
                          255
                      ], loc2idx(loc, options, x1, y1, rand(0, 64)));
                  }
                  return false;
              }
              if (options.verbose) {
                  console.warn('Encode on image block (blockId: ' + blockId + '): ' + block);
              }
              transform(block, im.fill(0), transformAlgorithm, options);
              const tolerance = ()=>{
                  const x = blockId * size / 3 % loc.w;
                  const y = Math.floor(blockId * size / 3 / loc.w) * size;
                  let t = options.tolerance;
                  if (x <= 8 || x > loc.w - 2 * size || y <= size || y > loc.h - 2 * size) t = 1.5 * t;
                  if (options.verbose) {
                      console.warn('Encode with tolerance: ' + t + ' (Image size is width: ' + loc.w + ' height:' + loc.h + ')');
                  }
                  return t;
              };
              const t = tolerance();
              let diff1 = 0;
              let maxRetry = 5;
              while(true){
                  setBit(block, bits[shuffleArr[loc.b]], options, t);
                  const [pos1, pos2] = getPos(options);
                  diff1 = diff1 === 0 ? block[pos1] - block[pos2] : diff1;
                  if (options.verbose) {
                      const bitOrigin = shuffleArr[loc.b] < paramsBits.length ? 'PARAM_BITS' : getCharfromIdx(shuffleArr[loc.b] - paramsBits.length, copies, text);
                      console.warn('Encode bit: ' + bits[shuffleArr[loc.b]] + ' From char: ' + bitOrigin);
                      console.warn(block);
                  }
                  inverseTransform(block, im, transformAlgorithm, options);
                  const imgBlock = block.map((v)=>v < 0 ? 0 : v > 255 ? 255 : Math.round(v));
                  transform(imgBlock, im.fill(0), transformAlgorithm, options);
                  const newDiff = imgBlock[pos1] - imgBlock[pos2];
                  if (options.verbose) console.warn('After encode, the params diff is: ' + newDiff + ' (' + imgBlock[pos1] + '-' + imgBlock[pos2] + ') diff1: ' + diff1);
                  if (Math.abs(newDiff) < Math.abs(diff1 * 0.8)) {
                      if (options.verbose) console.warn('Repeat set bit with tolerance: ' + t + ' (max repeat times: ' + maxRetry + ')');
                      if ((maxRetry -= 1) === 0) {
                          break;
                      }
                      // block = imgBlock;
                      for(let i1 = 0; i1 < size * size; i1 += 1)block[i1] = imgBlock[i1];
                      continue;
                  }
                  break;
              }
              return true;
          });
          return imgData;
      });
      return _encodeImg.apply(this, arguments);
  }
  function decodeImg(imgData, maskData, options) {
      return _decodeImg.apply(this, arguments);
  }
  function _decodeImg() {
      _decodeImg = _asyncToGenerator$2(function*(imgData, maskData, options) {
          const { size , transformAlgorithm  } = options;
          const richBits = [];
          const acc = createAcc(options);
          const im = new Array(size * size);
          const [width, height] = cropImg(imgData, options);
          const sizeOfBlocks = width * height * 3 / (size * size);
          const shuffleArr = new Array(sizeOfBlocks).fill(0).map((v, i)=>i);
          shuffleGroupBy3(shuffleArr, SEED);
          let blockId = 0;
          visitImgByBlock(imgData, options, (block, loc)=>{
              if (!isBlockVisibleAt(maskData, loc, options)) {
                  return false;
              }
              transform(block, im.fill(0), transformAlgorithm, options);
              if (options.verbose && blockId >= 4 * DEFAULT_PARAM_COPIES) {
                  const i = blockId - 4 * DEFAULT_PARAM_COPIES;
                  console.warn('charId: ' + Math.floor(shuffleArr[i] / (8 * options.copies)) + ', bitId: ' + shuffleArr[i] % (8 * options.copies));
                  console.warn('bit: ' + getBit(block, acc, options).bit, block);
              }
              // let { bit, diff } = getBit(block, acc, options);
              richBits.push(getBit(block, acc, options));
              blockId += 1;
              return true;
          });
          unshuffleGroupBy3(richBits, SEED);
          const copiesBits = richBits.slice(0, 4 * DEFAULT_PARAM_COPIES).map((v)=>v.bit);
          const copies = bits2param(copiesBits);
          if (options.verbose) {
              console.warn('copies is ' + copies);
          }
          // return bits2str(bits, 3, options.verbose);
          return bits2str(richBits.slice(4 * DEFAULT_PARAM_COPIES), copies, options.verbose);
      });
      return _decodeImg.apply(this, arguments);
  }

  function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator$1(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function encode$1(imgData, maskData, options) {
      return _encode.apply(this, arguments);
  }
  function _encode() {
      _encode = _asyncToGenerator$1(function*(imgData, maskData, options) {
          const { width , height  } = imgData;
          const [cropWidth, cropHeight] = cropImg(imgData, options);
          return {
              data: yield encodeImg(imgData, maskData, options),
              width: options.cropEdgePixels ? cropWidth : width,
              height: options.cropEdgePixels ? cropHeight : height
          };
      });
      return _encode.apply(this, arguments);
  }

  var v2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    encode: encode$1,
    decode: decodeImg
  });

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _asyncToGenerator(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  const { encode , decode  } = proxy({
      algoithms: {
          [exports.AlgorithmVersion.V1]: v1,
          [exports.AlgorithmVersion.V2]: v2
      },
      methods: {
          toImageData (data) {
              const type = imgType(new Uint8Array(data.slice(0, 8)));
              const blob = new Blob([
                  data
              ], {
                  type
              });
              const url = URL.createObjectURL(blob);
              return new Promise((resolve, reject)=>{
                  const element = new Image();
                  element.addEventListener('load', ()=>{
                      const { width , height  } = element;
                      const ctx = createCanvas(width, height).getContext('2d');
                      ctx.drawImage(element, 0, 0, width, height);
                      resolve(ctx.getImageData(0, 0, width, height));
                  });
                  element.addEventListener('error', reject);
                  element.src = url;
              });
          },
          toBuffer (imgData, height = imgData.height, width = imgData.width) {
              return _asyncToGenerator(function*() {
                  const canvas = createCanvas(width, height);
                  canvas.getContext('2d').putImageData(imgData, 0, 0, 0, 0, width, height);
                  if (isOffscreenCanvas(canvas)) {
                      return toArrayBuffer((yield canvas.convertToBlob({
                          type: 'image/png'
                      })));
                  }
                  return new Promise((resolve, reject)=>{
                      const callback = (blob)=>{
                          if (blob) {
                              resolve(toArrayBuffer(blob));
                          } else {
                              reject(new Error('fail to generate array buffer'));
                          }
                      };
                      canvas.toBlob(callback, 'image/png');
                  });
              })();
          },
          preprocessImage (data) {
              var ref;
              return preprocessImage(data, (w, h)=>{
                  var ref1;
                  return (ref = (ref1 = createCanvas(w, h).getContext('2d')) === null || ref1 === void 0 ? void 0 : ref1.createImageData(w, h)) !== null && ref !== void 0 ? ref : null;
              });
          }
      }
  });
  function toArrayBuffer(blob) {
      return new Promise((resolve, reject)=>{
          const reader = new FileReader();
          reader.addEventListener('load', ()=>resolve(reader.result));
          reader.addEventListener('error', ()=>reject(new Error('fail to generate array buffer')));
          reader.readAsArrayBuffer(blob);
      });
  }
  function createCanvas(width, height) {
      if (typeof OffscreenCanvas !== 'undefined') {
          return new OffscreenCanvas(width, height);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
  }
  function isOffscreenCanvas(value) {
      return (value === null || value === void 0 ? void 0 : value[Symbol.toStringTag]) === 'OffscreenCanvas';
  }

  exports.CLI_NAME = CLI_NAME;
  exports.DEFAULT_ALGORITHM_VERSION = DEFAULT_ALGORITHM_VERSION;
  exports.DEFAULT_COPIES = DEFAULT_COPIES;
  exports.DEFAULT_CROP_EDGE_PIXELS = DEFAULT_CROP_EDGE_PIXELS;
  exports.DEFAULT_EXHAUST_PIXELS = DEFAULT_EXHAUST_PIXELS;
  exports.DEFAULT_FAKE_MASK_PIXELS = DEFAULT_FAKE_MASK_PIXELS;
  exports.DEFAULT_MASK = DEFAULT_MASK;
  exports.DEFAULT_NARROW = DEFAULT_NARROW;
  exports.DEFAULT_PARAM_COPIES = DEFAULT_PARAM_COPIES;
  exports.DEFAULT_SIZE = DEFAULT_SIZE;
  exports.DEFAULT_TOLERANCE = DEFAULT_TOLERANCE;
  exports.MAX_TOLERANCE = MAX_TOLERANCE;
  exports.MAX_WIDTH = MAX_WIDTH;
  exports.SEED = SEED;
  exports.TOLERANCE_NOT_SET = TOLERANCE_NOT_SET;
  exports.decode = decode;
  exports.encode = encode;
  exports.getImageType = imgType;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
