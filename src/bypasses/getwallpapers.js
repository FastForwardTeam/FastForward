import BypassDefinition from './BypassDefinition.js';

export default class Getwallpapers extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setInterval = f => setInterval(f, 1)
  }
}

export const matches = ['getwallpapers.com', 'https://sammobile.com', "https://ydfile.com", "https://mobilemodsapk.com", "https://dlandroid.com", "https://download.modsofapk.com", "https://zedge.net ", "https://fex.net", "https://k2s.cc", " https://u.to"];
