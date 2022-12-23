import BypassDefinition from './BypassDefinition.js'

export default class Brpaper extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            const loc = location.href.replace("downloads", "downloader")
            this.helpers.safelyNavigate(loc)
        })
    }
}

export const matches = ['brpaper.com']
