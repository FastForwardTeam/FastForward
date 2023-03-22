import BypassDefinition from './BypassDefinition.js'

export default class Fssquad extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.ifElement("div#wpsafe-link", d => {
            this.helpers.safelyNavigate(d.getElementsByTagName("a")[0].onclick())
        })
    }
}

export const matches = ['fssquad.com']
