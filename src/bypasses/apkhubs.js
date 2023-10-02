import BypassDefinition from './BypassDefinition.js';

export default class Apkhubs extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.ifElement("a#downloadbtn", a => {
        this.helpers.safelyNavigate(a.href)
    })
  }
}

export const matches = ['apkhubs.com'];
