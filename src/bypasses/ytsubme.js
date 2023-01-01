import BypassDefinition from './BypassDefinition.js'

export default class Ytsubme extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() =>{
            this.helpers.ifElement("a#link", addr => {
                this.helpers.safelyNavigate(addr.href)
            })
        })
    }
}

export const matches = ['ytsubme.com']
