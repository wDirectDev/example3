#!/bin/bash

od \
--output-duplicates \
--address-radix=n \
--width=1 \
--format=u1 ./index.wasm | tr '\n' ',' > ./wasm
echo "export default [" >>./dist/wasmBinary.mjs
cat ./wasm  >>./dist/wasmBinary.mjs
echo "]" >>./dist/wasmBinary.mjs
mv ./index.mjs ./dist/index.mjs
mv ./index.wasm ./dist/index.wasm
mv ./index.data ./dist/index.data
rm ./wasm

