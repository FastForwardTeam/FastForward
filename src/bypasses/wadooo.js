import BypassDefinition from './BypassDefinition.js'

export default class Wadooo extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.crowdPath(location.hash.substring(1))
        this.helpers.crowdBypass()
    }
}

export const matches = ['wadooo.com']
