import BypassDefinition from './BypassDefinition.js'

export default class Mangalist extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.awaitElement("#btt > button.btn.btn-primary.text-center[onclick^='window.location.assign(']", b => {
            let o = b.getAttribute('onclick')
            this.helpers.safelyNavigate(o.substring(24, o.length - 3))
        })
    }
}

export const matches = ['mangalist.org']
