import BypassDefinition from './BypassDefinition.js'

export default class Anonym extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            const a = window.location.href.split('/').slice(-1)[0]
            this.helpers.safelyNavigate(`https://anonym.ninja/download/file/request/${a}`)
        })
    }
}

export const matches = ['anonym.ninja']
