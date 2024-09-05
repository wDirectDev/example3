#!/bin/bash

# webpack shell start file

cd examples

if [ ! -d ./node_modules ]; then
    npm install
fi

npm run start:webpack
cd ..

exit 0
