import BypassDefinition from './BypassDefinition.js';

export default class Linegee extends BypassDefinition {
  constructor() {
    super();
  }

  execute() {
    const continueLink = Array.from(document.getElementsByTagName('a')).find(a => a.textContent.trim() === 'Continue');
    const href = continueLink.getAttribute('href');
    this.helpers.safelyNavigate(href);


  }
}

export const matches = ['linegee.net'];
