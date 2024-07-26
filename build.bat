@echo off
npm run build
cd src-tauri
cargo tauri build
cd ..