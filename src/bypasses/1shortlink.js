import BypassDefinition from './BypassDefinition.js'

export default class ONEShortlink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.awaitElement('#redirect-link', e => {
            this.helpers.safelyNavigate(e.href);
        })
    }
}

export const matches = ['1shortlink.com']