/// fft.js

// core operations
let _n = 0 // order
let _bitrev: Uint8Array // bit reversal table
let _cstb: Float64Array // sin/cos table

export function init(n: number) {
  if (n !== 0 && (n & (n - 1)) === 0) {
    _n = n
    _initArray()
    _makeBitReversalTable()
    _makeCosSinTable()
  } else {
    throw new Error('init: radix-2 required')
  }
}

// 1D-FFT
export function fft1d(re: number[], im: number[]) {
  fft(re, im, 1)
}

// 1D-IFFT
export function ifft1d(re: number[], im: number[]) {
  const n = 1 / _n
  fft(re, im, -1)
  for (let i = 0; i < _n; i += 1) {
    re[i] *= n
    im[i] *= n
  }
}

// 2D-FFT
export function fft2d(re: number[], im: number[]) {
  const tre: number[] = []
  const tim: number[] = []
  let i = 0
  // x-axis
  for (let y = 0; y < _n; y += 1) {
    i = y * _n
    for (let x1 = 0; x1 < _n; x1 += 1) {
      tre[x1] = re[x1 + i]
      tim[x1] = im[x1 + i]
    }
    fft1d(tre, tim)
    for (let x2 = 0; x2 < _n; x2 += 1) {
      re[x2 + i] = tre[x2]
      im[x2 + i] = tim[x2]
    }
  }
  // y-axis
  for (let x = 0; x < _n; x += 1) {
    for (let y1 = 0; y1 < _n; y1 += 1) {
      i = x + y1 * _n
      tre[y1] = re[i]
      tim[y1] = im[i]
    }
    fft1d(tre, tim)
    for (let y2 = 0; y2 < _n; y2 += 1) {
      i = x + y2 * _n
      re[i] = tre[y2]
      im[i] = tim[y2]
    }
  }
}

// 2D-IFFT
export function ifft2d(re: number[], im: number[]) {
  const tre: number[] = []
  const tim: number[] = []
  let i = 0
  // x-axis
  for (let y = 0; y < _n; y += 1) {
    i = y * _n
    for (let x1 = 0; x1 < _n; x1 += 1) {
      tre[x1] = re[x1 + i]
      tim[x1] = im[x1 + i]
    }
    ifft1d(tre, tim)
    for (let x2 = 0; x2 < _n; x2 += 1) {
      re[x2 + i] = tre[x2]
      im[x2 + i] = tim[x2]
    }
  }
  // y-axis
  for (let x = 0; x < _n; x += 1) {
    for (let y1 = 0; y1 < _n; y1 += 1) {
      i = x + y1 * _n
      tre[y1] = re[i]
      tim[y1] = im[i]
    }
    ifft1d(tre, tim)
    for (let y2 = 0; y2 < _n; y2 += 1) {
      i = x + y2 * _n
      re[i] = tre[y2]
      im[i] = tim[y2]
    }
  }
}

export function fft(re: number[], im: number[], inv: number) {
  let d: number, h: number, ik: number, m: number, tmp: number, wr: number, wi: number, xr: number, xi: number
  const n4 = _n >> 2
  // bit reversal
  for (let l = 0; l < _n; l += 1) {
    m = _bitrev[l]
    if (l < m) {
      tmp = re[l]
      re[l] = re[m]
      re[m] = tmp
      tmp = im[l]
      im[l] = im[m]
      im[m] = tmp
    }
  }
  // butterfly operation
  for (let k = 1; k < _n; k <<= 1) {
    h = 0
    d = _n / (k << 1)
    for (let j = 0; j < k; j += 1) {
      wr = _cstb[h + n4]
      wi = inv * _cstb[h]
      for (let i = j; i < _n; i += k << 1) {
        ik = i + k
        xr = wr * re[ik] + wi * im[ik]
        xi = wr * im[ik] - wi * re[ik]
        re[ik] = re[i] - xr
        re[i] += xr
        im[ik] = im[i] - xi
        im[i] += xi
      }
      h += d
    }
  }
}
function _initArray() {
  _bitrev = new Uint8Array(_n)
  _cstb = new Float64Array(_n * 1.25)
}
function _makeBitReversalTable() {
  let i = 0,
    j = 0,
    k = 0
  _bitrev[0] = 0
  while ((i += 1) < _n) {
    k = _n >> 1
    while (k <= j) {
      j -= k
      k >>= 1
    }
    j += k
    _bitrev[i] = j
  }
}
function _makeCosSinTable() {
  const n2 = _n >> 1,
    n4 = _n >> 2,
    n8 = _n >> 3,
    n2p4 = n2 + n4
  let t = Math.sin(Math.PI / _n),
    dc = 2 * t * t,
    ds = Math.sqrt(dc * (2 - dc)),
    c = (_cstb[n4] = 1),
    s = (_cstb[0] = 0)
  t = 2 * dc
  for (let i = 1; i < n8; i += 1) {
    c -= dc
    dc += t * c
    s += ds
    ds -= t * s
    _cstb[i] = s
    _cstb[n4 - i] = c
  }
  if (n8 !== 0) {
    _cstb[n8] = Math.sqrt(0.5)
  }
  for (let j = 0; j < n4; j += 1) {
    _cstb[n2 - j] = _cstb[j]
  }
  for (let k = 0; k < n2p4; k += 1) {
    _cstb[k + n2] = -_cstb[k]
  }
}
