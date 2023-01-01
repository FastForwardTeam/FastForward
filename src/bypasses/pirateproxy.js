import BypassDefinition from './BypassDefinition.js'

export default class Pirateproxy extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        let search = location.search.replace("?", "")
        if (search) {
            this.helpers.safelyNavigate(`https://${search}`)
        }
    }
}

export const matches = ['pirateproxy.wtf']
