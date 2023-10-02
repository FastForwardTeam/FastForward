import BypassDefinition from './BypassDefinition.js';

export default class Ux9 extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.safelyAssign(window.ux_secure.fullUrl);
  }
}

export const matches = ['ux9.de'];
