import BypassDefinition from './BypassDefinition.js';

export default class Adtival extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true;
  }

  execute() {
    console.log('Adtival found!');

  }
}

export const matches = [
  /movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis|onlinecorp)\.me|(liveshootv|modebaca|haipedia|sekilastekno|miuiku|vebma)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id|healthinsider\.online/,
  'www.adtival.network',
];
