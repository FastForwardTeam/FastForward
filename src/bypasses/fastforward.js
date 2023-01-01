import BypassDefinition from './BypassDefinition.js'

export default class Fastforward extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        window.fastForwardInstalled = true
        window.fastForwardInternalVersion = "FAST_FORWARD_INTERNAL_VERSION"
        window.fastForwardExternalVersion = "FAST_FORWARD_EXTERNAL_VERSION"
        window.fastForwardInjectionVersion = "FAST_FORWARD_INJECTION_VERSION"

        if (['/bypassed', '/navigate'].includes(location.pathname)) {
            location.assign(`https://universal-bypass.org${location.pathname}${location.search}`)
        }
    }
}

export const matches = ['fastforward.team']
