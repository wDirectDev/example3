@echo off

setlocal enabledelayedexpansion

rem Project's example batch clean file
rem Emscripten SDK...

set EMSCRIPTENDIR=c:/tools/emscripten/emsdk
set BUILDDIR=build

if exist %BUILDDIR% (
    @rmdir /S /Q %BUILDDIR%
)

exit /b 0