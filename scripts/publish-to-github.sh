#!/bin/bash
echo "@dimensiondev:registry=https://npm.pkg.github.com/DimensionDev" > "$HOME/.npmrc"

COMMIT_HSAH=$(git rev-parse --short HEAD)
npm --no-git-tag-version version "0.0.0-$COMMIT_HSAH"
npm publish --tag unstable
