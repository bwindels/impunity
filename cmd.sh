#!/bin/sh
DIR=$(dirname $(realpath -P "$0"))
node --experimental-modules --experimental-json-modules --loader "$DIR/src/resolve-hook.mjs" "$DIR/src/main.mjs" $@
