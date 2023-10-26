import BypassDefinition from './BypassDefinition.js';

export default class Website extends BypassDefinition {
  constructor() {
    super();
  }

  execute() {
    if (typeof(window.url_done) !== 'string') return;
    this.helpers.safelyAssign(window.url_done);
  }
}

export const matches = ['dilink.net'];
