import BypassDefinition from './BypassDefinition.js'

export default class Enlacito extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.safelyNavigate(window.DYykkzwP)
    }
}

// This is a link protecor that I've seen in many domains, so this script probably works in many of them
// If you find another domain that uses this script, please add it to the array below
export const matches = ['enlacito.com']
