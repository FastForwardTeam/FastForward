#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

manifest_loc=$1


if [[ $# -lt 2 ]]; then #Creates a normal versioned json using only version.txt

    version=$(cat ../../src/version.txt)
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version

  elif [ "$2" = "nover" ]; then #Creates a non-versioned json using only number of commits

    version="0.$(git shortlog | grep -E '^[ ]+\w+' | wc -l)"
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version

  else #Creates a json using the number of commits and appends the second argument to it

    version="0.$(git shortlog | grep -E '^[ ]+\w+' | wc -l).$2"
    sed -i '/"version":/c\  "version": "'$version'",' $1
    echo vesrioned $(basename $1) to $version
fi

