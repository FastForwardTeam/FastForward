import BypassDefinition from "./BypassDefinition";

export default class Adfly extends BypassDefinition {
    constructor() {
        super();
    }

    execute() {
        const url = new URLSearchParams(window.location.search);
        const dest = url.get('dest');
        const finalUrl = decodeURIComponent(dest);
        this.helpers.safelyNavigate(finalUrl);
    }
}

export const matches = ['www93.davisonbarker.pro', 'www96.lowrihouston.pro'];
