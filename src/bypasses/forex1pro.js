import BypassDefinition from './BypassDefinition.js'

export default class Forex1pro extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            this.helpers.safelyAssign(`https://fx4vip.com${location.pathname}`)
        })
    }
}

export const matches = ['forex1pro.com']
