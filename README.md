## Configure emscripten SDK

### Emscripten SDK
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
```

### Emscripten SDK: Install and activate SDK 2.0.28
```bash
git pull
./emsdk install 2.0.28
./emsdk activate 2.0.28
```

### Add environment to profile
```bash
source ./emsdk_env.sh
```

## Using included scripts of free-queue library

### Build WebAssembly library to ./build  directory in root of free-queue Project
```bash
chmod +x ./wp-build.sh
./wp-build.sh
```

### Clean compiled WebAssembly library
```bash
chmod +x ./wp-clean.sh
./wp-clean.sh
```

### Build WebAssembly library and Start example free-queue Demo
```bash
chmod +x ./ep-build.sh
./ep-build.bat
```

### Start example free-queue Demo
```bash
chmod +x ./ep-start.sh
./ep-start.bat
```

### Clean compiled WebAssembly library and example of free-queue Demo
```bash
chmod +x ./ep-clean.sh
./ep-clean.sh
```







