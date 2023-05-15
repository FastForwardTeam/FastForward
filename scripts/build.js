/**
 * This is a general build process runner,
 * Usage: node scripts/build.js {firefox|chromium|all} {none|nover|ver}
 * {firefox|chromium| all} select weither to build for firefox or chromium
 * {nover|ver}      nover = Creates a package without version number
 *                  ver   = Creates a package with version number as specified in version.txt
 */
import webExt from 'web-ext';
import fs from 'fs-extra';
import ejs from 'ejs';
import process from 'process';
import path from 'path';
import * as utils from './build_js/utils.js';

utils.changeCwdtoRoot();
let working_directory = process.cwd();
const distribution = `${working_directory}/build/dist`;
let [browser, version] = process.argv.slice(2);

if (!['firefox', 'chromium', 'all'].includes(browser)) {
  console.error(
    'Invalid browser argument. Must be "firefox", "chromium" or "all".'
  );
  process.exit(1);
}

if (!['nover', 'ver'].includes(version) && version) {
  console.error('Invalid version argument. Must be "nover", "ver" or none.');
  process.exit(1);
}
if (version === undefined) version = 'nover';

if (fs.existsSync(`${working_directory}/build`))
  fs.rmSync(`${working_directory}/build`, { recursive: true });

fs.mkdirSync(distribution, { recursive: true });

let browserDir;
if (browser !== 'all')
  browserDir = `${working_directory}/build/FastForward.${browser}`;
else browserDir = `${working_directory}/build/FastForward.firefox`; //If building for both browsers build for the better one first and then copy it to chromium
fs.mkdirSync(browserDir);

// Copy privacy.md and src except js
let src = ['./src', './docs/PRIVACY.md'];
let exceptions = ['./src/js/', 'version.txt'];
await utils.copyArray(src, browserDir, exceptions);

//copy js
src = ['./src/js'];
exceptions = ['injection_script-original.js', 'injection_script.js'];
await utils.copyArray(src, browserDir, exceptions);

let bypasses = {};
for (const i of fs.readdirSync(`${working_directory}/src/bypasses`)) {
  if (i === 'BypassDefinition.js') continue;

  const bypass = await import(`file://${working_directory}/src/bypasses/${i}`);
  bypass.matches.map((match) => {
    bypasses[match] = `bypasses/${i}`;
  });
}

/* build injection script*/
const template = fs.readFileSync(
  './scripts/build_js/injection_script_template.js',
  'utf8'
);
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';
bypasses = JSON.stringify(bypasses);
const result = ejs.render(template, { bypasses });

// Write the result to the injection_script.js file
const outputPath = path.join(`${browserDir}/injection_script.js`);
fs.writeFileSync(outputPath, result);

if (browser === 'all') {
  const chromiumDir = `${working_directory}/build/FastForward.chromium`;
  fs.mkdirSync(chromiumDir);
  await utils.copyArray([browserDir], chromiumDir);
}

/*version*/
let packageVersion = '';
if (version === 'ver') {
  packageVersion = fs.readFileSync('version.txt', 'utf-8').trim();
} else if (version === 'nover') {
  const lastCommit = utils.getNumberOfCommits();
  packageVersion = `0.${lastCommit}`;
}

async function buildExtension(browser) {
  const targetBrowser = browser === 'firefox' ? 'firefox-desktop' : 'chromium';
  const browserOutDir = `${working_directory}/build/FastForward.${browser}`;
  const browserSrcDir = `${working_directory}/platform_spec/${browser}`;
  const manfistFile = `${browserSrcDir}/manifest.json`;
  await utils.copyArray([manfistFile], browserOutDir);
  fs.writeFileSync(
    `${browserOutDir}/manifest.json`,
    JSON.stringify(
      Object.assign(JSON.parse(fs.readFileSync(manfistFile, 'utf8')), {
        version: packageVersion,
      }),
      null,
      4 //pretty print
    )
  );
  await utils.convertRulesToDNRRulesets(
    `${browserOutDir}/rules.json`,
    `${browserOutDir}/ip_logger_blocker.json`,
    `${browserOutDir}/tracker_bypass.json`
  );

  await webExt.cmd.build(
    {
      sourceDir: browserOutDir,
      artifactsDir: `${distribution}`,
      overwriteDest: true,
      browser: targetBrowser,
    },
    { shouldExitProgram: false }
  );
  fs.renameSync(
    `${distribution}/fastforward-${packageVersion}.zip`,
    `${distribution}/FastForward_${browser}_${packageVersion}.zip`
  );
}

if (browser === 'all') {
  await buildExtension('firefox');
  await buildExtension('chromium');
} else {
  await buildExtension(browser);
}
