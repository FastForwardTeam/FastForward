import esMain from "es-main";
if (esMain(import.meta))
    throw new Error('This file is a build module, run the build.js file to actually build FastForward');

import zipper from 'adm-zip';
import * as path from "path";
// const zipper = require('adm-zip');

export default async function ({versioning, destination, commit_number, version} = {}) {
    console.log(`[FastForward.build.firefox] building the FireFox package`);
    const z = new zipper();

    z.addLocalFolder(destination);

    let output_file = path.join(destination, '..', 'dist');

    if (!versioning)
        output_file += `/FastForward_firefox_${commit_number}_dev.xpi`;
    else if ('nover' === versioning)
        output_file += `/FastForward_firefox_0.${commit_number}.xpi`;
    else
        output_file += `/FastForward_${version}_firefox.xpi`;

    await z.writeZipPromise(output_file, {});
    console.log('[FastForward.build.firefox] Succesfull build the FireFox package: %s', output_file)
}
