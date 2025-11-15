## Setup

```
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
cargo install wasm-opt
```

## Build

```
wasm-bindgen target/wasm32-unknown-unknown/release/<your-project>.wasm --out-dir ../nview/public --typescript --target web
```
