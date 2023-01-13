import BypassDefinition from './BypassDefinition.js'

export default class Linkspy extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        const url = document.getElementsByClassName("skipButton")[0].getAttribute("href")
        this.helpers.safelyNavigate(url)
    }
}

export const matches = ['linkspy.cc']
