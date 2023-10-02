import BypassDefinition from './BypassDefinition.js'

export default class Sub2unlock extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        const url = document.URL;
        let destination;

        if(url.includes("sub2unlock.com/link/unlock")) {
            destination = document.getElementById("link").getAttribute("href");
        } else {
            const urlSplit = url.split("/");
            destination = 'https://sub2unlock.com/link/unlock/' + urlSplit[urlSplit.length - 1];
        }

        this.helpers.safelyNavigate(destination);
    }
}

export const matches = ['sub2unlock.com']
