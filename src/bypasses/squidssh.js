import BypassDefinition from './BypassDefinition.js'

export default class Squidssh extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        let p = atob((new URLSearchParams(location.search)).get('short'))
        crowdPath(p)
        crowdBypass(() => this.helpers.ifElement("form[action='/user/links']", f => f.action += "#" + p))
    }
}

export const matches = ['squidssh.com/li/go.php', 'goodssh.com/li/go.php']
