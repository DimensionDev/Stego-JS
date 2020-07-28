#!/bin/bash
# shellcheck disable=SC2002
npm run build

FILE_NAME="$1"
MASK="$2"

if [ -n "$MASK" ]; then
	cat "$FILE_NAME" | stego-js -e -m "$(pbpaste)" -s 8 -p person:twitter.com/identifier -k "$MASK" --fakeMaskPixels 2>test_encode.log 1>test.png
	cat test.png | stego-js -d -s 8 -p person:twitter.com/identifier -k "$MASK" 2>test_decode.log
else
	cat "$FILE_NAME" | stego-js -e -m "$(pbpaste)" -s 8 -p person:twitter.com/identifier --fakeMaskPixels 2>test_encode.log 1>test.png
	cat test.png | stego-js -d -s 8 -p person:twitter.com/identifier 2>test_decode.log
fi
