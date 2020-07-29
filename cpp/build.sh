#!/bin/bash

echo $NODE_ENV

if [ "$NODE_ENV" != "dev" ]; then
    em++ \
    --bind \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
    -s TOTAL_MEMORY=16MB \
    -s ASSERTIONS=0 \
    -s FILESYSTEM=0 \
    -s MODULARIZE=1 \
    -s MALLOC='emmalloc' \
    -s ALLOW_MEMORY_GROWTH=0 \
    -s ENVIRONMENT="worker" \
    -s EXPORT_NAME="BarcodeScanner" \
    -s INLINING_LIMIT=1 \
    -s AGGRESSIVE_VARIABLE_ELIMINATION=1 \
    -s DISABLE_EXCEPTION_CATCHING=1 \
    -I `pwd`/ZBar/include -L`pwd`/cpp \
    --memory-init-file 0 \
    --js-opts 1 --closure 1 --llvm-lto 3 \
    -DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0 \
    -fno-rtti -flto \
    -std=c++17 -Oz -g0 -v -o ./js/scan.js ./cpp/scan_bind.cpp -lzbar
else
    em++ \
    --bind \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
    -s TOTAL_MEMORY=16MB \
    -s ASSERTIONS=0 \
    -s FILESYSTEM=0 \
    -s MODULARIZE=1 \
    -s MALLOC='emmalloc' \
    -s ALLOW_MEMORY_GROWTH=0 \
    -s ENVIRONMENT="worker" \
    -s EXPORT_NAME="BarcodeScanner" \
    -s AGGRESSIVE_VARIABLE_ELIMINATION=0 \
    -s DISABLE_EXCEPTION_CATCHING=0 \
    -I `pwd`/ZBar/include -L`pwd`/cpp \
    --memory-init-file 0 --source-map-base ./js \
    -std=c++17 -O0 -g4 -v -o ./js/scan.js ./cpp/scan_bind.cpp -lzbar
fi


