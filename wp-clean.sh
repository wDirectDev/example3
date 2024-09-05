#!/bin/bash

# Project's example shell clean file
# Emscripten SDK...

export BUILDDIR=build

if [ -d $BUILDDIR ]; then
    rm -r -d ./$BUILDDIR
fi

exit 0