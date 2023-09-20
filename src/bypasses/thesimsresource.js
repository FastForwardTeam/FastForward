import BypassDefinition from './BypassDefinition.js'

export default class TheSimsResource extends BypassDefinition {
    constructor() {
        super()
        // Custom bypass required bases can be set here
    }

    execute() {
        window.setTimeout = f => setTimeout(f, 1)
    }
}

export const matches = ['thesimsresource.com/downloads/details/id/']
