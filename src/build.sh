#!/bin/sh

# Emscripten SDK...
# export EMSCRIPTENDIR=c:/emscripten/emsdk

export SOURCEDIR=`pwd`

find $SOURCEDIR -type f -name '*.js' -delete
find $SOURCEDIR -type f -name '*.wasm' -delete
find $SOURCEDIR -type f -name '*.data' -delete

sh ./automake.sh

exit 0