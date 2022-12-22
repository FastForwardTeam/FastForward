import BypassDefinition from './BypassDefinition.js';

export default class Filedm extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        this.helpers.awaitElement('a#d1button', address => {
            this.helpers.safelyNavigate("http://cdn.directdl.xyz/getfile?id=" + address.href.split("_")[1])
        })
    }
}

export const matches = ['filedm.com']
