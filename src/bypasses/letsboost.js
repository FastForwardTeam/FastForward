import BypassDefinition from './BypassDefinition.js'

export default class Letsboost extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        const jsonDat = window.JSON.parse(stepDat);
        this.helpers.safelyNavigate(jsonDat[jsonDat.length-1]["url"]);
    }
}

export const matches = ['letsboost.net']