import BypassDefinition from './BypassDefinition.js'

export default class Sub4unlock extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        if (typeof fun2 == "function") {
            window.open = this.helpers.safelyNavigate
            fun2()
        }
    }
}

export const matches = ['sub4unlock.com']
