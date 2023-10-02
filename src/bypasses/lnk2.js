import BypassDefinition from './BypassDefinition.js';

export default class Lnk2 extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true;
  }

  execute() {
    //If the url doesn't contain /go/, use the insertInfoBox
    if (window.location.href.includes('/go/')) {
      document.getElementById('getLink').removeAttribute('disabled');
      document.getElementById('getLink').click();
    } else {
      this.helpers.insertInfoBox('Please complete the captcha, then we can bypass you');
    }
  }
}

export const matches = ['lnk2.cc'];
