@echo off

setlocal enabledelayedexpansion

set DIR=%cd%

set INSTALLDIR=..\build

rem Emscripten SDK...

%CC% src/sdltest.c -I../include -Iinclude %EMCCFLAGS% -o %INSTALLDIR%\%SDLTEST_WASM_OUTPUT%
