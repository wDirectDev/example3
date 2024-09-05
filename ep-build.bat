@echo off

setlocal enabledelayedexpansion

rem Project's example batch build file
rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set BUILDDIR=build

set CC=emcc
set EMCCFLAGS=-s MODULARIZE=1 -s EXPORT_ES6=1 -s SINGLE_FILE=0 -s TOTAL_MEMORY=200MB -s ALLOW_MEMORY_GROWTH=0 -s EXPORT_NAME=LFreeQueue -s EXPORTED_RUNTIME_METHODS=['callMain','ccall','cwrap'] -s INVOKE_RUN=0 -O3

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

cd examples

set SOURCEDIR=src\free-queue
set KEEPFILE=free-queue.js

for %%a in ( "%SOURCEDIR%\*" ) do if /i not "%%~nxa"=="%KEEPFILE%" @del "%%a"

if exist dist (
    @rmdir /S /Q dist
)

cd ..

if not exist %BUILDDIR% (
    @mkdir %BUILDDIR%
)

cd src
set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && build.bat"
cd ..

if not exist examples\src\free-queue (
    mkdir examples\src\free-queue
)

@copy %BUILDDIR%\*.* examples\src\free-queue /Y

cd examples

if not exist node_modules (
    @call cmd /C "npm install"
)

@call cmd /C "npm run build:webpack"
@call cmd /C "npm run start:webpack"

cd ..

exit /b 0