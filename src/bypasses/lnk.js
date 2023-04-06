import BypassDefinition from './BypassDefinition.js';

export default class Lnk extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    if (!window.location.href.includes('/go/')) {
      window.location.href = window.location.href.replace('lnk.parts', 'lnk.parts/go');
    }
    document.getElementById('get_link_btn').click();
  }
}

export const matches = ['lnk.parts'];

