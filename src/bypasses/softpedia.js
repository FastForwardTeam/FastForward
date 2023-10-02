import BypassDefinition from './BypassDefinition.js';

export default class Softpedia extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.ifElement('meta[http-equiv=\'refresh\'][content]', m => {
      let c = m.content.replace('; url=', ';url=');
      if (c.indexOf(';url=') > -1) {
        this.helpers.safelyAssign(c.split(';url=')[1]);
      }
    });
  }
}

export const matches = ['softpedia.com'];
