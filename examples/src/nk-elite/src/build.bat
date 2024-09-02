@echo off

setlocal enabledelayedexpansion

set DIR=%cd%

set INSTALLDIR=..\build

rem Emscripten SDK...

set NK_ELITE_WASM_JS=nk-elite.html

set EMCCFLAGS=-O3 ^
-s USE_SDL_GFX=2 ^
-s USE_ZLIB=1 ^
-s USE_SDL=2 ^
-s USE_SDL_MIXER=2 ^
--preload-file data/ ^
-s ASYNCIFY=1  ^
-s ALLOW_MEMORY_GROWTH=1 ^
-s USE_ES6_IMPORT_META=1 ^
-s ASSERTIONS=1 ^
-s USE_ZLIB=1 ^
-s WASM=1 ^
-s SINGLE_FILE=1 ^
-s MODULARIZE=0 ^
-s EXPORT_ES6=0 ^
-s INVOKE_RUN=1

emcc datafilebank.c SDL2_gfxPrimitives.c SDL2_rotozoom.c ssdl.c main.c docked.c elite.c intro.c planet.c ^
shipdata.c shipface.c sound.c space.c swat.c threed.c vector.c random.c trade.c options.c stars.c missions.c ^
pilot.c file.c keyboard.c -I../include -Iinclude %EMCCFLAGS% -o %INSTALLDIR%\%NK_ELITE_WASM_JS%
