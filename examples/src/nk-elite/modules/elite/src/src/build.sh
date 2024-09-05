#!/bin/bash

export DIR=`pwd`

export INSTALLDIR="../build"

emcc datafilebank.c SDL2_gfxPrimitives.c SDL2_rotozoom.c ssdl.c main.c docked.c elite.c intro.c planet.c \
shipdata.c shipface.c sound.c space.c swat.c threed.c vector.c random.c trade.c options.c stars.c missions.c \
pilot.c file.c keyboard.c -I../include -Iinclude $EMCCFLAGS -o $INSTALLDIR\$NK_ELITE_WASM_JS
                                                                                                               