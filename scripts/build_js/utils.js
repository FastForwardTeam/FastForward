import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

/**
 * Asynchronously copies an array of file paths to a specified destination.
 * Directories are copied recursively. Exceptions can be specified to skip certain files or directories.
 *
 * @param {string[]} src - An array of file paths to copy.
 * @param {string} dest - The destination path to copy the files to.
 * @param {string[]} exceptions - An array of file names or paths/directories to skip during the copy process.
 */
export async function copyArray(src, dest, exceptions = []) {
  const absoluteExceptions = exceptions.map((exception) =>
    path.resolve(exception)
  );

  for (const location of src) {
    if (!isInExceptions(location)) {
      const destinationPath = fs.lstatSync(location).isDirectory()
        ? dest
        : path.join(dest, path.basename(location));
      console.log(`Copying ${location} to ${destinationPath}`);
      await fs.copy(location, destinationPath, {
        filter: (src) => {
          const shouldCopySrc = !isInExceptions(src);
          if (!shouldCopySrc) {
            console.log(`Skipping ${src}`);
          }
          return shouldCopySrc;
        },
      });
    } else {
      console.log(`Skipping ${location}`);
    }
  }

  function isInExceptions(src) {
    const absoluteSrc = path.resolve(src);
    const srcBasename = path.basename(src);
    return (
      absoluteExceptions.some((exception) =>
        absoluteSrc.startsWith(exception)
      ) || exceptions.includes(srcBasename)
    );
  }
}

export function changeCwdtoRoot() {
  if (fs.existsSync(path.join(process.cwd(), 'LICENSE'))) {
    console.log(`LICENSE file found in ${process.cwd()}`);
  } else if (process.cwd() === path.parse(process.cwd()).root) {
    console.error('LICENSE file not found in any parent directory');
  } else {
    process.chdir('..');
    changeCwdtoRoot();
  }
}

/**
 *
 * @returns {string} Number of commits since first commit
 */
export function getNumberOfCommits() {
  try {
    const output = execSync('git rev-list --count HEAD', { encoding: 'utf8' });
    return parseInt(output.trim());
  } catch (error) {
    console.error(error);
  }
}

/**
 * Converts a rules.json with trackers and ip_loggers file into two
 * separate declarativeNetRequest rulesets and writes the resulting JSONs to file.
 *
 * @async
 * @function convertRulesToDeclarativeNetRequest
 * @param {string} rulesFilePath - The path to the input JSON file containing the rules to be converted.
 * @param {string} ipLoggerOutputFile - The path to the output file where the ip logger rules will be written.
 * @param {string} trackerOutputFile - The path to the output file where the tracker rules will be written.
 *
 * @returns {Promise<void>}
 */
export async function convertRulesToDNRRulesets(
  rulesFilePath,
  ipLoggerOutputFile,
  trackerOutputFile
) {
  const rules = JSON.parse(await fs.readFile(rulesFilePath));
  const domainRegex = /:\/\/\*?\.?([^/]+)/;
  const ip_loggerRules = rules.ip_logger.map((urlPattern, index) => {
    const domainMatch = urlPattern.match(domainRegex);
    if (!domainMatch) console.error('Unable to parse domain for', urlPattern);
    return {
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { extensionPath: '/html/blocked.html' },
      },
      condition: {
        urlFilter: `||${domainMatch[1]}`,
        resourceTypes: ['main_frame'],
      },
    };
  });

  const trackerRules = rules.tracker.map((urlPattern, index) => {
    const domainMatch = urlPattern.match(domainRegex);
    if (!domainMatch) console.error('Unable to parse domain for', urlPattern);
    return {
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: `https://fastforward.team/bypassed?type=tracker&url=\\0`,
        },
      },
      condition: {
        regexFilter: '^https?://' + domainMatch[1] + '.*',
        resourceTypes: ['main_frame'],
      },
    };
  });

  await fs.writeFile(ipLoggerOutputFile, JSON.stringify(ip_loggerRules));
  await fs.writeFile(trackerOutputFile, JSON.stringify(trackerRules));
}
