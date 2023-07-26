
import BypassDefinition from './BypassDefinition.js'

export default class Cheatsquad extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ODP(window, "steps", {
            get: () => [true]
        })
        this.helpers.ODP(window, "youtube", {
            get: () => 1
        })
        this.helpers.ensureDomLoaded(() => document.querySelectorAll("div.loader").forEach(d => d.className = "check_loader"))
    }
}

export const matches = ['cheatsquad.gg']
