#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

manifest_loc=$1


if [[ $# -lt 2 ]]; then
    version=$(cat ../../src/version.txt)
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version

  elif [ "$2" = "no" ]; then
    version="0.$(git shortlog | grep -E '^[ ]+\w+' | wc -l)"
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version

  else
    version="0.$(git shortlog | grep -E '^[ ]+\w+' | wc -l).$2"
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version
fi

