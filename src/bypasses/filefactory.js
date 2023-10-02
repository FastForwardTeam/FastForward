import BypassDefinition from './BypassDefinition.js';

export default class Filefactory extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.insertInfoBox("Unfortunately, the download server will ensure that you have waited before allowing you to download the file.")
  }
}

export const matches = ['https://filefactory.com', 'https://file-upload.com', 'https://asdfiles.com', 'https://mega4up.com', ' https://up-load.io', 'https://cosmobox.org', 'https://devdrive.cloud'];
