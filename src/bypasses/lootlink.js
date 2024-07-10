import BypassDefinition from './BypassDefinition.js'

export default class LootLink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        if (/[\?&]r=/.test(window.location.href.toString())) {
            const urlParams = new URLSearchParams(window.location.search)
            const r = urlParams.get('r')
            const finalURL = decodeURIComponent(escape(atob(r)));
            this.helpers.safelyNavigate(finalURL)
        }
    }
}

export const matches = ['lootlinks.co', 'loot-links.com', 'loot-link.com']
