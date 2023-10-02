import BypassDefinition from './BypassDefinition.js'

export default class Rekonise extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        let xhr = new XMLHttpRequest()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText)
            this.helpers.safelyNavigate(data.url)
        }
        xhr.open(
            'GET',
            `https://api.rekonise.com/social-unlocks${location.pathname}`,
            true
        )
        xhr.send()
    }
}
export const matches = ['rekonise.com']
