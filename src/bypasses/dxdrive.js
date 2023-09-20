import BypassDefinition from './BypassDefinition.js';

export default class Dxdrive extends BypassDefinition {
    constructor() {
        super();
        // Custom bypass required bases can be set here
    }

    execute() {
            window.setInterval = f => setInterval(f, 1);
    }
}

// Define the list of domains to match against
export const matches = ['njiir.com', 'healthykk.com', 'linkasm.com', 'dxdrive.com', 'getwallpapers.com', 'sammobile.com', 'ydfile.com', 'mobilemodsapk.com', 'dlandroid.com', 'download.modsofapk.com', 'punchsubs.net', 'zedge.net', 'fex.net', 'k2s.cc', 'muhammadyoga.me','u.to', 'skiplink.io', 'uploadfree.info', 'freeupload.info', 'fstore.biz'];
