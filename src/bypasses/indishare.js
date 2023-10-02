import BypassDefinition from './BypassDefinition.js';

export default class Indishare extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setTimeout = f => setTimeout(f, 1)
  }
}

export const matches = ['indishare.org', 'solvetube.site'];
