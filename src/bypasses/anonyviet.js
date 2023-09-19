import BypassDefinition from './BypassDefinition.js';

export default class AnonyVietBypass extends BypassDefinition {
    constructor() {
        super();
        this.ensure_dom = true
    }

    execute() {
        const match = document.URL.match(/anonyviet\.com\/[^?]+\?url=([^&]+)/);
        if (match) {
            this.helpers.safelyNavigate(decodeURIComponent(match[1]));
        }
    }
}

export const matches = ['anonyviet.com/'];

