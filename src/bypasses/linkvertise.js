import BypassDefinition from './BypassDefinition.js';

class Linkvertise extends BypassDefinition {
    constructor() {
        super();
        // custom bypass required bases can be set here
    }
    execute() {
        //linkvertise code here
    }
}

export default new Linkvertise();

export const matches = ['linkvertise.com', 'link.vertise'];
