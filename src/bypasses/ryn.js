import BypassDefinition from "./BypassDefinition.js"

export default class Ryn extends BypassDefinition {
    constructor() {
        super()
    }
    execute() {
        if (typeof countdown == "function") {
            document.write('<div id="link"><p id="timer">0</p></div>')
            this.helpers.countdown()
            this.helpers.safelyNavigate(document.querySelector("#link > a").href)
        }
    }
}

export const matches = ['ryn.cc']