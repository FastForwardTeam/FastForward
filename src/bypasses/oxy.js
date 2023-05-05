import BypassDefinition from './BypassDefinition.js'

export default class Oxy extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.ifElement("button#download[disabled]", d => {
            this.helpers.awaitElement("button#download:not([disabled])", d => {
                d.click()
            })
        })
    }
}

export const matches = ['oxy.cloud']
