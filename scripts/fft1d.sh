#!/bin/bash

if [ -n $2 ]
then
    npm run build && cat $1 | stego-js -e -m "$(pbpaste)" -s 8 -p person:twitter.com/differui -k $2 --fakeMaskPixels 2> test_encode.log 1> test.png && cat test.png | stego-js -d -s 8 -p person:twitter.com/differui -k $2 2> test_decode.log
else
    npm run build && cat $1 | stego-js -e -m "$(pbpaste)" -s 8 -p person:twitter.com/differui --fakeMaskPixels 2> test_encode.log 1> test.png && cat test.png | stego-js -d -s 8 -p person:twitter.com/differui 2> test_decode.log
fi

