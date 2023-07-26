import BypassDefinition from './BypassDefinition.js';

export default class Pcgamestorrents extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setInterval = f => setInterval(f, 1)
    this.helpers.transparentProperty("Time_Start", t => t - 5000)
    this.helpers.awaitElement("input#nut[src]", i => i.parentNode.submit())

  }
}

export const matches = ['dl.pcgamestorrents.org'];
