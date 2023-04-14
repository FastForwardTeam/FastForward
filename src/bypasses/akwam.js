import BypassDefinition from './BypassDefinition.js'

export default class Akwam extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        window.setInterval = f => setInterval(f, 1)
        this.helpers.awaitElement("a.download_button[href]", a => {this.helpers.safelyNavigate(a.href)})
    }
}

export const matches = ['akwam.org', 'akw.to']
