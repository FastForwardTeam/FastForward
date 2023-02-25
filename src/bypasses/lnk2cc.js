import BypassDefinition from './BypassDefinition.js'

export default class Lnk2cc extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        //Replace substr(0,4) with substring

        if (location.pathname.substring(0,5) === "/go/"){
            document.querySelector("form").submit()
        }
        else{
            this.helpers.crowdBypass()
        }
    }
}

export const matches = ['lnk2.cc']
