import BypassDefinition from './BypassDefinition.js'

export default class Bstlar extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            const boostellar_link = encodeURIComponent(location.pathname.slice(1))
            fetch(`https://bstlar.com/api/link?url=${boostellar_link}`).then(res => res.json().then((res) => {
                if (res?.link?.destination_url) {
                    this.helpers.safelyNavigate(res.link.destination_url)
                }
            }))
        })
    }
}

export const matches = ['bstlar.com']
