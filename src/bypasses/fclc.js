import BypassDefinition from './BypassDefinition.js'

export default class Fclc extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            this.helpers.crowdBypass()
        })
    }
}

export const matches = ['fc-lc.com']
