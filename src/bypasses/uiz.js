import BypassDefinition from './BypassDefinition.js'

export default class Uiz extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        Object.freeze(location)
        this.helpers.ensureDomLoaded(() => {
            const regHere = /.*window\.location\.href = "(http[^"]+)";.*/
            document.querySelectorAll("script").forEach(script => {
                let match = regHere.exec(script.textContent)
                if (match && match[1]){
                    this.helpers.crowdPath(bypassClipboard)
                    this.helpers.contributeAndNavigate(match[1])

                }
            })
        })
    }
}

export const matches = ['uiz.io', 'uiz.app', 'tlkm.id']
