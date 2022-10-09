'use strict'
// MORE:
// https://en.wikipedia.org/wiki/JPEG
exports.__esModule = true
exports.QUANTIZATION_MATRIX = exports.idct = exports.dct = void 0
var ONE_SQUARE_ROOT_OF_TWO = 1 / Math.sqrt(2)
// type-II DCT
function dct(nums, size) {
  if (size === void 0) {
    size = 8
  }
  var coefficients = []
  for (var v = 0; v < size; v += 1) {
    for (var u = 0; u < size; u += 1) {
      var au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1
      var av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1
      var sum = 0
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          sum +=
            nums[y * size + x] * Math.cos(((2 * x + 1) * u * Math.PI) / 16) * Math.cos(((2 * y + 1) * v * Math.PI) / 16)
        }
      }
      coefficients.push((sum * au * av) / 4)
    }
  }
  // in-place update
  for (var i = 0; i < coefficients.length; i += 1) {
    nums[i] = coefficients[i]
  }
}
exports.dct = dct
// type-III DCT
function idct(coefficients, size) {
  if (size === void 0) {
    size = 8
  }
  var nums = []
  for (var y = 0; y < size; y += 1) {
    for (var x = 0; x < size; x += 1) {
      var sum = 0
      for (var v = 0; v < size; v += 1) {
        for (var u = 0; u < size; u += 1) {
          var au = u === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1
          var av = v === 0 ? ONE_SQUARE_ROOT_OF_TWO : 1
          sum +=
            au *
            av *
            coefficients[v * size + u] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16)
        }
      }
      nums.push(sum / 4)
    }
  }
  // in-place update
  for (var i = 0; i < nums.length; i += 1) {
    coefficients[i] = nums[i]
  }
}
exports.idct = idct
exports.QUANTIZATION_MATRIX = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51,
  87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101,
  72, 92, 95, 98, 112, 100, 103, 99,
]
