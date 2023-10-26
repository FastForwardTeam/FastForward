import BypassDefinition from './BypassDefinition.js';

export default class Bluemediafile extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true;
  }

  execute() {
    if (location.href.match(/\/url-generator(-\d+)?\.php\?url=/) === null)
      return;

    window.Time_Start -= 5000;
    window.i = 0;
    this.helpers.awaitElement('input#nut[src]', (i) => i.parentNode.submit());
  }
}

export const matches = [
  'bluemediafiles.com',
  'bluemediafile.sbs',
  'bluemediafile.site',
];
