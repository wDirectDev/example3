#!/bin/bash

# Project's example shell clean file
# Emscripten SDK...

export BUILDDIR=build

if [ -d $BUILDDIR ]; then
    rm -r -d ./$BUILDDIR
fi

cd examples

export SOURCEDIR=src/free-queue
export KEEPFILE=free-queue.js

find $SOURCEDIR -type f -not -name $KEEPFILE -delete

cd ..

echo Example project: Clean completed...

exit 0