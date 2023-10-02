import BypassDefinition from './BypassDefinition.js';

export default class Onelink extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true;
  }

  execute() {
    window.setInterval = f => setInterval(f, 1);
    let b = document.getElementById('go_next');
    if (b && this.helpers.isGoodLink(b.href)) {
      this.helpers.safelyAssign(b.href);
    } else {
      this.helpers.ifElement('#download', b => this.helpers.safelyNavigate(b.href));
    }
  }
}

export const matches = ['1link.club'];
