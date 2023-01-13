import BypassDefinition from './BypassDefinition.js'

export default class Onelinefix extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        window.setTimeout = f => setTimeout(f,1)
        this.helpers.awaitElement("#res > center > button.btn[onclick]", but => but.onclick())
    }
}

export const matches = ['online-fix.me/ext/']
