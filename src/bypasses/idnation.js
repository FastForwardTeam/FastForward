import BypassDefinition from './BypassDefinition.js';

export default class Idnation extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.ifElement("#linko[href]", b => this.helpers.safelyNavigate(b.href))
  }
}

export const matches = ['idnation.net'];
