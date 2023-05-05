import BypassDefinition from './BypassDefinition.js'

export default class Blitly extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        const target_url = new URLSearchParams(window.location.search).get('url')
        this.helpers.safelyNavigate(target_url)
    }
}

export const matches = ['blitly.io']
