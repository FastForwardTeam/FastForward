import BypassDefinition from './BypassDefinition.js';

export default class Tlgd extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true
  }

  execute() {
     this.helpers.safelyAssign("http://www.twitlonger.com/show" + location.pathname)
  }
}

export const matches = ['tl.gd'];
