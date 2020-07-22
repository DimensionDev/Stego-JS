#!/bin/bash
# shellcheck disable=SC2002
FILE_NAME="$1"

npm run build
cat "$FILE_NAME" | stego-js -e -m "$(pbpaste)" -f FFT2D 2>test.log 1>test.png
cat test.png | stego-js -d -f FFT2D
