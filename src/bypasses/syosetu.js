import BypassDefinition from './BypassDefinition.js'

export default class Syosetu extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        const [, second] = document.URL.match(/.*syosetu\.org\/\?mode=url_jump&url=(.+)/);
        this.helpers.safelyNavigate(
            decodeURIComponent(second)
        )
    }
}

export const matches = ['syosetu.org']
