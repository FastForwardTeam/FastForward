import BypassDefinition from './BypassDefinition.js'

export default class Boost extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        // Based off of bloggerpemula's bypass: https://greasyfork.org/en/scripts/431691-bypass-all-shortlinks/code
        fetch(location.href).then(bo => bo.text()).then(html => this.helpers.safelyNavigate(atob(html.split('bufpsvdhmjybvgfncqfa="')[1].split('"')[0])))
    }
}

export const matches = ['boost.ink']
