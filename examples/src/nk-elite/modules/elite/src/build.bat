@echo off

setlocal enabledelayedexpansion

rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set NK_ELITE_OUTPUT=nk-elite.asm.js

set EMCCFLAGS=-O3 ^
-s USE_SDL_GFX=2 ^
-s USE_SDL=2 ^
-s USE_SDL_MIXER=2 ^
--embed-file data/ ^
-s ASYNCIFY=1  ^
-s ALLOW_MEMORY_GROWTH=1 ^
-s USE_ES6_IMPORT_META=1 ^
-s ASSERTIONS=1 ^
-s USE_ZLIB=1 ^
-s WASM=1 ^
-s MODULARIZE=1 ^
-s EXPORT_ES6=1 ^
-s EXPORTED_RUNTIME_METHODS=['callMain','ccall','cwrap'] ^
-s SINGLE_FILE=1 ^
-s EXPORT_NAME=LEliteTG ^
-s INVOKE_RUN=0

cd src
set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && build.bat"
cd ..

@copy build\*.* ..\..\elite\build /Y
