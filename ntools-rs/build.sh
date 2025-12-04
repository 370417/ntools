#!/bin/bash

set -eo pipefail

# cargo test

# build the wasm module
cargo build --release --lib --target wasm32-unknown-unknown

# create output dir for wasm-bindgen
rm -rd pkg
mkdir -p pkg
echo "*" > pkg/.gitignore

# use wasm-bindgen to create typescript bindings to the wasm module
wasm-bindgen target/wasm32-unknown-unknown/release/ntools_rs.wasm --out-dir pkg --typescript

# use wasm-opt to optimize the wasm module
wasm-opt pkg/ntools_rs_bg.wasm -o pkg/ntools_rs.wasm-opt.wasm -O
mv pkg/ntools_rs.wasm-opt.wasm pkg/ntools_rs_bg.wasm

# copy everything except gitignore to frontend
cp pkg/n* ../nview/src/assets/

echo "Done!"
