# @masknet/stego-js

## 0.15.1

### Patch Changes

- 40d94ae: fix: lanczos throwing when destination dimensions are not round

## 0.15.0

### Minor Changes

- 44effcb: now Node.js 18 is required for CLI because we upgraded meow

### Patch Changes

- 44effcb: remove process.stderr.write in core path

## 0.14.2

### Patch Changes

- 7c6c24b: publish on npm

## 0.14.1

### Patch Changes

- 623d96b: improve typescript definition
- e4ef122: list @napi-rs/image as optional peer

## 0.14.0

### Minor Changes

- d16ca86: remove peer dependencies to node-canvas instead of @napi-rs/image
- 9d8b47b: use crypto safe random source
- d16ca86: first release with changeset
- 5cf3d71: change input to be more relaxed and output to be more strict
- df9e3d7: make exported type readonly as possible
- d16ca86: drop commonjs support
- 1dd3b8c: improve support for worker and service worker
