import BypassDefinition from './BypassDefinition.js';

export default class Curseforge extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setInterval = f => setInterval(f, 100)
  }
}

export const matches = ['curseforge.com'];
