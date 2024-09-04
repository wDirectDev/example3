@echo off

setlocal enabledelayedexpansion

rem Emscripten SDK...

set EMSCRIPTENDIR=c:/emscripten/emsdk
set BUILDDIR=build

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

cd src
set DIR=%cd%
@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %DIR:~0,2% && cd %DIR% && automake.bat clean"
cd ..

rem if exist examples\src\free-queue (
rem     @rmdir /S /Q examples\src\free-queue
rem )

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