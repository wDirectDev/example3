#!/bin/bash

# Work project shell start file
# Emscripten SDK...

cd examples

if [ ! -d ./node_modules ]; then
    npm install
fi

npm run start:webpack

cd ..

exit 0
