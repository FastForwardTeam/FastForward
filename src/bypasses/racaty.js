import BypassDefinition from './BypassDefinition.js'

export default class CustomDomainBypass extends BypassDefinition {
    constructor() {
        super()
        // Custom bypass required bases can be set here
    }

    execute() {
        window.setTimeout = f => setTimeout(f, 1)
    }
}

export const matches = ['racaty.com', 'longfiles.com', 'filepuma.com', 'portableapps.com', 'indishare.org', 'datei.to', 'keisekai.fun', 'solvetube.site']
