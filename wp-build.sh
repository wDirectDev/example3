#!/bin/bash

# Work project shell build file
# Emscripten SDK...

cd examples

if [ ! -d ./node_modules ]; then
    npm install
fi

npm run build:webpack
cd ..

exit 0
