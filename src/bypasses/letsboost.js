import BypassDefinition from './BypassDefinition.js'

export default class Letsboost extends BypassDefinition {
    constructor() {
        super();
        this.ensure_dom = true;
    }

    execute() {
        alert("FastForward: If nothing happens in a few seconds, the bypass couldn't be executed. Please disable your ad blocker and refresh the page. Press OK to continue.");
        this.helpers.insertInfoBox("If nothing happens in a few seconds, the bypass couldn't be executed. Please disable your ad blocker and refresh the page.");
        this.helpers.awaitElement("script:last-of-type:not([src])", () => {
            const lastScript = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];
            const scriptContent = lastScript.innerHTML;
            const jsonDat = JSON.parse(scriptContent.match(/stepDat = '(.*)';/)[1]);
            const url = jsonDat[jsonDat.length-1]["url"];
            this.helpers.safelyNavigate(url);
        });
    }
}


export const matches = ['letsboost.net'];