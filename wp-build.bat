@echo off

setlocal enabledelayedexpansion

rem Work project batch build file
rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set BUILDDIR=build

set CC=emcc
set EMCCFLAGS=-s MODULARIZE=1 -s EXPORT_ES6=1 -s SINGLE_FILE=0 -s TOTAL_MEMORY=200MB -s ALLOW_MEMORY_GROWTH=0 -s EXPORT_NAME=LFreeQueue -s EXPORTED_RUNTIME_METHODS=['callMain','ccall','cwrap'] -s INVOKE_RUN=0 -O3

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

if not exist %BUILDDIR% (
    @mkdir %BUILDDIR%
)

cd src

set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && build.bat"

cd ..

exit /b 0