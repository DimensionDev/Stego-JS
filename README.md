# Stego-JS

[![npm module](https://img.shields.io/npm/v/@masknet/stego-js)](https://www.npmjs.com/package/@masknet/stego-js)

[Example](https://dimensiondev.github.io/Stego-JS/example/index.html)

## Installation

```bash
# node
npm install @masknet/stego-js @napi-rs/image --global

# dom
npm install @masknet/stego-js
```

## Usage

```bash
# cli
npx @masknet/stego-js -h

# or
npm install --global @masknet/stego-js
stego-js -h
```

```javascript
// node
import { encode, decode } from '@masknet/stego-js/cjs/node'

// dom
import { encode, decode } from '@masknet/stego-js/cjs/dom'

// in native  (using ./cjs/node)
// in browser (using ./cjs/dom)
import { encode, decode } from '@masknet/stego-js'
```

## Refs

- [Javascript implementation of Java’s String.hashCode() method](https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)
- [Shuffle & Unshuffle an Array in JavaScript](https://gist.github.com/iSWORD/13f715370e56703f6c973b6dd706bbbd)
- [RGB to YCbCr](https://makarandtapaswi.wordpress.com/2009/07/20/why-the-rgb-to-ycbcr/)
- [YCbCr to RGB](https://stackoverflow.com/questions/21264648/javascript-convert-yuv-to-rgb)
