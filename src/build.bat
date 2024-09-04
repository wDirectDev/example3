@echo off

setlocal enabledelayedexpansion

rem Emscripten SDK...

set SOURCEDIR=src\free-queue
set KEEPFILE=free-queue.js

set SOURCEDIR=%cd%

for %%a in ( "%SOURCEDIR%\*.js" ) do @del "%%a"
for %%a in ( "%SOURCEDIR%\*.wasm" ) do @del "%%a"
for %%a in ( "%SOURCEDIR%\*.data" ) do @del "%%a"

@call cmd /C "%EMSCRIPTENDIR:~0,2% && cd %EMSCRIPTENDIR% && emsdk_env.bat && %SOURCEDIR:~0,2% && cd %SOURCEDIR% && automake.bat"

exit /b 0