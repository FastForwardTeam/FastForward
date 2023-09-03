import BypassDefinition from './BypassDefinition.js'

export default class ONELink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.safelyNavigate(document.querySelector('a#download').href);
    }
}

export const matches = ['1link.club']