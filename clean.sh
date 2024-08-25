#!/bin/sh

# Emscripten SDK...
# export EMSCRIPTENDIR=c:/emscripten/emsdk

export BUILDDIR=build

if [ -d $BUILDDIR ]; then
    rm -r -d ./$BUILDDIR
fi

cd src
export DIR=`pwd`
sh ./automake.sh clean
cd ..

# if [ -d ./examples/src/free-queue ]; then 
#     rmdir -p ./examples/src/free-queue
# fi

cd examples

export SOURCEDIR=src/free-queue
export KEEPFILE=free-queue.js

find $SOURCEDIR -type f -not -name $KEEPFILE -delete

if [ -d ./node_modules ]; then
    rm -r -d ./node_modules
fi

if [ -d ./dist ]; then
    rm -r -d ./dist
fi

cd ..

echo Whole project is clean...

exit 0