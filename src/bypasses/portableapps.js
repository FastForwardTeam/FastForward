import BypassDefinition from './BypassDefinition.js';

export default class Portableapps extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    //Check if the url contains "/downloading"
    if (window.location.href.indexOf('/downloading') > -1) {
      let url = window.location.href;
      let urlSplit = url.split('&f=');
      let urlSplit2 = urlSplit[1].split('&');
      let finalUrl = "https://download2.portableapps.com/portableapps/PortableApps.comPlatform/" + urlSplit2
      //Open finalUrl in a new tab
      window.open(finalUrl, '_blank');
    }
  }
}

export const matches = ['portableapps.com'];
