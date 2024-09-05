#!/bin/bash

# webpack shell build file

cd examples

if [ ! -d ./node_modules ]; then
    npm install
fi

npm run build:webpack
cd ..

exit 0
