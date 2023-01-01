import BypassDefinition from './BypassDefinition.js'

export default class Srtam extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        this.helpers.ensureDomLoaded(() => {
            if (document.querySelector(".skip-container")) {
                let form = document.createElement("form")
                form.method = "POST"
                form.innerHTML = "<input type=\"hidden\" name=\"_image\" value=\"Continue\">"
                form = document.documentElement.appendChild(form)
                this.helpers.countIt(() => form.submit())
            }
        })
    }
}

export const matches = ['srt.am']
