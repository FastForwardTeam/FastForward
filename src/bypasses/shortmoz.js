import BypassDefinition from './BypassDefinition.js';

export default class Shortmoz extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        window.setInterval = f => setTimeout(f,1)
        this.helpers.awaitElement("a.btn.redirect[href^='http']", a =>
            this.helpers.safelyNavigate(a.href))
    }
}

export const matches = ['shortmoz.link']
