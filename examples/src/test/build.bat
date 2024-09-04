@echo off

setlocal enabledelayedexpansion

rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set BUILDDIR=build

set SDLTEST_WASM_OUTPUT=nk-elite.asm.js

set CC=emcc
set EMCCFLAGS=-s USE_SDL=2 -s MODULARIZE=1 -s SINGLE_FILE=1 -s EXPORT_ES6=1 -s EXPORT_NAME="LEliteTG" -s EXPORTED_RUNTIME_METHODS=['callMain','ccall','cwrap'] -s INVOKE_RUN=0 -O3
rem set EMCCFLAGS=-s USE_SDL=2 -s INVOKE_RUN=1 -O3


if not exist %BUILDDIR% (
    @mkdir %BUILDDIR%
)

cd src
set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && build.bat"
cd ..

exit /b 0