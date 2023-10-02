import BypassDefinition from './BypassDefinition.js';

export default class Lkc21 extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setTimeout = f => setTimeout(f, 100)
  }
}

export const matches = ['lkc21.net'];
