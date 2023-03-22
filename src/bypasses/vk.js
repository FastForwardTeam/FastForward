import BypassDefinition from './BypassDefinition.js'

export default class Vk extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        this.helpers.safelyNavigate(decodeURIComponent(document.URL.match(/vk\.com\/away\.php\?to=([^&]+)/)[1]))
    }
}

export const matches = ['vk.com/away.php?to=']
