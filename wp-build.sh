#!/bin/bash

# Work project shell build file
# Emscripten SDK...

export BUILDDIR=build

export CC=emcc
export EMCCFLAGS="-s MODULARIZE=1 -s EXPORT_ES6=1 -s SINGLE_FILE=0 -s TOTAL_MEMORY=200MB -s ALLOW_MEMORY_GROWTH=0 -s EXPORTED_RUNTIME_METHODS=['callMain','ccall','cwrap'] -s INVOKE_RUN=0 -O3"

if [ -d $BUILDDIR ]; then
    rm -r -d ./$BUILDDIR
fi

if [ ! -d ./$BUILDDIR ]; then
    mkdir -p ./$BUILDDIR
fi

cd src

export DIR=`pwd`
sh ./build.sh

cd ..

exit 0
