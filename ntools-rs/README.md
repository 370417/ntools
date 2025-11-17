## Setup

```
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
cargo install wasm-opt
```

For animation data, copy the file `anim_data_line_new.txt.bin` from your copy of the game into the `src/` folder, then run the script in `src/bin/anim.rs` to generate `src/anim_data_line_f32.txt.bin`.

## Build

```
wasm-bindgen target/wasm32-unknown-unknown/release/<your-project>.wasm --out-dir ../nview/public --typescript --target web
```
