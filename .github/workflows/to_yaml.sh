#!/bin/sh
set -eu

while [[ ${#} -ge 1 ]]; do
    if [[ -f ./${1}.json ]]; then
        yq -I 4 -o y ./${1}.json | head -c -1 > ./${1}.yaml
    fi

    shift
done