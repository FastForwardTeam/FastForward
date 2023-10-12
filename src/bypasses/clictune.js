import BypassDefinition from './BypassDefinition.js'

export default class Clictune extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        seconde = 0;
        Compteur();

        this.helpers.awaitElement('#compteur2 a[href]', a => {
            this.helpers.safelyNavigate(new URL(a.href).searchParams.get("url"))
        })
    }
}

export const matches = ['www.dlink2.net', 'www.dlink2.com', 'www.clictune.com']
