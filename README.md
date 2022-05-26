# Stego-JS

[![npm module](https://img.shields.io/npm/v/@dimensiondev/stego-js)](https://www.npmjs.com/package/@dimensiondev/stego-js)

## Installation

```bash
# node
npm install @dimensiondev/stego-js canvas@2.9.1 --global

# dom
npm install @dimensiondev/stego-js
```

## Usage

```bash
# cli
npx @dimensiondev/stego-js -h

# or
npm install --global @dimensiondev/stego-js
stego-js -h
```

```javascript
// node
import { encode, decode } from '@dimensiondev/stego-js/cjs/node'

// dom
import { encode, decode } from '@dimensiondev/stego-js/cjs/dom'

// in native  (using ./cjs/node)
// in browser (using ./cjs/dom)
import { encode, decode } from '@dimensiondev/stego-js'
```

## Refs

- [Javascript implementation of Java’s String.hashCode() method](https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)
- [Shuffle & Unshuffle an Array in JavaScript](https://gist.github.com/iSWORD/13f715370e56703f6c973b6dd706bbbd)
- [RGB to YCbCr](https://makarandtapaswi.wordpress.com/2009/07/20/why-the-rgb-to-ycbcr/)
- [YCbCr to RGB](https://stackoverflow.com/questions/21264648/javascript-convert-yuv-to-rgb)
