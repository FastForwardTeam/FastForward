import BypassDefinition from './BypassDefinition.js';

export default class Firefaucet extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    window.setInterval = f => setInterval(f, 1);

  }
}

export const matches = ['firefaucet.win', 'sfirmware.com', 'emulator.games'];
