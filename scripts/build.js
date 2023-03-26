/**
 * This is a general build process runner,
 * Usage: node scripts/build.js {firefox|chromium|all} {none|nover|ver}
 * {firefox|chromium} select weither to build for firefox or chromium
 * {none|nover|ver} none  = dev package DO NOT PASS ANYTHING FOR none
 *                  nover = Creates a package without version number
 *                  ver   = Creates a package with version number as specified in version.txt
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const path = require("path");

let working_directory = process.cwd();

function set_working_directory(cwd) {
  if (fs.existsSync(path.join(cwd, "LICENSE"))) {
    working_directory = cwd;
  } else set_working_directory(path.join(cwd, ".."));
}
set_working_directory(working_directory);

const distribution = `${working_directory}/build/dist`;
const args = process.argv;
args.shift();
args.shift();
// skip first 2, they are: node and build.js
if (!args.length) {
  console.error(
    "[FastForward.build] No build type passed defaulting to all, usage: node scripts/build.js {firefox|chromium|all} {none|nover|ver}"
  );
  args[0] = "all";
}

const [build_type, versioning] = args;
console.log(
  `[FastForward.build] ${build_type} (${
    versioning ? versioning : "dev"
  }): Creating package...`
);

const builds = [];
import ff_builder from "./build_js/firefox.js";
import chrm_builder from "./build_js/chromium.js";

const builders = {
  firefox: ff_builder,
  chromium: chrm_builder,
};

if (fs.existsSync(`${working_directory}/build`))
  fs.rmSync(`${working_directory}/build`, { recursive: true });

fs.mkdirSync(distribution, { recursive: true });

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, `${targetFolder}/${file}`);
      }
    });
  }
}

async function run_build(type, commit_number) {
  const destination = `${working_directory}/build/FastForward.${type}`;

  fs.mkdirSync(destination, { recursive: true });

  console.log(`[FastForward.build.${type}] copying files to ${destination}`);
  console.log(
    `[FastForward.build.${type}] copying html directory to ${destination}`
  );
  copyFolderRecursiveSync(`${working_directory}/src/html`, destination);
  console.log(
    `[FastForward.build.${type}] copying _locales directory to ${destination}`
  );
  copyFolderRecursiveSync(`${working_directory}/src/_locales`, destination);
  console.log(
    `[FastForward.build.${type}] copying icon directory to ${destination}`
  );
  copyFolderRecursiveSync(`${working_directory}/src/icon`, destination);
  console.log(
    `[FastForward.build.${type}] copying icon_disabled directory to ${destination}`
  );
  copyFolderRecursiveSync(
    `${working_directory}/src/icon_disabled`,
    destination
  );
  console.log(`[FastForward.build.${type}] copying js files to ${destination}`);
  const js_files = fs.readdirSync(`${working_directory}/src/js`);
  for (const _f of js_files) {
    fs.copyFileSync(
      `${working_directory}/src/js/${_f}`,
      `${destination}/${_f}`
    );
  }
  console.log(
    `[FastForward.build.${type}] copying PRIVACY.md to ${destination}`
  );
  fs.copyFileSync(
    `${working_directory}/PRIVACY.md`,
    `${destination}/PRIVACY.md`
  );

  console.log(
    `[FastForward.build.${type}] copying jszip.min.js to ${destination}`
  );
  fs.copyFileSync(
    `${working_directory}/src/external/jszip.min.js`,
    `${destination}/jszip.min.js`
  );

  console.log(`[FastForward.build.${type}] copying manifest to ${destination}`);
  fs.copyFileSync(
    `${working_directory}/platform_spec/${type}/manifest.json`,
    `${destination}/manifest.json`
  );

  console.log(
    `[FastForward.build.${type}] copying bypass files to ${destination}`
  );
  copyFolderRecursiveSync(`${working_directory}/src/bypasses`, destination);

  console.log(
    `[FastForward.build.${type}] copying helper files to ${destination}`
  );
  copyFolderRecursiveSync(`${working_directory}/src/helpers`, destination);

  console.log(`[FastForward.build.${type}] creating the manifest`);
  const manifest_contents = require(`${destination}/manifest.json`);
  let version;
  if (!versioning) version = `0.${commit_number}.0`;
  else if ("nover" === versioning) version = `0.${commit_number}`;
  else
    version = fs.readFileSync(`${working_directory}/src/version.txt`, {
      encoding: "utf-8",
    });

  // replace windows OR linux style new lines if they are there
  manifest_contents.version = version.replace(/\r\n/g, "").replace(/\n/g, "");
  fs.writeFileSync(
    `${destination}/manifest.json`,
    JSON.stringify(manifest_contents, null, 4)
  );

  await builders[type]({
    versioning,
    destination,
    commit_number,
    version: manifest_contents.version,
  });
}

if ("all" === build_type) {
  builds.push("firefox", "chromium");
} else {
  builds.push(build_type);
}

const { exec } = require("child_process");

exec(`git rev-list HEAD --count`, async (error, stdout, stderr) => {
  const bypasses = {};

  for (const _ of fs.readdirSync(`${working_directory}/src/bypasses`)) {
    if (_ === "BypassDefinition.js") continue;

    const bypass = await import(
      `file:///${working_directory}/src/bypasses/${_}`
    );
    bypass.matches.map((match) => {
      bypasses[match] = `bypasses/${_}`;
    });
  }

  fs.writeFileSync(
    `${working_directory}/src/js/injection_script.js`,
    `const bypasses = ${JSON.stringify(bypasses)};

if (bypasses.hasOwnProperty(location.host)) {
    const bypass_url = bypasses[location.host];
    
    import(\`\${window.x8675309bp}\${bypass_url}\`).then(({default: bypass}) => {
        import(\`\${window.x8675309bp}helpers/dom.js\`).then(({default: helpers}) => {
            const bps = new bypass;
            bps.set_helpers(helpers);
            console.log('ensure_dom: %r', bps.ensure_dom);
            if (bps.ensure_dom) {
                let executed = false;
                document.addEventListener('readystatechange', () => {
                    if (['interactive', 'complete'].includes(document.readyState) && !executed) {
                        executed = true;
                        bps.execute();
                    }
                });
                document.addEventListener("DOMContentLoaded",()=>{
                    if (!executed) {
                        executed = true;
                        bps.execute();
                    }
                });
            } else {
                bps.execute();
            }   
        });
    });
}`
  );
  for (const _ of builds) await run_build(_, stdout.replace("\n", ""));
});
