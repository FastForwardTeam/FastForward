import BypassDefinition from './BypassDefinition.js'

export default class Onepieceex extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            this.helpers.ifElement("noscript", n => this.helpers.safelyNavigate(n.textContent))
        })
    }
}

export const matches = ['onepieceex.net']
