#!/bin/sh
DIR=$(dirname $(realpath -P "$0"))
node --experimental-json-modules --experimental-loader "$DIR/src/resolve-hook.mjs" "$DIR/src/main.mjs" $@
