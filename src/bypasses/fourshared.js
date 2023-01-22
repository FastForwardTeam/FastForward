import BypassDefinition from './BypassDefinition.js'

export default class Fourshared extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        if (document.cookie.indexOf("exUserId=") === -1){
            document.cookie = "exUserId=0; domain=.4shared.com; path=/"
        }
    }
}

export const matches = ['4shared.com']
