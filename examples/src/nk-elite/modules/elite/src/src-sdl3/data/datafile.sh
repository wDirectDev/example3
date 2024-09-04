#!/bin/bash

cd `dirname $0` || exit 1

FILES="`ls *.wav *.bmp *.mid *.pcx`"

echo "/* do not edit by hand! it's a generated file by $0 */"
echo "#include <SDL.h>"
echo "#include \"datafile.h\""

echo "const char *datafile_filenames[] = { \"\", "
for file in $FILES ; do
	if [ ! -s $file ]; then
		echo "Error: not a file, or zero size: $file" >&2
		exit 1
	fi
	echo -n "\"$file\", "
done
echo "NULL };"

echo "const int datafile_sizes[] = { 1"
for file in $FILES ; do
	size=`stat --format '%s' $file`
	echo -n ",$size"
done
echo "};"

echo  "const Uint8 datafile_storage[] = { 0xFF"
for file in $FILES ; do
	od -A n -t x1 -v $file | sed 's/ /,0x/g'
done
echo "};"

exit 0
