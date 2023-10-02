import BypassDefinition from './BypassDefinition.js';

export default class Uploadking extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true
  }

  execute() {
    this.helpers.ifElement("form[name='F1']", f => this.helpers.countIt(() => f.submit()))
  }
}

export const matches = ['uploadking.net'];
