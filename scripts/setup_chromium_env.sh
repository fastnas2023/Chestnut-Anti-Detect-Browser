#!/bin/bash
set -e

# 1. Clone depot_tools
if [ ! -d "depot_tools" ]; then
  git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
fi
export PATH="$PWD/depot_tools:$PATH"

# 2. Create chromium build directory
mkdir -p chromium_build && cd chromium_build

# 3. Fetch chromium source (this takes a very long time)
if [ ! -d "src" ]; then
  fetch --nohooks chromium
fi

# 4. Sync dependencies
cd src
gclient sync --with_branch_heads --with_tags

echo "Chromium environment setup complete."
