@echo off

setlocal enabledelayedexpansion

rem Project's example batch clean file
rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set BUILDDIR=build

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

cd examples

set SOURCEDIR=src\free-queue
set KEEPFILE=free-queue.js

for %%a in ( "%SOURCEDIR%\*" ) do if /i not "%%~nxa"=="%KEEPFILE%" @del "%%a"

cd ..

@echo Example project: Clean completed...

exit /b 0