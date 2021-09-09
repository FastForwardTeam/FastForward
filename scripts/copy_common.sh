#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

DES=$1

#bash ./tools/make-assets.sh        $DES

cp -R src/html/             $DES
cp -R src/_locales/         $DES
cp -R src/icon/             $DES
cp -R src/icon_disabled/    $DES
cp -RT src/js/              $DES
cp PRIVACY.md               $DES
