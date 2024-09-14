@echo off

setlocal enabledelayedexpansion

rem Project's example batch clean file
rem Emscripten SDK...

set EMSCRIPTENDIR=c:/tools/emscripten/emsdk
set BUILDDIR=build

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

cd src
set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && automake.bat clean"
cd ..

cd examples

set SOURCEDIR=src\free-queue
set KEEPFILE=free-queue.js

for %%a in ( "%SOURCEDIR%\*" ) do if /i not "%%~nxa"=="%KEEPFILE%" @del "%%a"

if exist node_modules (
    @rmdir /S /Q node_modules
)

if exist dist (
    @rmdir /S /Q dist
)

cd ..

@echo Example project: Clean completed...

exit /b 0