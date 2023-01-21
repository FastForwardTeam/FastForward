import BypassDefinition from './BypassDefinition.js'

export default class Leitup extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        this.helpers.ifElement('input.form-control[type="text"]', (input) => {
            let destination = input.attributes.placeholder.value
            this.helpers.safelyNavigate(destination)
        })
    }
}

export const matches = ['leitup.com']
