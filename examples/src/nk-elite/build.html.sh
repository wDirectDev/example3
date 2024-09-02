#!/bin/bash
make  -f Makefile.PHONY.wasi clean
make  distclean

#FLAGS="
#-Oz \
#-s USE_SDL_GFX=2 \
#-s USE_ZLIB=1 \
#-s USE_SDL=2 \
#-s USE_SDL_MIXER=2 \
#--preload-file data/ \
#-s ASYNCIFY=1"
#
#sudo docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk \
#emmake make  \
#LDFLAGS_native="$FLAGS" \
#CC_native=emcc  \
#EXE_native=index.html \
#CFLAGS_native="$FLAGS"


FLAGS="
-Os \
-s USE_SDL_GFX=2 \
-s USE_ZLIB=1 \
-s USE_SDL=2 \
-s USE_SDL_MIXER=2 \
--preload-file data/  \
-s ASYNCIFY=1  \
-s ALLOW_MEMORY_GROWTH=1 \
-s USE_ES6_IMPORT_META=1 \
-s -s ASSERTIONS=1 \
-s USE_ZLIB=1 \
-s WASM=1 \
-s MODULARIZE=1 \
-s EXPORT_ES6=1 \
-s INVOKE_RUN=1"
sudo docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk \
emmake make  \
LDFLAGS_native="$FLAGS" \
CC_native=emcc  \
EXE_native=index.html \
CFLAGS_native="$FLAGS"

#./bin.sh