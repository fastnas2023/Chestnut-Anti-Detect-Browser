#!/bin/bash
set -e

export PATH="$PWD/depot_tools:$PATH"
cd chromium_build/src

echo "Applying patches..."
git apply ../../patches/0001-spoof-webgl-fingerprint.patch
git apply ../../patches/0002-spoof-canvas-fingerprint.patch

echo "Configuring build (args.gn)..."
mkdir -p out/Default
cat <<EOF > out/Default/args.gn
is_debug = false
is_component_build = false
symbol_level = 0
blink_symbol_level = 0
enable_nacl = false
EOF

gn gen out/Default

echo "Starting compilation (this will take hours)..."
autoninja -C out/Default chrome

echo "Build finished! Executable is at chromium_build/src/out/Default/chrome"
