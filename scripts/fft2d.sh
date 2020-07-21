npm run build &&
    cat $1 |
    stego-js -e -m "$(pbpaste)" -f FFT2D 2> test.log 1> test.png && cat test.png |
    stego-js -d -f FFT2D
