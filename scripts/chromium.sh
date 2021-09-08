#!/usr/bin/env bash
#
# This script assumes a linux environment
# Usage: chromium.sh [argument]
#  Arguments: {none} : dev package
#             nover  : Creates a package without version number
#               ver  : Creates a package with version number

set -e

echo "*** Universal-bypass.Chromium: Creating package..."
DES=build/universal-bypass.chromium
DIST=build/dist
rm -rf $DES
mkdir -p $DES
rm -rf $DIST
mkdir -p $DIST

echo "*** Universal-bypass.Chromium: Copying files"
cp -R html/ $DES
cp -R _locales/ $DES
cp -R icon/ $DES
cp -R icon_disabled/ $DES
cp -RT js/ $DES
cp manifest.json $DES
cp rules.json $DES
cp PRIVACY.md $DES

cd $DES

if [[ $# -eq 0 ]]; then
    echo "*** Universal-bypass.Chromium: Creating dev package... (Tip: Use nover to create a normal package)"
    zip -qr ../$(basename $DIST)/UniversalBypass_chromium_dev.zip .

elif [[ "$1" == "nover" ]] ; then
    echo "*** Universal-bypass.Chromium: Creating non-versioned package... "
    rm injection_script.js
    zip -qr ../$(basename $DIST)/UniversalBypass_chromium_0.zip .

elif [[ "$1" == "ver" ]]; then
    echo "*** Universal-bypass.Chromium: Creating versioned package... "
    rm injection_script.js
    zip -qr ../$(basename $DIST)/UniversalBypass_"$2"_chromium.zip .

fi

echo "*** Universal-bypass.Chromium: Package done."
