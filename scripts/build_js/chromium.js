const zipper = require('adm-zip');

module.exports = async function ({versioning, destination, commit_number, version} = {}) {
    console.log(`[FastForward.build.chromium] building the Chromium package`);
    const z = new zipper();

    z.addLocalFolder(`${process.cwd()}/${destination}`);

    let output_file = `${process.cwd()}/build/dist/`;

    if (!versioning)
        output_file += `FastForward_chromium_${commit_number}_dev.zip`;
    else if ('nover' === versioning)
        output_file += `FastForward_chromium_0.${commit_number}.zip`;
    else
        output_file += `FastForward_${version}_chromium.zip`;

    await z.writeZipPromise(output_file, {});
    console.log('[FastForward.build.chromium] Succesfull build the Chromium package: %s', output_file)
}
