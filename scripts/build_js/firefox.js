const fs = require('fs').promises;

if (require.main === module)
    throw new Error('This file is a build module, run the build.js file to actually build FastForward');

const zipper = require('adm-zip');

module.exports = async function ({versioning, destination, commit_number, version} = {}) {
    console.log(`[FastForward.build.firefox] building the FireFox package`);
    const z = new zipper();

//    console.log(`[FastForward.build.firefox] injecting the linkvertise bypass`);
//
//    const bypass = await fs.readFile(`${process.cwd()}/src/linkvertise.js`);
//
//    await fs.appendFile(`${process.cwd()}/build/FastForward.firefox/injection_script.js`, bypass);

    z.addLocalFolder(`${process.cwd()}/${destination}`);

    let output_file = `${process.cwd()}/build/dist/`;

    if (!versioning)
        output_file += `FastForward_firefox_${commit_number}_dev.xpi`;
    else if ('nover' === versioning)
        output_file += `FastForward_firefox_0.${commit_number}.xpi`;
    else
        output_file += `FastForward_${version}_firefox.xpi`;

    await z.writeZipPromise(output_file, {});
    console.log('[FastForward.build.firefox] Succesfully built the FireFox package: %s', output_file)
}
