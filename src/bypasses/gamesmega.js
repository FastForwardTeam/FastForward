import BypassDefinition from './BypassDefinition.js'

export default class Gamesmega extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ODP(window, "hash", {
            get: () => "",
            set: _ => this.helpers.safelyNavigate(decodeURIComponent(atob(_)))
        })
    }
}

export const matches = ['gamesmega.net']
