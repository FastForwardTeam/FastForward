import BypassDefinition from './BypassDefinition.js'

export default class Cpmlink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.ifElement('a#btn-main', a =>{
            this.helpers.crowdPath(location.pathname.substring(4))
            this.helpers.contributeAndNavigate(a.href)
        },() => this.helpers.crowdBypass())
    }
}

export const matches = ['cpmlink.net']
