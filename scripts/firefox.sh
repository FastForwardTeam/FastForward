#!/usr/bin/env bash
#
# This script assumes a linux environment
# Usage: firefox.sh [argument]
#  Arguments: {none} : dev package
#             nover  : Creates a package without version number
#               ver  : Creates a package with version number as specified in version.txt

set -e

echo "*** Universal-bypass.Firefox: Creating package..."
DES=build/universal-bypass.firefox
DIST=build/dist
rm -rf      ./$DES
mkdir -p    ./$DES
rm -rf      ./$DIST
mkdir -p    ./$DIST

echo "*** Universal-bypass.firefox: Copying files"
bash ./scripts/copy_common.sh              $DES
cp platform_spec/firefox/manifest.json    $DES

cd $DES

if [[ $# -eq 0 ]]; then
    echo "*** Universal-bypass.firefox: Creating dev package... (Tip: Use nover to create a no-version package)"
    bash ../../scripts/version.sh manifest.json 0
    zip -qr ../$(basename $DIST)/UniversalBypass_firefox_$(git shortlog | grep -E '^[ ]+\w+' | wc -l)_dev.zip .

elif [ "$1" == "nover" ] ; then
    echo "*** Universal-bypass.firefox: Creating non-versioned package... "
    rm injection_script.js
    rm rules.json
    bash ../../scripts/version.sh manifest.json nover
    zip -qr ../$(basename $DIST)/UniversalBypass_firefox_0.$(git shortlog | grep -E '^[ ]+\w+' | wc -l).zip .

elif [ "$1" == "ver" ]; then
    echo "*** Universal-bypass.firefox: Creating versioned package... "
    rm injection_script.js
    rm rules.json
    bash ../../scripts/version.sh manifest.json
    zip -qr ../$(basename $DIST)/UniversalBypass_$(cat ../../src/version.txt)_firefox.xpi .

fi

echo "*** Universal-bypass.firefox: Package done."
