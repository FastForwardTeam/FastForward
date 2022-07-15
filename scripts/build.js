/**
 * This is a general build process runner,
 * Usage: node scripts/build.js {firefox|chromium|all} {none|nover|ver}
 * {firefox|chromium} select weither to build for firefox or chromium
 * {none|nover|ver} none  = dev package DO NOT PASS ANYTHING FOR none
 *                  nover = Creates a package without version number
 *                  ver   = Creates a package with version number as specified in version.txt
 */
const fs = require('fs');
const path = require('path');

const distribution = 'build/dist';

let working_directory = process.cwd();

function set_working_directory (cwd) {
    if (fs.existsSync(path.join(cwd, 'LICENSE')))
        working_directory = cwd;
    else
        set_working_directory(path.join(cwd, '..'));
}

set_working_directory(working_directory);

const args = process.argv;
args.shift();
args.shift()
// skip first 2, they are: node and build.js
if (!args.length) {
    console.error('[FastForward.build] No build type passed defaulting to all, usage: node scripts/build.js {firefox|chromium|all} {none|nover|ver}');
    args[0] = 'all';
}

const [build_type, versioning] = args;
console.log(`[FastForward.build] ${build_type} (${versioning ? versioning : 'dev'}): Creating package...`);

const builds = [];
const builders = {
    firefox: require('./build_js/firefox.js'),
    chromium: require('./build_js/chromium.js')
};

if (fs.existsSync('build'))
    fs.rmSync('build', {recursive: true});

fs.mkdirSync(distribution, {recursive: true});

function copyFolderRecursiveSync( source, target ) {
    let files = [];

    // Check if folder needs to be created or integrated
    const targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                fs.copyFileSync( curSource, `${targetFolder}/${file}` );
            }
        } );
    }
}

async function run_build(type, commit_number) {
    const destination = `build/FastForward.${type}`;

    fs.mkdirSync(destination, {recursive: true});

    console.log(`[FastForward.build.${type}] copying files to ${destination}`);
    console.log(`[FastForward.build.${type}] copying html directory to ${destination}`);
    copyFolderRecursiveSync(`${working_directory}/src/html`, destination);
    console.log(`[FastForward.build.${type}] copying _locales directory to ${destination}`);
    copyFolderRecursiveSync(`${working_directory}/src/_locales`, destination);
    console.log(`[FastForward.build.${type}] copying icon directory to ${destination}`);
    copyFolderRecursiveSync(`${working_directory}/src/icon`, destination);
    console.log(`[FastForward.build.${type}] copying icon_disabled directory to ${destination}`);
    copyFolderRecursiveSync(`${working_directory}/src/icon_disabled`, destination);
    console.log(`[FastForward.build.${type}] copying js files to ${destination}`);
    const js_files = fs.readdirSync(`${working_directory}/src/js`);
    for (const _f of js_files) {
        if (versioning && ['injection_script.js', 'rules.json'].includes(_f))
            continue; // dont copy, no need to remove later on

        fs.copyFileSync(`${working_directory}/src/js/${_f}`, `${destination}/${_f}`);
    }
    console.log(`[FastForward.build.${type}] copying PRIVACY.md to ${destination}`);
    fs.copyFileSync(`${working_directory}/PRIVACY.md`, `${destination}/PRIVACY.md`);

    console.log(`[FastForward.build.${type}] copying manifest to ${destination}`);
    fs.copyFileSync(`${working_directory}/platform_spec/${type}/manifest.json`, `${destination}/manifest.json`);

    console.log(`[FastForward.build.${type}] creating the manifest`);
    const manifest_contents = require(`${working_directory}/${destination}/manifest.json`);
    let version;
    if (!versioning)
        version = `0.${commit_number}.0`
    else if ('nover' === versioning)
        version = `0.${commit_number}`;
    else
        version = fs.readFileSync(`${working_directory}/src/version.txt`, {encoding: 'utf-8'});

    // replace windows OR linux style new lines if they are there
    manifest_contents.version = version.replace(/\r\n/g, '').replace(/\n/g, '');
    fs.writeFileSync(`${working_directory}/${destination}/manifest.json`, JSON.stringify(manifest_contents, null, 4));

    await builders[type]({versioning, destination, commit_number, version: manifest_contents.version});
}

if ('all' === build_type) {
    builds.push('firefox', 'chromium');
} else {
    builds.push(build_type);
}

const {
    exec
} = require('child_process');

exec(`git rev-list HEAD --count`, async (error, stdout, stderr) => {
    for (const _ of builds)
        await run_build(_, stdout.replace('\n', ''));
})

