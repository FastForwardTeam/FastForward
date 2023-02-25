import BypassDefinition from './BypassDefinition.js'

export default class Daominhha extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        let str = (new URL(location.href)).searchParams.get('url')
        str = str.split("").reverse().join("")
        str = str.replaceAll("-", "+")
        str = str.replaceAll(".", "/")
        str = str.replaceAll(",", "=")
        this.helpers.safelyAssign(atob(str))
    }
}

export const matches = ['daominhha.com/download']
