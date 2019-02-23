#!/bin/sh
DIR=$(dirname $(realpath -P "$0"))
node --experimental-modules --loader "$DIR/src/resolve-hook.mjs" "$DIR/src/main.mjs" $@
