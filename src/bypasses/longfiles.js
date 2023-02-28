import BypassDefinition from './BypassDefinition.js'

export default class Longfiles extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        window.setTimeout = f => this.helpers.setTimeout(f, 1)
    }
}

export const matches = ['longfiles.com', 'filepuma.com', 'portableapps.com', 'indishare.org', 'solvetube.site']
