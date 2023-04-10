import BypassDefinition from './BypassDefinition.js'

export default class Akoam extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        this.helpers.ODP(window, 'timer', {
            value: 0,
            writable: false
        })
        this.helpers.awaitElement('.download_button[href]', a => {
            this.helpers.safelyNavigate(a.href)
        })
    }
}

export const matches = ['akoam.to']
