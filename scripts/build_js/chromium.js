if (require.main === module)
    throw new Error('This file is a build module, run the build.js file to actually build FastForward');

const zipper = require('adm-zip');

module.exports = async function ({versioning, destination, commit_number, version} = {}) {
    console.log(`[FastForward.build.chromium] building the Chromium package`);
    const z = new zipper();

    z.addLocalFolder(`${process.cwd()}/${destination}`);

    let output_file = `${process.cwd()}/build/dist/`;

    if (!versioning)
        output_file += `FastForward_chromium_${commit_number}_dev.crx`;
    else if ('nover' === versioning)
        output_file += `FastForward_chromium_0.${commit_number}.crx`;
    else
        output_file += `FastForward_${version}_chromium.crx`;

    await z.writeZipPromise(output_file, {});
    console.log('[FastForward.build.chromium] Succesfull build the Chromium package: %s', output_file)
}
