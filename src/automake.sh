#!/bin/sh

export DIR=`pwd`

export INSTALLDIR=../$BUILDDIR

export JS_FILE=free-queue.js
export JS_FILE_TEMP=free-queue.js.temp
export JS_FILE_PART=free-queue.js.part
export JS_WASM_FILE=free-queue.asm.wasm
export JS_WASM_JS_FILE=free-queue.asm.js
export JS_WASM_WORKER_FILE=free-queue.asm.worker.js

if [ -f $JS_FILE ]; then
	echo Delete existing file: $JS_FILE
	rm $JS_FILE
fi

if [ -f $JS_WASM_JS_FILE ]; then
	echo Delete existing file: $JS_WASM_JS_FILE
	rm $JS_WASM_JS_FILE
fi

if [ -f $JS_WASM_WORKER_FILE ]; then
	echo Delete existing file: $JS_WASM_WORKER_FILE
	rm $JS_WASM_WORKER_FILE
fi

if [ -f $JS_WASM_FILE ]; then
	echo Delete existing file: $JS_WASM_FILE
	rm $JS_WASM_FILE
fi

if [ $1 == "clean" ]; then
	echo Source directory: Clean completed...
	exit 0
fi

echo $CC: free_queue.cpp -Llib -I../include -Iinclude -pthread $EMCCFLAGS -o $JS_WASM_JS_FILE
$CC free_queue.cpp -Llib -I../include -Iinclude -pthread $EMCCFLAGS -o $JS_WASM_JS_FILE

# cat $JS_FILE_PART >> $JS_FILE
cat $JS_FILE_PART >> $JS_FILE

if [ -f $JS_FILE ]; then
	echo Copy existing file: $DIR/$JS_FILE $INSTALLDIR/$JS_FILE
	cp $DIR/$JS_FILE $INSTALLDIR/$JS_FILE
fi

if [ -f $JS_WASM_JS_FILE ]; then
	echo Copy existing file: $DIR/$JS_WASM_JS_FILE $INSTALLDIR/$JS_WASM_JS_FILE
	cp $DIR/$JS_WASM_JS_FILE $INSTALLDIR/$JS_WASM_JS_FILE
fi

if [ -f $JS_WASM_WORKER_FILE ]; then
	echo Copy existing file: $DIR/$JS_WASM_WORKER_FILE $INSTALLDIR/$JS_WASM_WORKER_FILE
	cp $DIR/$JS_WASM_WORKER_FILE $INSTALLDIR/$JS_WASM_WORKER_FILE
fi

if [ -f $JS_WASM_FILE ]; then
	echo Copy existing file: $DIR/$JS_WASM_FILE $INSTALLDIR/$JS_WASM_FILE
	cp $DIR/$JS_WASM_FILE $INSTALLDIR/$JS_WASM_FILE
fi

exit 0

